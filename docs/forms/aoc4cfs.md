# AOC4CFS Migration Notes

## Frontend
- Route `/forms/aoc4cfs` uses the shared `phase3-form` component with config entry `PHASE3_FORM_CONFIG.aoc4cfs`.
- Component + config paths: `frontend/apps/portal/src/app/forms/generic-form/phase3-form.component.ts` and `.config.ts`.
- Regression coverage: Jest spec (`phase3-form.component.spec.ts`) + Playwright scenario (`frontend/tests/forms-phase3.spec.ts`).

## Backend
- SQLAlchemy class `Aoc4cfsSubmission` defined in `services/forms/app/models/json_submission.py`.
- Router `services/forms/app/api/routes/aoc4cfs.py` uses the shared `JsonSubmissionService`.
- API tested via `services/forms/tests/test_phase3_forms_api.py`.

## Data
- Migration SQL: `services/forms/migrations/006_create_aoc4cfs.sql`.
- Sample payload: `services/forms/tests/data/phase3_generic_sample.json`.
