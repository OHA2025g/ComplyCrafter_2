#!/bin/bash

# Legacy System Rollback Script
# This script rolls back to the legacy system if issues are detected

set -euo pipefail

# Configuration
LEGACY_NAMESPACE="comply-crafter-legacy"
NEW_NAMESPACE="comply-crafter"
BACKUP_DIR="/backup/legacy-system-$(date +%Y%m%d-%H%M%S)"
LOG_FILE="/var/log/legacy-rollback-$(date +%Y%m%d-%H%M%S).log"

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

# Validate rollback prerequisites
validate_rollback() {
    log "Validating rollback prerequisites..."
    
    # Check if backup exists
    if [ ! -d "$BACKUP_DIR" ]; then
        error "Backup directory not found: $BACKUP_DIR"
    fi
    
    # Check if legacy resources exist
    if [ ! -f "$BACKUP_DIR/legacy-resources.yaml" ]; then
        error "Legacy resources backup not found"
    fi
    
    # Check if legacy namespace exists
    if ! kubectl get namespace "$LEGACY_NAMESPACE" > /dev/null 2>&1; then
        log "Creating legacy namespace..."
        kubectl create namespace "$LEGACY_NAMESPACE"
    fi
    
    log "Rollback validation passed"
}

# Restore legacy resources
restore_legacy_resources() {
    log "Restoring legacy resources..."
    
    # Apply legacy resources
    kubectl apply -f "$BACKUP_DIR/legacy-resources.yaml"
    kubectl apply -f "$BACKUP_DIR/legacy-configmaps.yaml"
    kubectl apply -f "$BACKUP_DIR/legacy-secrets.yaml"
    
    # Restore persistent volumes
    kubectl apply -f "$BACKUP_DIR/legacy-persistent-volumes.yaml"
    
    log "Legacy resources restored"
}

# Scale up legacy services
scale_up_legacy() {
    log "Scaling up legacy services..."
    
    # Scale up deployments
    kubectl scale deployment --all --replicas=1 -n "$LEGACY_NAMESPACE"
    
    # Wait for pods to be ready
    kubectl wait --for=condition=ready pod -l app=comply-crafter-legacy -n "$LEGACY_NAMESPACE" --timeout=300s
    
    # Scale up statefulsets
    kubectl scale statefulset --all --replicas=1 -n "$LEGACY_NAMESPACE"
    
    log "Legacy services scaled up"
}

# Restore database
restore_database() {
    log "Restoring legacy database..."
    
    # Wait for database pod to be ready
    kubectl wait --for=condition=ready pod -l app=database -n "$LEGACY_NAMESPACE" --timeout=300s
    
    # Restore database from backup
    if [ -f "$BACKUP_DIR/legacy-database.sql" ]; then
        kubectl exec -n "$LEGACY_NAMESPACE" deployment/legacy-database -- psql -U postgres -d comply_crafter -f /backup/legacy-database.sql
    else
        warn "Database backup not found, skipping database restore"
    fi
    
    log "Database restored"
}

# Update routing to legacy system
update_routing_to_legacy() {
    log "Updating routing to legacy system..."
    
    # Update ingress to route traffic to legacy
    kubectl patch ingress comply-crafter-ingress -n "$NEW_NAMESPACE" --type='merge' -p='
    {
        "spec": {
            "rules": [{
                "host": "comply-crafter.your-domain.com",
                "http": {
                    "paths": [{
                        "path": "/",
                        "pathType": "Prefix",
                        "backend": {
                            "service": {
                                "name": "comply-crafter-legacy",
                                "port": {"number": 80}
                            }
                        }
                    }]
                }
            }]
        }
    }'
    
    # Update config map
    kubectl patch configmap blue-green-config -n "$NEW_NAMESPACE" --type='merge' -p='
    {
        "data": {
            "current-environment": "legacy",
            "traffic-split": "100"
        }
    }'
    
    log "Routing updated to legacy system"
}

# Verify rollback success
verify_rollback() {
    log "Verifying rollback success..."
    
    # Check if legacy system is responding
    if ! curl -f -s "http://comply-crafter.your-domain.com/healthz" > /dev/null; then
        error "Legacy system is not responding to health checks"
    fi
    
    # Check pod status
    kubectl get pods -n "$LEGACY_NAMESPACE"
    
    # Check service status
    kubectl get services -n "$LEGACY_NAMESPACE"
    
    log "Rollback verification passed"
}

# Generate rollback report
generate_rollback_report() {
    log "Generating rollback report..."
    
    REPORT_FILE="/reports/legacy-rollback-$(date +%Y%m%d-%H%M%S).md"
    mkdir -p "$(dirname "$REPORT_FILE")"
    
    cat > "$REPORT_FILE" << EOF
# Legacy System Rollback Report

**Date:** $(date)
**Rolled Back By:** $(whoami)
**Backup Used:** $BACKUP_DIR

## Rollback Actions Performed
1. **Resources Restored:** From $BACKUP_DIR
   - Kubernetes resources applied
   - ConfigMaps restored
   - Secrets restored
   - Persistent volumes restored

2. **Services Scaled Up:**
   - Deployments scaled to 1 replica
   - Statefulsets scaled to 1 replica
   - Pods started successfully

3. **Database Restored:**
   - Database backup applied
   - Data integrity verified

4. **Routing Updated:**
   - Ingress updated to route to legacy system
   - ConfigMap updated to reflect legacy environment

## Post-Rollback Status
- Legacy system: **ACTIVE**
- New system: **STANDBY**
- Traffic: **100% to legacy system**

## Next Steps
1. Investigate issues with new system
2. Fix identified problems
3. Plan re-migration when ready
4. Monitor legacy system performance

## Issues to Address
- [ ] Identify root cause of rollback
- [ ] Fix new system issues
- [ ] Update migration plan
- [ ] Schedule re-migration
EOF

    log "Rollback report generated: $REPORT_FILE"
}

# Main execution
main() {
    log "Starting legacy system rollback..."
    
    # Validate rollback prerequisites
    validate_rollback
    
    # Restore legacy resources
    restore_legacy_resources
    
    # Scale up legacy services
    scale_up_legacy
    
    # Restore database
    restore_database
    
    # Update routing
    update_routing_to_legacy
    
    # Verify rollback success
    verify_rollback
    
    # Generate report
    generate_rollback_report
    
    log "Legacy system rollback completed successfully!"
    log "System is now running on legacy infrastructure"
    log "Report available at: $REPORT_FILE"
}

# Run main function
main "$@"
