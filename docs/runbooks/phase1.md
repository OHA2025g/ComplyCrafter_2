# Phase 1 Runbook – ADT1 Pilot

## Objectives
- Deliver modern Angular experience for ADT1 filings (reactive form + validation).
- Stand up FastAPI endpoints and data models for ADT1 in `services/forms`.
- Prove the migration automation (CLI generators, regression diff).
- Operate the new stack in dual-run mode against the legacy .NET API.

## Checklist

### 1. Angular
- [x] Generate feature module `apps/portal/src/app/forms/adt1` (component, route, model, service hook).
- [x] Use inventory (`Resources/field_inventory.json`) to scaffold form controls & validators.
- [x] Integrate with `@frontend/data-access` client (placeholder `ApiClientService` for now).
- [x] Add unit test (Jest) verifying component creation.
- [x] Author Playwright scenario for ADT1 submission flow (`frontend/tests/adt1.spec.ts`).

### 2. FastAPI (services/forms)
- [x] Add SQLAlchemy model `Adt1` + Pydantic schemas under `app/models/adt1.py` and `app/schemas/adt1.py`.
- [x] Create router `app/api/routes/adt1.py` with CRUD endpoints (`/forms/adt1`).
- [x] Implement service layer using `libs/python/data_access`.
- [x] Write pytest suite covering repository + API (uses async SQLite + overrides).

### 3. Data & Migrations
- [x] Create migration artifact (`services/forms/migrations/001_create_adt1.sql`).
- [x] Seed sample data fixture (`services/forms/tests/data/adt1_sample.json`).
- [x] Document rollout steps in `docs/runbooks/adt1_migration.md`.

### 4. Tooling & Regression
- [x] Extend `tools/migration_cli` with `generate form <code>` scaffolding.
- [x] Enhance CLI with `dualrun` command for legacy vs modern diffs (see `docs/runbooks/dual-run.md`).

### 5. Deployment
- [x] Update `ops/docker-compose.yml` to include `forms` service.
- [x] Add feature flag config (`ops/feature-flags/flags.example.json`) and rollout guidance (`docs/ops/monitoring-flags.md`).

### 6. Documentation & Signoff
- [x] Document ADT1 flow in `docs/forms/adt1.md` (includes test + tooling notes).
- [x] Update `Resources/end_to_end_mapping.md` to point to new Angular/Python paths.
- [x] Record Phase 1 completion summary (`Phase1_Status.md`).

> After ADT1 is stable, repeat the same template for the next batch of forms.
