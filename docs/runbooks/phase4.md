# Phase 4 Runbook – Cutover & Decommission

## Overview
This runbook provides step-by-step instructions for completing Phase 4 of the ComplyCrafter modernization project, including traffic migration, legacy system decommissioning, and production readiness.

## Prerequisites
- [ ] Phase 3 completed successfully
- [ ] All form waves (3A, 3B, 3C) tested and validated
- [ ] Blue/green deployment infrastructure configured
- [ ] Monitoring and alerting systems operational
- [ ] Backup and rollback procedures tested
- [ ] Stakeholder approval for cutover

## Phase 4 Checklist

### 1. Pre-Cutover Validation
- [ ] Verify new system health and performance
- [ ] Confirm all critical functionality working
- [ ] Validate data integrity and consistency
- [ ] Test rollback procedures
- [ ] Review monitoring dashboards
- [ ] Notify stakeholders of cutover schedule

### 2. Traffic Migration
- [ ] Execute blue/green deployment
- [ ] Monitor traffic migration progress
- [ ] Validate 100% traffic to new system
- [ ] Verify all endpoints responding correctly
- [ ] Check error rates and performance metrics
- [ ] Confirm user sessions working properly

### 3. Legacy System Decommissioning
- [ ] Create comprehensive backup of legacy system
- [ ] Scale down legacy services gracefully
- [ ] Archive legacy code and configurations
- [ ] Clean up legacy Kubernetes resources
- [ ] Update DNS and routing configurations
- [ ] Verify no dependencies on legacy system

### 4. Production Readiness
- [ ] Activate monitoring and alerting
- [ ] Configure log aggregation
- [ ] Set up performance baselines
- [ ] Test backup and recovery procedures
- [ ] Update operational documentation
- [ ] Train support team on new system

### 5. Post-Cutover Monitoring
- [ ] Monitor system performance for 48 hours
- [ ] Watch for any issues or anomalies
- [ ] Collect performance metrics
- [ ] Document any issues and resolutions
- [ ] Gather user feedback
- [ ] Prepare post-mortem report

## Detailed Procedures

### Traffic Migration Procedure

1. **Pre-Migration Checks**
   ```bash
   # Check new system health
   curl -f https://comply-crafter.your-domain.com/healthz
   
   # Verify all services running
   kubectl get pods -n comply-crafter
   
   # Check database connectivity
   kubectl exec -n comply-crafter deployment/database -- psql -U postgres -c "SELECT 1;"
   ```

2. **Execute Migration**
   ```bash
   # Run automated migration workflow
   gh workflow run phase4-cutover.yml -f environment=green -f traffic_percentage=100
   
   # Monitor migration progress
   kubectl logs -f job/traffic-migration-job -n comply-crafter
   ```

3. **Verify Migration Success**
   ```bash
   # Check ingress configuration
   kubectl get ingress comply-crafter-ingress -n comply-crafter -o yaml
   
   # Verify traffic routing
   curl -H "Host: comply-crafter.your-domain.com" http://localhost/healthz
   
   # Check config map
   kubectl get configmap blue-green-config -n comply-crafter -o yaml
   ```

### Legacy System Decommissioning Procedure

1. **Create Backup**
   ```bash
   # Run decommissioning script
   ./scripts/decommission-legacy.sh
   
   # Verify backup created
   ls -la /backup/legacy-system-*
   ```

2. **Scale Down Legacy Services**
   ```bash
   # Scale down deployments
   kubectl scale deployment --all --replicas=0 -n comply-crafter-legacy
   
   # Wait for pods to terminate
   kubectl wait --for=delete pod -l app=comply-crafter-legacy -n comply-crafter-legacy --timeout=300s
   ```

3. **Archive Legacy Code**
   ```bash
   # Archive .NET projects
   tar -czf legacy-code-$(date +%Y%m%d).tar.gz ComplyCrafter_*
   
   # Upload to cloud storage
   aws s3 cp legacy-code-*.tar.gz s3://your-backup-bucket/legacy-archives/
   ```

