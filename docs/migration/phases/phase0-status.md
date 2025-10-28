# Phase 0 – Kickoff Status

## Completed in this commit
- Approved tech stack recorded in `docs/adr/0001-tech-stack.md`.
- Created monorepo skeleton directories (`frontend`, `services`, `libs`, `ops`, `tools`, `docs`, `legacy`).
- Seeded READMEs/runbooks describing expectations for each area.
- Added development version files `.nvmrc` and `.python-version`.
- Authored `ops/docker-compose.yml` baseline for local orchestration.
- Bootstrapped offline Angular/Nx workspace structure inside `frontend/` (app + shared libs + Tailwind, created manually because npm access is blocked).
- Scaffolded FastAPI services (`gateway`, `forms`, `compliance`, `billing`, `jobs`) with Poetry configs, `/healthz` routes, tests, and Makefiles.
- Added shared Python helpers (`libs/python/data_access`, `auth`, `messaging`) and TypeScript API client generator template.
- Implemented migration CLI loaders plus placeholder CI workflow.

## Upcoming
- Phase 1 kickoff: choose pilot form (recommend ADT1) and migrate UI/API/Data stack.
- Enhance migration CLI to scaffold real form artifacts using inventories.
- Stand up Phase 1 regression dashboards + dual-run infrastructure.
