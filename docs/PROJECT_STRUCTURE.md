# ComplyCrafter - Complete Project Structure

## 📁 Directory Organization

### Root Level

```
Comply-Crafter-code/
├── README.md                      # Main project documentation
├── START_HERE.md                  # Quick start guide
├── start-complycrafter.sh         # Automated startup script
├── comply_crafter_logo.png        # Official logo
├── package.json                   # Root package config
└── procfile                       # Deployment config
```

---

## 🎨 Frontend (`frontend/`)

Angular 17 application with standalone components.

```
frontend/
├── apps/portal/                   # Main portal application
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/              # Authentication
│   │   │   │   ├── login/         # Login component
│   │   │   │   └── signup/        # Signup component
│   │   │   │
│   │   │   ├── dashboard/         # Main dashboard
│   │   │   │   └── dashboard.component.ts
│   │   │   │
│   │   │   ├── forms/             # Form management
│   │   │   │   ├── forms-list/    # Form catalog
│   │   │   │   └── generic-form/  # Dynamic form
│   │   │   │
│   │   │   ├── company/           # Company search
│   │   │   │   └── company-search.component.ts
│   │   │   │
│   │   │   ├── masters/           # Masters (12 pages)
│   │   │   │   ├── company.component.ts           # Company Master ⭐
│   │   │   │   ├── directors.component.ts         # Directors/KMP
│   │   │   │   ├── shareholder.component.ts       # Shareholders
│   │   │   │   ├── share-certificate.component.ts # Certificates
│   │   │   │   ├── debenture-holder.component.ts  # Debenture
│   │   │   │   ├── auditor.component.ts           # Auditors
│   │   │   │   ├── agendas.component.ts           # Agendas
│   │   │   │   ├── shareholder-management.component.ts
│   │   │   │   └── capital/                       # Capital (3 pages)
│   │   │   │       ├── authorized-capital.component.ts
│   │   │   │       ├── paid-up-capital.component.ts
│   │   │   │       └── share-capital.component.ts
│   │   │   │
│   │   │   ├── meetings/          # Meetings (4 pages)
│   │   │   │   ├── board-meeting.component.ts     # Board
│   │   │   │   ├── agm.component.ts               # AGM
│   │   │   │   ├── egm.component.ts               # EGM
│   │   │   │   └── committee-meeting.component.ts # Committee
│   │   │   │
│   │   │   ├── services/          # API Services
│   │   │   │   ├── companies.service.ts           # Companies API
│   │   │   │   ├── agendas.service.ts             # Agendas API
│   │   │   │   ├── capital.service.ts             # Capital API
│   │   │   │   ├── meetings.service.ts            # Meetings API
│   │   │   │   └── shareholder-management.service.ts
│   │   │   │
│   │   │   ├── shared/            # Shared components
│   │   │   │   ├── sidebar/       # Navigation sidebar
│   │   │   │   └── placeholder.component.ts
│   │   │   │
│   │   │   ├── app.component.ts   # Root component
│   │   │   ├── app.config.ts      # App configuration
│   │   │   └── app.routes.ts      # Routing config
│   │   │
│   │   ├── assets/                # Static assets
│   │   │   └── images/
│   │   │       ├── comply_crafter_logo.png
│   │   │       └── logo.svg
│   │   │
│   │   ├── styles-beautiful.css   # Global styles
│   │   ├── index.html             # Entry HTML
│   │   └── main.ts                # Entry TypeScript
│   │
│   ├── angular.json               # Angular workspace config
│   ├── package.json               # Dependencies
│   ├── tsconfig.json              # TypeScript config
│   └── Dockerfile                 # Frontend container
│
└── libs/                          # Shared libraries
    └── ...
```

---

## 🔧 Backend (`services/`)

FastAPI microservices architecture.

