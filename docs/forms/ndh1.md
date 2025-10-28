# NDH-1 Migration Notes

## Frontend
- `/forms/ndh1` powered by `phase3-form.component.ts` with configuration entry `PHASE3_FORM_CONFIG.ndh1`.
- Template supports the NDH ratios/member data text areas recorded in the config file.
- Included in Jest + Playwright coverage (`frontend/tests/forms-phase3.spec.ts`).

## Backend
- Model: `Ndh1Submission` (JSON metadata) defined in `services/forms/app/models/json_submission.py`.
- Router: `services/forms/app/api/routes/ndh1.py`.
- Async API test: `services/forms/tests/test_phase3_forms_api.py`.

## Data
- Migration SQL: `services/forms/migrations/010_create_ndh1.sql`.
- Sample payload: `services/forms/tests/data/phase3_generic_sample.json`.
