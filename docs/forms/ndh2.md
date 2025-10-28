# NDH-2 Migration Notes

## Frontend
- `/forms/ndh2` uses the shared Phase 3 component + config entry `PHASE3_FORM_CONFIG.ndh2`.
- Form captures extension rationale and supporting details defined in the config file.
- Covered by Jest + Playwright (`frontend/tests/forms-phase3.spec.ts`).

## Backend
- Model: `Ndh2Submission` (JSON) in `services/forms/app/models/json_submission.py`.
- Router: `services/forms/app/api/routes/ndh2.py` (shared service).
- Regression coverage: `services/forms/tests/test_phase3_forms_api.py`.

## Data
- Migration SQL: `services/forms/migrations/011_create_ndh2.sql`.
- Sample payload: `services/forms/tests/data/phase3_generic_sample.json`.