```
services/
├── forms/                         # Main forms service ⭐
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/            # API endpoints
│   │   │   │   ├── companies.py           # Companies CRUD
│   │   │   │   ├── agendas.py             # Agendas CRUD
│   │   │   │   ├── shareholder_management.py
│   │   │   │   ├── capital.py             # Capital APIs
│   │   │   │   ├── meetings.py            # Meeting APIs
│   │   │   │   ├── mca.py                 # MCA integration
│   │   │   │   ├── dashboard.py           # Dashboard stats
│   │   │   │   ├── auth.py                # Authentication
│   │   │   │   ├── adt1.py, ben2.py, ...  # Form endpoints
│   │   │   │   └── ... (62+ form routes)
│   │   │   │
│   │   │   └── dependencies.py    # Shared dependencies
│   │   │
│   │   ├── core/                  # Core configuration
│   │   │   ├── __init__.py
│   │   │   ├── config.py
│   │   │   └── logging.py
│   │   │
│   │   └── main.py                # FastAPI application
│   │
│   ├── migrations/                # Database migrations (70 files)
│   │   ├── 001_*.sql
│   │   ├── ...
│   │   ├── 066_create_agendas.sql
│   │   ├── 067_create_shareholder_transactions.sql
│   │   ├── 068_create_capital_structure.sql
│   │   ├── 069_create_meetings.sql
│   │   └── 070_update_user_companies.sql
│   │
│   ├── Dockerfile                 # Container definition
│   ├── requirements.txt           # Python dependencies
│   └── pyproject.toml             # Python project config
│
├── gateway/                       # API Gateway service
├── billing/                       # Billing service
├── compliance/                    # Compliance service
├── jobs/                          # Background jobs
└── README.md
```

---

## 🗄️ Database (`migrations/`)

PostgreSQL schema managed through SQL migrations.

### Migration Files
```
services/forms/migrations/
├── 001-065_*.sql          # Initial tables & legacy
├── 066_create_agendas.sql # Agendas table
├── 067_create_shareholder_transactions.sql
├── 068_create_capital_structure.sql
├── 069_create_meetings.sql
└── 070_update_user_companies.sql
```

### Tables Created
1. `user_companies` - Companies list (Company Master)
2. `agendas` - Meeting agendas
3. `shareholder_transactions` - Shareholder management
4. `authorized_capital`, `paid_up_capital`, `share_capital` - Capital structure
5. `board_meetings`, `agm_meetings`, `egm_meetings`, `committee_meetings` - Meetings

---

## 📚 Documentation (`docs/`)

Comprehensive project documentation.

```
docs/
├── guides/                        # User & developer guides
│   ├── QUICK_START.md
│   ├── QUICK_START_BACKEND.md
│   ├── COMPANY_MASTER_QUICK_START.md
│   ├── MANUAL_TESTING_GUIDE.md
│   └── How to run project.txt
│
├── architecture/                  # Architecture documentation
│   ├── Comply Crafter Current Architecture Diagram.pdf
│   ├── ComplyCrafter Data Architecture Diagram.pdf
│   ├── ComplyCrafter Data Flow Diagram.pdf
│   ├── 01-09_*.md (9 architecture docs)
│   └── README.md
│
├── reports/                       # Status & test reports
│   ├── BEAUTIFICATION_STATUS.md
│   ├── BEAUTIFICATION_TEST_RESULTS.md
│   ├── FRONTEND_BEAUTIFICATION_COMPLETE.md
│   ├── MASTERS_AND_MEETING_MENU_FIXED.md
│   └── ... (various status reports)
│
├── implementation/                # Implementation details
│   ├── DASHBOARD_AND_NAVIGATION_COMPLETE.md
│   ├── MCA_SEARCH_WITH_LIVE_API_FALLBACK.md
│   ├── RESTRUCTURING_COMPLETE_2025.md
│   └── ... (implementation docs)
│
├── testing/                       # Testing documentation
│   ├── test-plans/
│   ├── test-results/
│   └── ... (28 testing files)
│
├── forms/                         # Form documentation
│   ├── comprehensive-catalog.md
│   ├── master-catalog.md
│   ├── adt1.md, aoc4.md, ... (form specs)
│   └── wireframes/ (54 wireframe docs)
│
├── migration/                     # Migration from legacy
│   └── ... (10 migration files)
│
├── deployment/                    # Deployment guides
├── runbooks/                      # Operational runbooks
├── adr/                          # Architecture decisions
├── BACKEND_API_COMPLETE.md       # Complete API documentation
├── COMPANY_MASTER_COMPLETE.md    # Company Master documentation
└── README.md                     # Documentation index
```

