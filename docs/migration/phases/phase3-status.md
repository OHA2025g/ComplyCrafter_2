# Phase 3 – Form Waves Status

Use this log to track execution of Phase 3, where we migrate the remaining statutory forms in waves aligned to compliance categories.

## Target Waves
- **Wave 3A – Financial statements**: AOC4, AOC4CFS, MGT7A (high-volume filings with heavy attachments).
- **Wave 3B – MSME disclosures**: MSME, MSME1 (requires generator enhancements + additional validation logic).
- **Wave 3C – NBFC/Nidhi compliance**: NDH1, NDH2 (missing data-layer definitions in legacy code; needs discovery and schema authoring).

## Not Started
- (none)

## In Progress
- (none)

## Done
- Wave 3A – AOC4/AOC4CFS/MGT7A now live in Angular (`phase3-form.component.ts`), FastAPI (`api/routes/aoc4*.py`, `mgt7a.py`), SQL migrations `005-007`, and automated tests (Playwright + pytest).
- Wave 3B – MSME/MSME1 shipped with select-field support, docs under `docs/forms/msme*.md`, migrations `008-009`, and coverage in `test_phase3_forms_api.py`.
- Wave 3C – NDH1/NDH2 JSON schemas + migrations (`010-011`) implemented alongside UI routes `/forms/ndh1` and `/forms/ndh2`.
- Phase 3 runbook + mapping resources updated; all feature flags ready for GA with dual-run payload logging via `submission_data`.
