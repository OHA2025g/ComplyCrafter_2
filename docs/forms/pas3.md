# PAS3 Migration Notes

## Frontend
- Module: `frontend/apps/portal/src/app/forms/pas3` with inventory-driven field metadata.
- Submits via `ApiClientService.savePas3()`.
- Tests: Jest spec + shared Playwright scenario (`tests/forms-phase2.spec.ts`).

## Backend
- Model: `services/forms/app/models/pas3.py`.
- Schemas/services/routes: `schemas/pas3.py`, `services/pas3_service.py`, `api/routes/pas3.py`.
- Tests: `services/forms/tests/test_pas3_api.py` with data fixture `tests/data/pas3_sample.json`.

## Data
- Migration SQL: `services/forms/migrations/003_create_pas3.sql`.
- Fixture payload aligns with inventory fields; extend via CLI dual-run when legacy endpoints are available.
