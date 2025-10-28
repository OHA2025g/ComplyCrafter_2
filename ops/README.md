# Ops & Infrastructure

Central place for local orchestration, Kubernetes manifests, and infra-as-code.

## Phase 0 Action Items
- Author `docker-compose.yml` for Angular, FastAPI services, Postgres, Keycloak, Redis.
- Draft Helm charts skeleton (`k8s/helm/<service>`).
- Capture infra requirements in `terraform/` (networking, DB, secrets manager).
- Set up GitHub Actions workflows under `github-actions/` for CI/CD.
