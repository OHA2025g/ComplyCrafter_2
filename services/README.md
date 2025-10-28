# Python Services

This folder hosts the FastAPI services defined in the modernization blueprint. Each subdirectory is a standalone FastAPI project sharing common libraries from `libs/python`.

## Phase 0 Deliverables
- Choose base FastAPI template (poetry + uvicorn + pytest) and clone it into each service subfolder.
- Provide `pyproject.toml`, Dockerfile, and Makefile per service.
- Establish shared `.env.example` contract for DB/auth settings.
- Register each service in `ops/docker-compose.yml` for local orchestration.

## Structure
- `gateway/` – API gateway / BFF.
- `forms/` – Statutory form operations.
- `compliance/` – Company, auditor, shareholder, meeting logic.
- `billing/` – Payments + subscriptions.
- `jobs/` – Background tasks (Celery/RQ workers).

During Phase 0 we will scaffold `gateway` first, then replicate the template for other services.