---

## 🛠️ Scripts (`scripts/`)

Organized utility scripts.

```
scripts/
├── setup/                         # Setup scripts
│   └── ... (initialization scripts)
│
├── database/                      # Database utilities
│   ├── backup.sql
│   ├── restore.sql
│   └── cleanup.sql
│
├── deployment/                    # Deployment scripts
│   ├── deploy.sh
│   ├── rollback.sh
│   └── ... (5 deployment scripts)
│
├── testing/                       # Test scripts
│   ├── test_all_apis.sh
│   └── ... (4 test scripts)
│
├── migration/                     # Migration tools
│   └── ... (2 migration scripts)
│
├── fix_angular_di.sh             # Fix Angular DI errors
├── seed_companies.sh             # Seed company data
├── setup_masters_meetings.sh     # Setup Masters & Meetings
├── update_company_data.sh        # Update company data
└── README.md                     # Scripts documentation
```

---

## 🏗️ Infrastructure (`ops/`)

DevOps and infrastructure configuration.

```
ops/
├── docker-compose.yml            # Main orchestration file
├── k8s/                          # Kubernetes configs
│   ├── deployment.yaml
│   ├── service.yaml
│   └── ingress.yaml
│
├── monitoring/                   # Monitoring setup
│   ├── prometheus.yaml
│   └── grafana.yaml
│
├── feature-flags/                # Feature toggles
│   ├── flags.json
│   └── README.md
│
└── README.md
```

---

## 📦 Legacy Code (`archive/` & `legacy/`)

Preserved for reference only - **DO NOT USE IN PRODUCTION**

```
archive/
├── legacy-code-20251027-153549/  # Archived .NET code
├── legacy-code-20251027-153605/  # Archived .NET code
└── legacy-code-20251027.tar.gz   # Compressed archive

legacy/
├── ComplyCrafter_API/            # .NET API (reference)
├── ComplyCrafter_BL/             # Business logic
├── ComplyCrafter_Data/           # Data models
├── ComplyCrafter_UI/             # MVC views
└── README.md
```

> ⚠️ **Note**: Legacy code is kept for reference during migration. New development uses Python/Angular stack.

---

## 🔧 Shared Libraries (`libs/`)

```
libs/
├── python/                       # Shared Python utilities
│   ├── auth/
│   ├── database/
│   └── utils/
│
└── typescript/                   # Shared TypeScript utilities
    └── types/
```

---

## 🛠️ Tools (`tools/`)

```
tools/
├── migration_cli/                # Migration CLI tool
│   ├── cli.py
│   ├── commands/
│   └── README.md
│
└── README.md
```

---

## 📦 Resources (`Resources/`)

Legacy resources and mappings (reference only).

```
Resources/
├── AlphaUtil.Core.dll           # Legacy DLL (reference)
├── AlphaUtil.dll                # Legacy DLL (reference)
├── end_to_end_mapping.json      # Field mapping
├── end_to_end_mapping.md        # Field mapping docs
├── field_inventory.json         # Field inventory
└── migration_blueprint.md       # Migration blueprint
```

---

## 🎯 Key Directories

### Essential for Development
- ✅ `frontend/` - Angular application
- ✅ `services/forms/` - Main backend
- ✅ `ops/` - Docker setup
- ✅ `scripts/` - Utility scripts
- ✅ `docs/` - Documentation

### Reference Only
- 📚 `archive/` - Old archived code
- 📚 `legacy/` - Legacy .NET code
- 📚 `Resources/` - Legacy resources

### Infrastructure
- 🔧 `libs/` - Shared libraries
- 🔧 `tools/` - Development tools
- 🔧 `backups/` - Database backups

---

## 📊 File Count Summary

| Directory | Files | Purpose |
|-----------|-------|---------|
| `frontend/` | ~400 | Angular application |
| `services/forms/` | ~250 | FastAPI backend |
| `docs/` | ~150 | Documentation |
| `scripts/` | ~20 | Utility scripts |
| `legacy/` | ~1500 | Legacy code (reference) |
| `archive/` | ~3000 | Archived code (reference) |

