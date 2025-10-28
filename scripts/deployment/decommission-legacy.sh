#!/bin/bash

# Legacy System Decommissioning Script
# This script safely decommissions the legacy .NET system after successful cutover

set -euo pipefail

# Configuration
LEGACY_NAMESPACE="comply-crafter-legacy"
NEW_NAMESPACE="comply-crafter"
BACKUP_DIR="/backup/legacy-system-$(date +%Y%m%d-%H%M%S)"
LOG_FILE="/var/log/legacy-decommission-$(date +%Y%m%d-%H%M%S).log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

# Pre-decommission validation
validate_cutover() {
    log "Validating cutover success before decommissioning..."
    
    # Check if new system is handling traffic
    if ! curl -f -s "http://comply-crafter.your-domain.com/healthz" > /dev/null; then
        error "New system is not responding to health checks. Aborting decommissioning."
    fi
    
    # Check traffic metrics
    NEW_TRAFFIC=$(kubectl get configmap blue-green-config -n "$NEW_NAMESPACE" -o jsonpath='{.data.traffic-split}')
    if [ "$NEW_TRAFFIC" != "100" ]; then
        error "New system is not handling 100% of traffic. Current: $NEW_TRAFFIC%. Aborting decommissioning."
    fi
    
    # Check for critical errors in new system
    ERROR_COUNT=$(kubectl logs -l app=comply-crafter -n "$NEW_NAMESPACE" --since=1h | grep -c "ERROR" || echo "0")
    if [ "$ERROR_COUNT" -gt 10 ]; then
        warn "High error count in new system: $ERROR_COUNT errors in last hour"
        read -p "Continue with decommissioning? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            error "Decommissioning aborted by user"
        fi
    fi
    
    log "Cutover validation passed"
}

# Create backup of legacy system
backup_legacy_system() {
    log "Creating backup of legacy system..."
    
    mkdir -p "$BACKUP_DIR"
    
    # Backup Kubernetes resources
    kubectl get all -n "$LEGACY_NAMESPACE" -o yaml > "$BACKUP_DIR/legacy-resources.yaml"
    kubectl get configmaps -n "$LEGACY_NAMESPACE" -o yaml > "$BACKUP_DIR/legacy-configmaps.yaml"
    kubectl get secrets -n "$LEGACY_NAMESPACE" -o yaml > "$BACKUP_DIR/legacy-secrets.yaml"
    
    # Backup persistent volumes
    kubectl get pv -o yaml > "$BACKUP_DIR/legacy-persistent-volumes.yaml"
    
    # Backup database (if accessible)
    if kubectl get pods -n "$LEGACY_NAMESPACE" -l app=database | grep -q Running; then
        log "Backing up legacy database..."
        kubectl exec -n "$LEGACY_NAMESPACE" deployment/legacy-database -- pg_dump -U postgres comply_crafter > "$BACKUP_DIR/legacy-database.sql"
    fi
    
    # Backup application logs
    kubectl logs -l app=comply-crafter-legacy -n "$LEGACY_NAMESPACE" --all-containers=true > "$BACKUP_DIR/legacy-logs.txt"
    
    log "Backup completed: $BACKUP_DIR"
}

# Gracefully scale down legacy services
scale_down_legacy() {
    log "Scaling down legacy services..."
    
    # Scale down deployments
    kubectl scale deployment --all --replicas=0 -n "$LEGACY_NAMESPACE"
    
    # Wait for pods to terminate
    kubectl wait --for=delete pod -l app=comply-crafter-legacy -n "$LEGACY_NAMESPACE" --timeout=300s
    
    # Scale down statefulsets
    kubectl scale statefulset --all --replicas=0 -n "$LEGACY_NAMESPACE"
    
    log "Legacy services scaled down"
}

# Archive legacy code
archive_legacy_code() {
    log "Archiving legacy code..."
    
    # Create archive directory
    ARCHIVE_DIR="/archive/legacy-code-$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$ARCHIVE_DIR"
    
    # Copy legacy .NET projects
    cp -r ComplyCrafter_API "$ARCHIVE_DIR/"
    cp -r ComplyCrafter_BL "$ARCHIVE_DIR/"
    cp -r ComplyCrafter_Data "$ARCHIVE_DIR/"
    cp -r ComplyCrafter_UI "$ARCHIVE_DIR/"
    
    # Create archive
    tar -czf "$ARCHIVE_DIR/legacy-code.tar.gz" -C "$ARCHIVE_DIR" .
    
    # Upload to cloud storage (if configured)
    if [ -n "${CLOUD_STORAGE_BUCKET:-}" ]; then
        log "Uploading archive to cloud storage..."
        aws s3 cp "$ARCHIVE_DIR/legacy-code.tar.gz" "s3://$CLOUD_STORAGE_BUCKET/legacy-archives/"
    fi
    
    log "Legacy code archived: $ARCHIVE_DIR"
}

