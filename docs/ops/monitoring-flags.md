# Monitoring & Feature-Flag Rollout

## Feature Flag
- File: `ops/feature-flags/flags.example.json`
- Flag: `adt1_modern_stack`
- Rollout plan:
  1. Start with internal users only.
  2. Monitor metrics (see below) for 24h.
  3. Gradually increase traffic.

## Observability Dashboards
- Metrics to track:
  - HTTP success/error rates for `/forms/adt1` (legacy vs modern).
  - Latency (P50/P95) for ADT1 submissions.
  - Dual-run diff counts.
- Tools: Prometheus/Grafana (placeholder). Create dashboard `ADT1 Migration` with above panels.

## Alerting
- Trigger alert if error rate >2% or diff count >0 for 5 minutes.
- Slack channel: `#adt1-migration`.