4. **Clean Up Resources**
   ```bash
   # Delete legacy resources
   kubectl delete namespace comply-crafter-legacy
   
   # Clean up persistent volumes
   kubectl delete pv --selector=legacy=true
   ```

### Rollback Procedure

If issues are detected after cutover:

1. **Immediate Rollback**
   ```bash
   # Run rollback script
   ./scripts/rollback-legacy.sh
   
   # Verify rollback success
   curl -f https://comply-crafter.your-domain.com/healthz
   ```

2. **Investigate Issues**
   - Check logs for error patterns
   - Review performance metrics
   - Identify root cause
   - Document findings

3. **Plan Re-Migration**
   - Fix identified issues
   - Update migration plan
   - Schedule new cutover window
   - Notify stakeholders

## Monitoring and Alerting

### Key Metrics to Monitor
- **Response Time**: 95th percentile < 2 seconds
- **Error Rate**: < 0.1% of requests
- **Availability**: > 99.9% uptime
- **CPU Usage**: < 80% average
- **Memory Usage**: < 85% average
- **Database Connections**: < 80% of max

### Alert Thresholds
- **Critical**: Error rate > 1%, Response time > 5s, Pod down
- **Warning**: Error rate > 0.1%, Response time > 2s, High resource usage
- **Info**: Deployment events, Configuration changes

### Dashboard URLs
- **Overview**: https://grafana.your-domain.com/d/comply-crafter-overview
- **Infrastructure**: https://grafana.your-domain.com/d/comply-crafter-infrastructure
- **Database**: https://grafana.your-domain.com/d/comply-crafter-database

## Troubleshooting

### Common Issues

1. **High Error Rate**
   - Check application logs
   - Verify database connectivity
   - Check external service dependencies
   - Review recent deployments

2. **High Response Time**
   - Check CPU and memory usage
   - Review database query performance
   - Check network latency
   - Verify cache hit rates

3. **Database Issues**
   - Check connection pool settings
   - Review slow query log
   - Verify database resources
   - Check for deadlocks

4. **Service Unavailable**
   - Check pod status
   - Verify service endpoints
   - Check ingress configuration
   - Review resource limits

### Emergency Contacts
- **On-Call Engineer**: +1-XXX-XXX-XXXX
- **Database Admin**: +1-XXX-XXX-XXXX
- **Infrastructure Team**: +1-XXX-XXX-XXXX
- **Project Manager**: +1-XXX-XXX-XXXX

## Post-Cutover Tasks

### Immediate (0-2 hours)
- [ ] Monitor system metrics
- [ ] Check error logs
- [ ] Verify user functionality
- [ ] Test critical workflows
- [ ] Update status page

### Short-term (2-24 hours)
- [ ] Monitor performance trends
- [ ] Collect user feedback
- [ ] Document any issues
- [ ] Optimize based on metrics
- [ ] Update documentation

### Long-term (1-7 days)
- [ ] Complete post-mortem
- [ ] Update runbooks
- [ ] Train support team
- [ ] Plan optimizations
- [ ] Celebrate success!

## Success Criteria

Phase 4 is considered complete when:
- [ ] 100% traffic successfully migrated to new system
- [ ] Legacy system fully decommissioned
- [ ] All monitoring and alerting operational
- [ ] Performance meets or exceeds baseline
- [ ] No critical issues for 48 hours
- [ ] Post-mortem completed and documented
- [ ] Stakeholders notified of completion

## Rollback Criteria

Immediate rollback should be executed if:
- Error rate exceeds 1% for more than 5 minutes
- Response time exceeds 5 seconds for more than 10 minutes
- Any critical service becomes unavailable
- Data integrity issues are detected
- User complaints exceed normal threshold

Remember: It's better to rollback quickly and fix issues than to let problems compound.
