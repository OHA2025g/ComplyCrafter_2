# Production Operations Runbook

## Overview
This runbook provides operational procedures for managing the ComplyCrafter production environment after Phase 4 completion.

## System Architecture

### Services
- **Gateway**: API gateway and request routing
- **Forms**: Statutory form processing service
- **Compliance**: Company, auditor, shareholder management
- **Billing**: Payment and subscription management
- **Jobs**: Background task processing

### Infrastructure
- **Kubernetes**: Container orchestration
- **PostgreSQL**: Primary database
- **Redis**: Caching and session storage
- **Prometheus**: Metrics collection
- **Grafana**: Monitoring dashboards
- **AlertManager**: Alert routing

## Daily Operations

### Morning Health Check
1. **System Status**
   ```bash
   # Check all pods running
   kubectl get pods -n comply-crafter
   
   # Check service health
   curl -f https://comply-crafter.your-domain.com/healthz
   
   # Check database connectivity
   kubectl exec -n comply-crafter deployment/database -- psql -U postgres -c "SELECT 1;"
   ```

2. **Review Overnight Alerts**
   - Check AlertManager for any alerts
   - Review Grafana dashboards
   - Check application logs for errors
   - Verify backup completion

3. **Performance Review**
   - Check response time trends
   - Review error rates
   - Check resource utilization
   - Verify user activity levels

### Monitoring Checklist

#### Every 15 Minutes
- [ ] Check system health endpoints
- [ ] Review error logs
- [ ] Check resource usage
- [ ] Verify service availability

#### Every Hour
- [ ] Review performance metrics
- [ ] Check database performance
- [ ] Verify backup status
- [ ] Check queue depths

#### Every 4 Hours
- [ ] Review alert history
- [ ] Check disk space
- [ ] Verify log rotation
- [ ] Check certificate expiry

#### Daily
- [ ] Review capacity planning
- [ ] Check security updates
- [ ] Verify backup integrity
- [ ] Review user feedback

## Incident Response

### Severity Levels

#### P1 - Critical
- **Definition**: System down, data loss, security breach
- **Response Time**: 15 minutes
- **Escalation**: Immediate to on-call engineer and management
- **Examples**: Database corruption, complete service outage

#### P2 - High
- **Definition**: Major functionality impacted, performance severely degraded
- **Response Time**: 1 hour
- **Escalation**: On-call engineer, notify team lead
- **Examples**: High error rates, slow response times

#### P3 - Medium
- **Definition**: Minor functionality impacted, performance slightly degraded
- **Response Time**: 4 hours
- **Escalation**: On-call engineer
- **Examples**: Non-critical feature issues, minor performance issues

#### P4 - Low
- **Definition**: Cosmetic issues, minor bugs
- **Response Time**: Next business day
- **Escalation**: Regular support process
- **Examples**: UI inconsistencies, minor documentation issues

### Incident Response Process

1. **Detection**
   - Monitor alerts and dashboards
   - User reports
   - Automated health checks

2. **Initial Response**
   - Acknowledge incident
   - Assess severity level
   - Gather initial information
   - Notify stakeholders

3. **Investigation**
   - Check logs and metrics
   - Identify root cause
   - Assess impact
   - Document findings

4. **Resolution**
   - Implement fix
   - Verify resolution
   - Monitor for recurrence
   - Update documentation

5. **Post-Incident**
   - Conduct post-mortem
   - Update runbooks
   - Implement preventive measures
   - Share lessons learned

## Maintenance Procedures

### Database Maintenance

#### Daily
```bash
# Check database size
kubectl exec -n comply-crafter deployment/database -- psql -U postgres -c "
SELECT pg_size_pretty(pg_database_size('comply_crafter'));"

# Check connection count
kubectl exec -n comply-crafter deployment/database -- psql -U postgres -c "
SELECT count(*) FROM pg_stat_activity;"

# Check slow queries
kubectl exec -n comply-crafter deployment/database -- psql -U postgres -c "
SELECT query, mean_time, calls FROM pg_stat_statements 
ORDER BY mean_time DESC LIMIT 10;"
```

#### Weekly
```bash
# Update statistics
kubectl exec -n comply-crafter deployment/database -- psql -U postgres -c "
ANALYZE;"

# Check for bloat
kubectl exec -n comply-crafter deployment/database -- psql -U postgres -c "
SELECT schemaname, tablename, n_dead_tup, n_live_tup 
FROM pg_stat_user_tables 
WHERE n_dead_tup > 1000;"
```

