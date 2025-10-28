# Phase 2 Runbook – BEN2, PAS3, DPT3

## Goals
- Migrate next three high-use forms (BEN2, PAS3, DPT3) end-to-end.
- Reuse generators + patterns proven in ADT1.
- Deliver parity + dual-run coverage before enabling users.

## Forms Selected
| Form | Legacy UI | Legacy BL | Notes |
| --- | --- | --- | --- |
| BEN2 | `ComplyCrafter_UI/Views/Form/BEN2*.cshtml` | `ComplyCrafter_BL/Forms/BEN2Repository.cs` | Beneficial ownership disclosures. |
| PAS3 | `ComplyCrafter_UI/Views/Form/PAS3*.cshtml` | `ComplyCrafter_BL/Forms/PAS3Repository.cs` | Return of allotment. |
| DPT3 | `ComplyCrafter_UI/Views/Form/DPT3*.cshtml` | `ComplyCrafter_BL/Forms/DPT3Repository.cs` | Deposits reporting. |

## Completion Summary
All checklist items below have been satisfied for BEN2, PAS3, and DPT3 (see docs/forms/*.md and sample tests).

## Checklist Template (repeat per form)
1. **Angular**
   - [x] Generate `apps/portal/src/app/forms/<code>` component via CLI.
   - [x] Bind validators using inventory metadata.
   - [x] Add Jest + Playwright coverage.
2. **FastAPI**
   - [x] Add SQLAlchemy model + Pydantic schema.
   - [x] Create service + router under `services/forms`.
   - [x] Extend pytest suite with fixtures.
3. **Data/Migrations**
   - [x] Produce SQL migration + seed sample payload.
4. **Tooling**
   - [x] Add CLI `generate <code>` snippets / dual-run payload docs.
5. **Deployment**
   - [x] Update feature-flag config (per-form toggles) + monitoring dashboards.
6. **Docs**
   - [x] Document flow in `docs/forms/<code>.md`.
   - [x] Update mapping inventories.

## Sequencing
1. BEN2 (ownership) – smaller field set.
2. PAS3 – more complex (table inputs) to validate automation.
3. DPT3 – ensures deposit workflows.

## Acceptance Criteria
- All three forms available in Angular portal behind feature flags.
- FastAPI endpoints pass regression + dual-run with zero diffs.
- CI pipeline includes tests for new modules.
- Documentation updated for each form.
