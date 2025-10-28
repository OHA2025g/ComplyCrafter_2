# AOC4 Migration Notes

## Frontend
- Route `/forms/aoc4` uses the shared `phase3-form` component (`frontend/apps/portal/src/app/forms/generic-form/phase3-form.component.ts`).
- Configuration lives in `PHASE3_FORM_CONFIG.aoc4` (`frontend/apps/portal/src/app/forms/generic-form/phase3-form.config.ts`).
- Covered by Jest spec (`phase3-form.component.spec.ts`) and Playwright scenario (`frontend/tests/forms-phase3.spec.ts`).

## Backend
- JSON-backed SQLAlchemy model: `services/forms/app/models/json_submission.py (Aoc4Submission)`.
- FastAPI router: `services/forms/app/api/routes/aoc4.py` powered by `JsonSubmissionService`.
- Tests: `services/forms/tests/test_phase3_forms_api.py` (parameterised to hit /forms/aoc4).

## Data
- Migration SQL: `services/forms/migrations/005_create_aoc4.sql` (JSONB payload storage + metadata columns).
- Sample payload for dual-run: `services/forms/tests/data/phase3_generic_sample.json`.
