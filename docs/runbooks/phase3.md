# Phase 3 Runbook – Form Waves

## Goals
- Move beyond pilot/core forms and migrate the remaining high-traffic filings in grouped waves.
- Extend the Angular/FastAPI pattern to cover attachment-heavy and multi-section forms (AOC4 family, MGT7A).
- Introduce generator/test harness enhancements needed for MSME/NDH edge cases so future waves are mostly automated.

## Completion Summary
- [x] Wave 3A (AOC4/AOC4CFS/MGT7A) implemented via the generic Angular form + JSON-backed FastAPI endpoints.
- [x] Wave 3B (MSME/MSME1) delivered with select-field support and documentation in `docs/forms/msme*.md`.
- [x] Wave 3C (NDH1/NDH2) unlocked through schema authoring + new JSON submission tables/migrations.
- [x] Playwright + pytest suites updated to cover every Phase 3 form; migrations `005-011` created and documented.

## Scope & Waves
| Wave | Forms | Legacy References | Notes |
| --- | --- | --- | --- |
| 3A – Financial Statements | AOC4, AOC4CFS, MGT7A | `ComplyCrafter_UI/Views/Form/AOC4*.cshtml`, `ComplyCrafter_BL/Forms/AOC4Repository.cs`, `ComplyCrafter_API/Controllers/Form/AOC4Controller.cs`, `ComplyCrafter_Data/Forms/AOC4.cs` (similar for AOC4CFS/MGT7A) | Attachments + tabular sub-sections. |
| 3B – MSME Disclosures | MSME, MSME1 | `ComplyCrafter_UI/Views/Form/MSME*.cshtml`, `ComplyCrafter_BL/Forms/MSMERespositry.cs`, `ComplyCrafter_API/Controllers/Form/MSMEController.cs`, `ComplyCrafter_Data/Forms/MSME.cs` (no legacy BL/API/Data for MSME1) | Requires extending generators for selective sections + dynamic template download actions. |
| 3C – Nidhi (NDH) | NDH1, NDH2 | Only UI Razor views exist; no BL/API/Data implementation | Need full schema authoring + migrations based on MCA instruction kit + Razor form fields. |

## Checklist Template (per form)
1. **Angular**
   - [ ] Generate standalone component under `frontend/apps/portal/src/app/forms/<code>`.
   - [ ] Bind validators + dynamic sections from `Resources/field_inventory.json` (or Razor source for forms missing metadata).
   - [ ] Wire upload widgets for attachments + show submission preview.
   - [ ] Add Jest spec for component logic + Playwright coverage (extend `frontend/tests/forms-phase2.spec.ts`).
2. **FastAPI**
   - [ ] Create SQLAlchemy model + Alembic SQL under `services/forms/migrations`.
   - [ ] Add Pydantic schemas, service, and router (`services/forms/app/...`).
   - [ ] Extend pytest API tests with SQLite harness + sample payload (`services/forms/tests/data/<code>_sample.json`).
3. **Data & Tooling**
   - [ ] Update `Resources/end_to_end_mapping.(md|json)` to reference Angular/Python assets.
   - [ ] Add generator recipe (`tools/migration_cli`) for each form template (tables, uploads, enums).
   - [ ] Provide sample payloads + dual-run instructions (`docs/forms/<code>.md`).
4. **Ops**
   - [ ] Create feature flags (LaunchDarkly) + Grafana dashboards for each form.
   - [ ] Update CI to include new form tests.
5. **Gate Review**
   - [ ] Dual-run comparison vs. legacy for at least 10 historical filings per form.
   - [ ] Sign-off from legal/compliance stakeholders recorded in `Phase3_Status.md`.

## Wave 3A – Financial Statements (AOC4, AOC4CFS, MGT7A)
1. **Preparation**
   - Export field inventory for each data model (`ComplyCrafter_Data/Forms/AOC4*.cs`, `ComplyCrafter_Data/Forms/MGT7A.cs`).
   - Capture attachment requirements from Razor views to replicate "Download template" + file validation rules.
2. **Angular**
   - Use BEN2 component as base; add support for repeating sub-sections (share capital tables) via `FormArray`.
   - Implement document upload service hooking into `ApiClientService.upload`.
3. **FastAPI**
   - Mirror field names from C# models; store attachments as string paths for now (align with `tools/migration_cli` for storage).
   - Provide filtering endpoints if needed (`?company_id=`) but keep parity with current stub first.
4. **Data**
   - Create migrations `005_create_aoc4.sql`, `006_create_aoc4cfs.sql`, `007_create_mgt7a.sql`.
   - Seed anonymized samples for regression.
5. **Validation**
   - Extend Playwright suite to cover at least one multi-tab submission per form.

## Wave 3B – MSME & MSME1
1. **Generator Enhancements**
   - Update CLI schematics to detect `downloadtemplate` links and include CTA + metadata in Angular form config.
   - Support `select` options drawn from static JSON (MSME return type, reporting periods).
2. **MSME**
   - Use existing data model `ComplyCrafter_Data/Forms/MSME.cs` to generate SQLAlchemy model + migrations.
   - Map boolean-like selects (`ReturnType`, `ChangeOwnership`, etc.) to enums for validation.
3. **MSME1**
   - No backend artifacts exist; extract field definitions by parsing `ComplyCrafter_UI/Views/Form/MSME1Form.cshtml` + MCA instruction kit.
   - Document derived schema in `docs/forms/msme1.md` before coding.
4. **Testing**
   - Add API fixtures for company-level filtering (legacy exposes `/GetByCompany/{id}`; parity tests should assert the new query endpoint).

## Wave 3C – NDH1 & NDH2
1. **Discovery**
   - Inventory fields by scraping Razor views + official NDH instruction kits; store into `Resources/field_inventory.json`.
   - Align with compliance to confirm which schedules are mandatory.
2. **Schema Authoring**
   - Design normalized SQLAlchemy models (likely parent row + child tables for share/deposit schedules).
   - Introduce Alembic migrations `008_create_ndh1.sql`, `009_create_ndh2.sql`.
3. **Angular**
   - Extend generator to support matrix inputs + auto-calculated totals used heavily in NDH forms.
4. **Ops**
   - Because these forms lacked any legacy API, create cutover plan (no dual-run) and capture approvals in `Phase3_Status.md`.

## Testing & Validation Matrix
| Layer | Tooling | Notes |
| --- | --- | --- |
| Angular unit | Jest | Cover validators, conditional sections, attachment logic. |
| Angular E2E | Playwright | Extend existing suite with Wave 3A/B/C flows. |
| FastAPI unit | pytest | Service tests per form using SQLite; include filtering behavior. |
| Contract | Schemathesis | Validate new endpoints against generated OpenAPI. |
| Data migration | `tools/migration_cli/diff_data.py` | Compare row counts + hashes vs. legacy tables until cutover. |
| Monitoring | Grafana/Prometheus | Verify new dashboards emit submission + error metrics before GA. |

## Exit Criteria
- `Phase3_Status.md` shows all waves in "Done" with evidence links (tests, dashboards, dual-run reports).
- Playwright + pytest suites include coverage for every Phase 3 form.
- Feature flags for all Phase 3 forms flipped to 100% with rollback plan documented.
- Legacy ASP.NET endpoints for migrated forms marked read-only (feature flag ensures no silent divergence).
