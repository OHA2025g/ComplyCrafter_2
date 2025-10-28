# ADT1 Migration Notes

## Frontend
- Module: `frontend/apps/portal/src/app/forms/adt1` (standalone component, model, route entry in `forms.routes.ts`).
- Uses inventory-driven scaffolding for 27 fields (see `Resources/field_inventory.json`).
- Submission currently posts to `/api/forms/adt1` via `ApiClientService.saveAdt1`.
- Tests: Jest spec `adt1.component.spec.ts` and Playwright spec `frontend/tests/adt1.spec.ts` (run with `npm run e2e`).

## Backend
- SQLAlchemy model: `services/forms/app/models/adt1.py`.
- Pydantic schemas: `services/forms/app/schemas/adt1.py`.
- Service + router: `services/forms/app/services/adt1_service.py`, `services/forms/app/api/routes/adt1.py`.
- Tests: `services/forms/tests/test_adt1_api.py` (async SQLite in-memory).

## Tooling & Regression
- `migration-cli generate ADT1` emits scaffolding snippets for future updates.
- `migration-cli dualrun ADT1 payload.json https://legacy/api https://modern/api` hits both stacks and prints differences.

## Next Enhancements
- Add Alembic migration + real Postgres table provisioning.
- Automate dual-run execution via CI dashboards.
- Polish Angular UX (wizard layout, validation hints, attachments).
