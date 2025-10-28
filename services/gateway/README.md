# Gateway Service

FastAPI edge service that fronts downstream microservices and exposes a unified API for the Angular portal.

## Current State (Phase 0)
- `pyproject.toml` preloaded with FastAPI, SQLAlchemy, httpx, and dev tooling.
- `app/main.py` defines the FastAPI instance with `/healthz` and `/` routes.
- Settings handled via `app/config.py` using `pydantic-settings`.
- `tests/test_health.py` demonstrates pytest + httpx usage.
- Make targets (`install`, `run`, `lint`, `format`, `test`) codified in `Makefile`.

## Next Steps
1. Run `poetry install` to create the virtual environment (when Poetry is available).
2. Flesh out routing modules (e.g., `app/api/forms.py`) that proxy to downstream services.
3. Introduce auth middleware validating JWTs from Keycloak/Auth0.
4. Wire logging/observability (OpenTelemetry instrumentation).
5. Copy this scaffold into `services/forms`, `services/compliance`, `services/billing`, and `services/jobs`, adjusting dependencies as needed.
