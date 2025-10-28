# ADR 0001 – Tech Stack Approval

## Status
Accepted (Phase 0 kickoff)

## Context
The ComplyCrafter modernization requires a modern frontend and backend stack capable of rapid iteration, typed contracts, and cloud-native deployments.

## Decision
- Frontend: Angular 17 + Nx, TailwindCSS, NgRx Signals, Storybook, Jest, Cypress, Playwright.
- Backend: FastAPI (Python 3.11), Pydantic v2, SQLAlchemy 2.0, Alembic, Celery/RQ for jobs.
- Tooling: Nx, Poetry, Docker, Kubernetes (Helm), GitHub Actions, OpenTelemetry.
- Auth: Keycloak or Auth0 with OAuth2/OIDC and JWT validation across services.

## Consequences
- Requires new skillsets (Angular, FastAPI) and training for existing team.
- Enables typed shared contracts via OpenAPI/JSON Schema.
- Supports incremental rollout using feature flags and dual-run testing.
- Necessitates new CI/CD and observability stack.
