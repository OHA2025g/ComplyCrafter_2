# Shared Python Libraries

Hosts reusable packages (data access, messaging, auth) consumed by each FastAPI service.

## Phase 0 Deliverables
- `data_access/` package exporting SQLAlchemy base class, session factory, and repository mixins.
- `auth/` helpers for JWT verification + role enforcement.
- `messaging/` wrappers over RabbitMQ/Kafka publisher/consumer patterns.

Add `pyproject.toml` once packages are initialized.
