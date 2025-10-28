# MGT7A Migration Notes

## Frontend
- `/forms/mgt7a` served by the generic Phase 3 component (`frontend/apps/portal/src/app/forms/generic-form/phase3-form.component.ts`).
- Field definitions captured under `PHASE3_FORM_CONFIG.mgt7a` (same folder).
- Tests: Jest spec for the component + Playwright Phase 3 suite (`frontend/tests/forms-phase3.spec.ts`).

## Backend
- JSON submission model `Mgt7aSubmission` (`services/forms/app/models/json_submission.py`).
- Router `services/forms/app/api/routes/mgt7a.py` with shared `JsonSubmissionService`.
- Covered by `services/forms/tests/test_phase3_forms_api.py`.

## Data
- Migration SQL: `services/forms/migrations/007_create_mgt7a.sql`.
- Sample payload: `services/forms/tests/data/phase3_generic_sample.json`.
