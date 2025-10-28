# Phase 0 Runbook – Foundations

This runbook breaks the initial phase into actionable steps. Update checkboxes as tasks complete.

## 1. Repository Prep
- [x] Confirm Node 18+, npm, Python 3.11+, Poetry are part of the toolchain (documented in ADR 0001).
- [x] Create `.nvmrc` and `.python-version` files at repo root.

## 2. Angular Workspace
- [x] Inside `frontend/`, run `npm install` so Nx commands can execute (rerun after dependency updates).
- [x] Bootstrap Nx/Angular workspace files manually (package.json, nx.json, Vite config, standalone app).
- [x] Add Tailwind configuration and base styling.
- [x] Create placeholder feature libs (`ui`, `state`, `data-access`) plus path mappings.

## 3. FastAPI Template
- [x] Bootstrap common template in `services/gateway` with Poetry, FastAPI, uvicorn, pytest.
- [x] Copy template into `forms`, `compliance`, `billing`, `jobs`.
- [x] Implement `/healthz` endpoint + smoke tests.

## 4. Shared Libraries
- [x] Initialize `libs/python/data_access` with SQLAlchemy base + session factory.
- [x] Initialize `libs/python/auth` and `libs/python/messaging` helpers.
- [x] Initialize `libs/typescript/api-client` with placeholder OpenAPI generator script.

## 5. Tooling & CI
- [x] Implement `tools/migration_cli` loaders for JSON inventories (summary + form lookup).
- [x] Author `.github/workflows/ci.yml` with real lint/test steps for frontend + services.
- [x] Provide `ops/docker-compose.yml` baseline (validation pending actual container run).

## 6. Documentation
- [x] Record ADR for tech stack approval.
- [x] Keep `Resources/migration_blueprint.md` updated as tasks complete.

> Phase 0 complete — see `Phase1_Runbook.md` for next steps.