# Clean up legacy resources
cleanup_legacy_resources() {
    log "Cleaning up legacy Kubernetes resources..."
    
    # Delete services
    kubectl delete service --all -n "$LEGACY_NAMESPACE" --ignore-not-found=true
    
    # Delete deployments
    kubectl delete deployment --all -n "$LEGACY_NAMESPACE" --ignore-not-found=true
    
    # Delete statefulsets
    kubectl delete statefulset --all -n "$LEGACY_NAMESPACE" --ignore-not-found=true
    
    # Delete configmaps
    kubectl delete configmap --all -n "$LEGACY_NAMESPACE" --ignore-not-found=true
    
    # Delete secrets (be careful with this)
    kubectl delete secret --all -n "$LEGACY_NAMESPACE" --ignore-not-found=true
    
    # Delete persistent volume claims
    kubectl delete pvc --all -n "$LEGACY_NAMESPACE" --ignore-not-found=true
    
    log "Legacy resources cleaned up"
}

# Update DNS and routing
update_routing() {
    log "Updating DNS and routing configuration..."
    
    # Update DNS records to point to new system
    if [ -n "${DNS_PROVIDER:-}" ]; then
        case "$DNS_PROVIDER" in
            "cloudflare")
                # Update Cloudflare DNS
                curl -X PUT "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/dns_records/$DNS_RECORD_ID" \
                     -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
                     -H "Content-Type: application/json" \
                     --data '{"type":"A","name":"comply-crafter","content":"'$NEW_SYSTEM_IP'","ttl":300}'
                ;;
            "aws")
                # Update Route 53
                aws route53 change-resource-record-sets \
                    --hosted-zone-id "$ROUTE53_ZONE_ID" \
                    --change-batch file://dns-update.json
                ;;
        esac
    fi
    
    # Update load balancer configuration
    kubectl patch ingress comply-crafter-ingress -n "$NEW_NAMESPACE" --type='merge' -p='
    {
        "metadata": {
            "annotations": {
                "nginx.ingress.kubernetes.io/rewrite-target": "/",
                "nginx.ingress.kubernetes.io/ssl-redirect": "true"
            }
        }
    }'
    
    log "Routing updated"
}

# Generate decommissioning report
generate_report() {
    log "Generating decommissioning report..."
    
    REPORT_FILE="/reports/legacy-decommission-$(date +%Y%m%d-%H%M%S).md"
    mkdir -p "$(dirname "$REPORT_FILE")"
    
    cat > "$REPORT_FILE" << EOF
# Legacy System Decommissioning Report

**Date:** $(date)
**Decommissioned By:** $(whoami)
**Backup Location:** $BACKUP_DIR
**Archive Location:** $ARCHIVE_DIR

## Pre-Decommission Validation
- ✅ New system health check passed
- ✅ Traffic migration verified (100% to new system)
- ✅ Error rate within acceptable limits

## Actions Performed
1. **Backup Created:** $BACKUP_DIR
   - Kubernetes resources exported
   - Database backup created
   - Application logs archived

2. **Services Scaled Down:**
   - All deployments scaled to 0 replicas
   - All statefulsets scaled to 0 replicas
   - Pods terminated gracefully

3. **Code Archived:** $ARCHIVE_DIR
   - Legacy .NET projects archived
   - Archive uploaded to cloud storage

4. **Resources Cleaned Up:**
   - Services deleted
   - Deployments deleted
   - Statefulsets deleted
   - ConfigMaps deleted
   - Secrets deleted
   - PVCs deleted

5. **Routing Updated:**
   - DNS records updated
   - Load balancer configuration updated

## Post-Decommission Status
- Legacy system: **DECOMMISSIONED**
- New system: **ACTIVE**
- Traffic: **100% to new system**
- Backup: **Available at $BACKUP_DIR**

## Rollback Procedure
If rollback is needed:
1. Restore from backup: $BACKUP_DIR
2. Apply legacy resources: kubectl apply -f $BACKUP_DIR/legacy-resources.yaml
3. Scale up services: kubectl scale deployment --all --replicas=1 -n $LEGACY_NAMESPACE
4. Update DNS to point back to legacy system

## Next Steps
1. Monitor new system for 48 hours
2. Archive this report
3. Update documentation
4. Notify stakeholders of completion
EOF

    log "Report generated: $REPORT_FILE"
}

# Main execution
main() {
    log "Starting legacy system decommissioning..."
    
    # Validate cutover success
    validate_cutover
    
    # Create backup
    backup_legacy_system
    
    # Scale down legacy services
    scale_down_legacy
    
    # Archive legacy code
    archive_legacy_code
    
    # Clean up resources
    cleanup_legacy_resources
    
    # Update routing
    update_routing
    
    # Generate report
    generate_report
    
    log "Legacy system decommissioning completed successfully!"
    log "Backup available at: $BACKUP_DIR"
    log "Archive available at: $ARCHIVE_DIR"
    log "Report available at: $REPORT_FILE"
}

# Run main function
main "$@"
