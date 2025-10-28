# MSME-1 Migration Notes

## Frontend
- `/forms/msme1` leverages the Phase 3 generic component and config entry `PHASE3_FORM_CONFIG.msme1`.
- Component + config live under `frontend/apps/portal/src/app/forms/generic-form`.
- Jest + Playwright coverage identical to other Phase 3 routes.

## Backend
- Model: `Msme1Submission` (JSON storage) within `services/forms/app/models/json_submission.py`.
- Router: `services/forms/app/api/routes/msme1.py`.
- Tested by `services/forms/tests/test_phase3_forms_api.py`.

## Data
- Migration SQL: `services/forms/migrations/009_create_msme1.sql`.
- Sample payload: `services/forms/tests/data/phase3_generic_sample.json`.
