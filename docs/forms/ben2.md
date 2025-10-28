# BEN2 Migration Notes

## Frontend
- Module: `frontend/apps/portal/src/app/forms/ben2` (dynamic field rendering from inventory metadata).
- Uses shared `ApiClientService.saveBen2()` to post payloads.
- Tests: Jest spec (`ben2.component.spec.ts`) and Playwright scenario (`tests/forms-phase2.spec.ts`).

## Backend
- SQLAlchemy model: `services/forms/app/models/ben2.py`.
- Schemas/services/routes: `schemas/ben2.py`, `services/ben2_service.py`, `api/routes/ben2.py`.
- Tests: `services/forms/tests/test_ben2_api.py` (async SQLite) with payload `tests/data/ben2_sample.json`.

## Data
- Migration SQL: `services/forms/migrations/002_create_ben2.sql`.
- Sample payload for dual-run stored under `docs/runbooks/dual-run.md` instructions.
