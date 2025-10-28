# MSME Form I Migration Notes

## Frontend
- `/forms/msme` depends on the shared Phase 3 component + config entry `PHASE3_FORM_CONFIG.msme`.
- Select options for filing period defined in `frontend/apps/portal/src/app/forms/generic-form/phase3-form.config.ts`.
- Automated coverage via `phase3-form.component.spec.ts` and Playwright `forms-phase3.spec.ts`.

## Backend
- Model: `MsmeSubmission` inside `services/forms/app/models/json_submission.py`.
- Router: `services/forms/app/api/routes/msme.py` (shared JSON submission service).
- API regression: `services/forms/tests/test_phase3_forms_api.py` (parametrised case).

## Data
- Migration SQL: `services/forms/migrations/008_create_msme.sql`.
- Sample payload: `services/forms/tests/data/phase3_generic_sample.json`.
