# DPT3 Migration Notes

## Frontend
- Module: `frontend/apps/portal/src/app/forms/dpt3` renders 50+ deposit fields via metadata.
- Uses `ApiClientService.saveDpt3()` for submissions.
- Tests: Jest spec + Playwright scenario (phase2 spec).

## Backend
- Model/schemas/service/route: `services/forms/app/models/dpt3.py`, `schemas/dpt3.py`, `services/dpt3_service.py`, `api/routes/dpt3.py`.
- Test: `services/forms/tests/test_dpt3_api.py` with fixture `tests/data/dpt3_sample.json`.

## Data
- Migration SQL: `services/forms/migrations/004_create_dpt3.sql`.
- Sample payload + dual-run instructions documented under `docs/runbooks/dual-run.md`.
