# ComplyCrafter Modernization Blueprint

Authoritative playbook for migrating the current .NET MVC monolith to an Angular + Python platform while preserving form linkages enumerated in `Resources/end_to_end_mapping.md` and field definitions captured in `Resources/field_inventory.json`.

---

## 1. Target Repository Layout

```
/
├── frontend/                     # Angular workspace (Nx managed)
│   ├── apps/portal               # Main SPA (lazy modules per form/domain)
│   ├── libs/ui                   # Design system, layout primitives
│   ├── libs/state                # NgRx Signals store, auth/session state
│   ├── libs/data-access          # Typed clients generated from OpenAPI
│   └── tools/generators          # Schematics to scaffold new forms
├── services/                     # Python services (FastAPI)
│   ├── gateway                   # API gateway + request orchestration
│   ├── forms                     # Statutory form microservice
│   ├── compliance                # Company, Auditor, Shareholder domains
│   ├── billing                   # Payments, subscriptions
│   └── jobs                      # Background workers (Celery/RQ)
├── libs/                         # Shared cross-language assets
│   ├── python/
│   │   ├── data_access           # SQLAlchemy models & repository mixins
│   │   ├── messaging             # RabbitMQ/Kafka publisher helpers
│   │   └── auth                  # JWT validation, RBAC helpers
│   └── typescript/
│       └── api-client            # openapi-typescript output, interceptors
├── ops/
│   ├── docker-compose.yml        # Local orchestration
│   ├── k8s/helm                  # Helm charts per service
│   ├── terraform/                # Infra provisioning (DB, queues, Keycloak)
│   └── github-actions/           # CI/CD workflows
├── tools/
│   ├── migration_cli/            # Code generation + data-migration scripts
│   └── smoke_tests/              # Cross-stack regression harness
├── docs/                         # ADRs, runbooks, onboarding
└── legacy/                       # Snapshot of existing .NET projects
```

---

## 2. Frontend (Angular 17) Architecture

- **Workspace**: Nx monorepo using standalone components, Angular 17 signals, strict type checking, TailwindCSS for styling, Storybook for UI regression.
- **Routing strategy**: top-level shells for `forms/:code`, `domains/:name`, and `admin`. Stateless route guards consume the shared auth client.
- **State management**: NgRx Signals Store for global state (user session, feature flags); local feature stores per module.
- **Form scaffolding**: CLI schematics read field metadata from `Resources/field_inventory.json`, generating:
  - Typed reactive forms (`FormGroup` + validators inferred from property types and legacy attributes).
  - Angular Material-based layouts plus accessibility hints.
  - Data services pointing to the matching FastAPI endpoint (URL derived from form code).
- **API clients**: `openapi-typescript` generates strongly typed clients from the FastAPI OpenAPI document. HTTP interceptors inject auth tokens, trace IDs, and retry policies.
- **Testing**: Jest for unit tests (components/pipes), Cypress component tests for forms, Playwright end-to-end flows covering multi-step submissions.

---

## 3. Backend (Python) Service Boundaries

| Service        | Responsibilities                                                                 | Key Tech |
|----------------|-----------------------------------------------------------------------------------|----------|
| `gateway`      | Edge routing, request aggregation, GraphQL façade (optional).                     | FastAPI, httpx |
| `forms`        | CRUD + workflow orchestration for 60+ statutory forms (one router per form code). | FastAPI, SQLAlchemy, Celery |
| `compliance`   | Company, Auditor, Shareholder, Meeting, Resolution domains.                       | FastAPI, SQLAlchemy |
| `billing`      | Payment details, Subscription plans, webhook ingestion.                           | FastAPI, Stripe/Razorpay SDK |
| `jobs`         | Background tasks (PDF generation, email dispatch, data sync).                     | Celery/RQ, Redis |

**Patterns**
- FastAPI with async endpoints, dependency injection for repositories, shared response envelope (mirrors legacy uniform response).
- Pydantic v2 models derived from the field inventory; version each schema to support gradual rollout.
- SQLAlchemy 2.0 with async session + Alembic migrations per service; naming conventions align with existing PostgreSQL schema.
- Messaging via RabbitMQ or Kafka for eventual consistency (e.g., notifying `jobs` service about form submission events).

---

## 4. Data & ORM Strategy

1. **Schema introspection** – Run `sqlacodegen` against the existing PostgreSQL DB to seed SQLAlchemy models.
2. **Model harmonization** – Enhance generated models with constraints, enumerations, and docstrings referencing original C# classes.
3. **Alembic migration pipeline** – `libs/python/data_access` owns base migration configuration; each service has a `versions/` folder with dependency metadata to avoid drift.
4. **Data validation** – Pydantic models share field definitions with Angular via JSON schema export, guaranteeing parity.
5. **Versioning** – Use database views for legacy vs new columns where necessary; maintain dual-write adapters during cutover.

---

## 5. Auth, Security, and Deployment

- **Identity provider**: Keycloak (self-hosted) or Auth0; Angular uses OAuth2 PKCE flow, Python services validate JWTs via PyJWT + shared JWKS cache.
- **RBAC**: Authorization middleware reads scopes/roles embedded in tokens; fine-grained policies stored in PostgreSQL.
- **Secrets**: Managed via HashiCorp Vault or AWS Secrets Manager; services load secrets at startup via sidecar.
- **Deployment**:
  - Dev: Docker Compose orchestrating Angular, FastAPI services, Postgres, Keycloak, Redis.
  - Staging/Prod: Kubernetes (EKS/AKS) with Helm charts; ArgoCD or Flux for GitOps.
  - Observability: OpenTelemetry tracing, Prometheus metrics, Loki logs; dashboards per service with SLO alerts.

---

## 6. Automated Migration Strategy