**Active Development**: ~800 files  
**Reference/Archive**: ~4500 files  

---

## 🚀 Development Workflow

### Starting Point
1. Read [README.md](../README.md)
2. Follow [START_HERE.md](../START_HERE.md)
3. Run `./start-complycrafter.sh`

### Frontend Development
```bash
cd frontend
npm install        # First time only
npm start          # Start dev server
npm test           # Run tests
npm run build      # Production build
```

### Backend Development
```bash
cd services/forms
pip install -r requirements.txt  # First time only
uvicorn app.main:app --reload    # Start dev server
pytest                           # Run tests
```

### Database
```bash
cd ops
docker compose exec db psql -U comply -d comply  # Connect to DB
docker compose exec db psql -U comply -d comply < ../services/forms/migrations/066_*.sql  # Run migration
```

---

## 📋 Important Files

### Configuration
- `frontend/angular.json` - Angular configuration
- `frontend/package.json` - Frontend dependencies
- `services/forms/app/main.py` - Backend entry point
- `ops/docker-compose.yml` - Services orchestration
- `.gitignore` - Git ignore rules

### Documentation
- `README.md` - Main project README
- `START_HERE.md` - Quick start guide
- `docs/README.md` - Documentation index
- `docs/BACKEND_API_COMPLETE.md` - API reference
- `docs/COMPANY_MASTER_COMPLETE.md` - Company Master docs

### Scripts
- `start-complycrafter.sh` - Main startup script
- `scripts/setup_masters_meetings.sh` - Setup database
- `scripts/seed_companies.sh` - Seed company data
- `scripts/fix_angular_di.sh` - Fix Angular issues

---

## 🎨 UI Components

### Page Count
- Authentication: 2 pages
- Dashboard: 1 page
- Forms: 2 pages
- Company: 2 pages
- Masters: 12 pages
- Meetings: 4 pages

**Total: 23 functional pages**

### Reusable Components
- Sidebar navigation (multi-level)
- Placeholder component
- Form components (inputs, selects, etc.)

---

## 🔌 API Endpoints

### Total Endpoints: 40+

Organized by domain:
- Companies: 6 endpoints
- Agendas: 5 endpoints
- Capital: 6 endpoints (3 types × 2 ops)
- Meetings: 8 endpoints (4 types × 2 ops)
- Forms: 62+ form-specific endpoints
- MCA: 3 endpoints
- Dashboard: 2 endpoints
- Auth: 3 endpoints

---

## 📖 How to Navigate

### For New Developers
1. Start with `README.md`
2. Follow `START_HERE.md` to run the app
3. Read `docs/architecture/README.md` for system design
4. Check `docs/guides/` for how-to guides

### For API Integration
1. Check `docs/BACKEND_API_COMPLETE.md`
2. Visit http://localhost:8100/docs for interactive docs
3. Look at `services/forms/app/api/routes/` for implementation

### For UI Development
1. Check `frontend/apps/portal/src/app/`
2. Look at existing components as examples
3. Follow Angular 17 standalone component pattern
4. Use `inject()` for dependency injection

### For Database Work
1. Check `services/forms/migrations/` for schema
2. Use `scripts/database/` for utilities
3. Connect via Docker: `docker compose exec db psql -U comply -d comply`

---

## 🎯 Best Practices

### Code Organization
- ✅ Keep components in feature folders
- ✅ Use services for API calls
- ✅ Keep business logic in backend
- ✅ Use TypeScript interfaces
- ✅ Follow naming conventions

### Documentation
- ✅ Update README when adding features
- ✅ Document API changes in docs/
- ✅ Keep CHANGELOG updated
- ✅ Add comments for complex logic

### Git Workflow
- ✅ Commit frequently with clear messages
- ✅ Use feature branches
- ✅ Keep main/master clean
- ✅ Test before pushing

---

**Last Updated**: November 2, 2025  
**Version**: 1.0.0  
**Status**: Production Ready  