#### Monthly
```bash
# Vacuum analyze
kubectl exec -n comply-crafter deployment/database -- psql -U postgres -c "
VACUUM ANALYZE;"

# Check index usage
kubectl exec -n comply-crafter deployment/database -- psql -U postgres -c "
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch 
FROM pg_stat_user_indexes 
ORDER BY idx_scan DESC;"
```

### Application Maintenance

#### Deployment
```bash
# Deploy new version
kubectl set image deployment/comply-crafter-gateway \
  gateway=comply-crafter/gateway:v1.2.3 -n comply-crafter

# Verify deployment
kubectl rollout status deployment/comply-crafter-gateway -n comply-crafter

# Rollback if needed
kubectl rollout undo deployment/comply-crafter-gateway -n comply-crafter
```

#### Configuration Updates
```bash
# Update config map
kubectl patch configmap app-config -n comply-crafter --type='merge' -p='
{
  "data": {
    "new-setting": "new-value"
  }
}'

# Restart pods to pick up changes
kubectl rollout restart deployment/comply-crafter-gateway -n comply-crafter
```

### Infrastructure Maintenance

#### Certificate Renewal
```bash
# Check certificate expiry
kubectl get certificates -n comply-crafter

# Renew if needed
kubectl annotate certificate comply-crafter-tls cert-manager.io/renew-before="720h" -n comply-crafter
```

#### Node Maintenance
```bash
# Drain node
kubectl drain node-1 --ignore-daemonsets --delete-emptydir-data

# After maintenance, uncordon
kubectl uncordon node-1
```

## Backup and Recovery

### Backup Procedures

#### Database Backup
```bash
# Create backup
kubectl exec -n comply-crafter deployment/database -- pg_dump -U postgres comply_crafter > backup-$(date +%Y%m%d).sql

# Compress backup
gzip backup-$(date +%Y%m%d).sql

# Upload to cloud storage
aws s3 cp backup-$(date +%Y%m%d).sql.gz s3://comply-crafter-backups/database/
```

#### Configuration Backup
```bash
# Backup Kubernetes resources
kubectl get all -n comply-crafter -o yaml > k8s-backup-$(date +%Y%m%d).yaml

# Backup secrets
kubectl get secrets -n comply-crafter -o yaml > secrets-backup-$(date +%Y%m%d).yaml
```

### Recovery Procedures

#### Database Recovery
```bash
# Download backup
aws s3 cp s3://comply-crafter-backups/database/backup-20240101.sql.gz .

# Decompress
gunzip backup-20240101.sql.gz

# Restore database
kubectl exec -n comply-crafter deployment/database -- psql -U postgres -d comply_crafter -f /backup/backup-20240101.sql
```

#### Full System Recovery
```bash
# Restore Kubernetes resources
kubectl apply -f k8s-backup-20240101.yaml

# Restore secrets
kubectl apply -f secrets-backup-20240101.yaml

# Restore database
# (See database recovery procedure above)
```

## Security Procedures

### Access Management
- Use least privilege principle
- Rotate credentials regularly
- Monitor access logs
- Use multi-factor authentication

### Vulnerability Management
- Regular security scans
- Patch management
- Dependency updates
- Security monitoring

### Incident Response
- Security incident playbook
- Forensic procedures
- Communication protocols
- Legal requirements

## Performance Optimization

### Monitoring Performance
- Set up performance baselines
- Monitor key metrics
- Identify bottlenecks
- Track improvements

### Optimization Strategies
- Database query optimization
- Caching strategies
- Resource scaling
- Code optimization

### Capacity Planning
- Monitor resource usage
- Plan for growth
- Scale proactively
- Cost optimization

## Documentation Maintenance

### Keeping Documentation Current
- Update runbooks after changes
- Document new procedures
- Review and update regularly
- Version control documentation

### Knowledge Sharing
- Regular team reviews
- Cross-training
- Documentation reviews
- Best practices sharing

## Emergency Procedures

### System Down
1. Check service status
2. Review logs
3. Check infrastructure
4. Escalate if needed
5. Communicate status

### Data Corruption
1. Stop affected services
2. Assess damage
3. Restore from backup
4. Verify data integrity
5. Resume services

### Security Breach
1. Isolate affected systems
2. Assess impact
3. Notify security team
4. Follow incident response
5. Document everything

Remember: When in doubt, escalate. It's better to over-communicate than to miss something critical.