### 6.1 Inventory & Mapping
- Treat `Resources/end_to_end_mapping.json` as the source of truth for form/domain linkages.
- Treat `Resources/field_inventory.json` as the canonical field catalog.
- Store both in `docs/data-contracts/` within the new repo; update via CI whenever legacy models change.

### 6.2 Code Generation CLI
Located in `tools/migration_cli/` with subcommands:

| Command | Description |
|---------|-------------|
| `generate form <code>` | Emits Angular component, FastAPI router, Pydantic schema, SQLAlchemy model, and OpenAPI fragment for the given form code. |
| `sync legacy`          | Parses legacy .cs files (Roslyn or regex) and updates the JSON inventories, highlighting drift. |
| `dual-run <code>`      | Spins up a shim that forwards requests to both .NET and Python implementations, diffing responses. |

Generation templates reference:
- Angular templates for reactive forms + Material components.
- Python Jinja templates for routers and repositories.
- JSON schema definitions for validator hints (required, length, regex).

### 6.3 Dual-Run & Cutover
1. Deploy Python services alongside .NET.
2. Use API gateway routing (e.g., Kong/Traefik) with header-based routing to direct a subset of users/tenants to the new stack.
3. Leverage the CLI’s `dual-run` subcommand in CI to compare payloads for each endpoint before enabling production traffic.
4. Maintain telemetry dashboards showing parity metrics (success rates, latency, response diff counts).

---

## 7. Regression Testing & Quality Gates

| Layer         | Tooling & Scope                                                                                               |
|---------------|----------------------------------------------------------------------------------------------------------------|
| Angular unit  | Jest (components, pipes, services).                                                                            |
| Angular forms | Cypress component tests validating validators, dynamic sections, API interactions.                            |
| FastAPI unit  | pytest + pytest-asyncio for business logic, SQLAlchemy repository tests with SQLite or Testcontainers.         |
| Contract      | Schemathesis or Dredd to assert FastAPI responses match OpenAPI specs consumed by Angular clients.            |
| Integration   | Pytest hitting FastAPI with seeded Postgres; simulate multi-form workflows.                                    |
| E2E           | Playwright scripts executing high-priority flows (create company, appoint director, file form).                |
| Performance   | k6/Gatling scenarios replicating heavy filing periods; monitor CPU, memory, DB load.                           |
| Security      | Automated SAST (Semgrep/Bandit) + dependency scanning; regular pen tests before each migrate wave.             |

Quality gates in CI:
- All unit + contract tests must pass.
- Schema snapshots (OpenAPI + JSON schema) diffed; breaking changes require approval.
- Regression diff for form responses must show no divergences vs legacy for sampled records.

---

## 8. Data Migration & Tooling

1. **Data extract** – Use Python scripts to dump legacy tables relevant to a form/domain (include metadata like `updated_at`).
2. **Transform layer** – Apply Pydantic models with validation to catch anomalies; support mapping tables for enums/IDs.
3. **Load** – Insert via SQLAlchemy bulk operations with transactional batching; record lineage in a `migration_audit` table.
4. **Verification** – For each migrated record, compare computed artifacts (e.g., generated PDFs, email payloads) to ensure parity.
5. **Rollback** – Provide inverse scripts to remove migrated batches and re-enable .NET flows if necessary.

Tooling additions:
- `tools/migration_cli/diff_data.py` – compares row counts & hashes between systems.
- `tools/migration_cli/seed_samples.py` – seeds anonymized datasets for lower environments.
- `docs/runbooks/data-migration.md` – step-by-step operator instructions.

---

## 9. Phased Implementation Roadmap

| Phase | Goals | Key Deliverables | Tech Decisions |
|-------|-------|------------------|----------------|
| 0 – Foundations | Create repo, CI/CD, shared libs, auth stub, sample FastAPI service + Angular shell. | Monorepo scaffolding, hello-world route, automated lint/test pipelines. | Angular 17, FastAPI, SQLAlchemy 2, Nx, Docker Compose. |
| 1 – Pilot Form | Migrate ADT1 end-to-end to validate generators, testing harness, data migration. | Angular ADT1 module, FastAPI ADT1 router, SQLAlchemy model, regression dashboard. | Feature flag framework (LaunchDarkly), Playwright baseline. |
| 2 – Core Domains | Migrate Company, Auditor, Shareholder, Meeting flows; introduce messaging + background jobs. | Compliance service live, message broker integration, Celery workers. | RabbitMQ/Kafka selection, Celery vs RQ decision. |
| 3 – Form Waves | Batch migrate remaining statutory forms by category; refine automation for edge cases (MSME1, NDH). | Multiple Angular modules + FastAPI routers per release, updated documentation. | Expand generator templates, add complex validation support. |
| 4 – Cutover & Decommission | Full traffic to Python stack, retire .NET, finalize observability and runbooks. | Switched DNS/routes, archived legacy code, post-mortem & lessons learned. | GitOps-driven deployments, blue/green release pattern. |

Each phase ends with a “gate review” verifying regression, data integrity, and support readiness before expanding scope.

---

## 10. Next Steps

1. Approve technology choices (Angular 17, FastAPI, SQLAlchemy, Keycloak, Kubernetes).
2. Stand up the monorepo skeleton and CI pipelines.
3. Implement the migration CLI’s inventory + generator commands referencing the existing JSON resources.
4. Select the pilot form (recommend ADT1 or BEN2) and execute Phase 1 (ADT1 scaffolding now complete; next forms can reuse generators).
5. Update `Resources/end_to_end_mapping.md` as additional forms/domains are migrated to keep stakeholders aligned.

With this blueprint, teams can coordinate the migration, automate repetitive conversion work, and maintain functional parity throughout the transformation.
