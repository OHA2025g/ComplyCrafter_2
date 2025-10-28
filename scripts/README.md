# Automation Scripts

This directory contains all automation scripts for the ComplyCrafter project.

---

## 📁 Directory Structure

```
scripts/
├── README.md (this file)
│
├── migration/                    # Migration scripts
│   ├── migrate-all-forms.py      # Automated form migration
│   └── generate-form-wireframes.py  # Wireframe generation
│
├── deployment/                   # Deployment scripts
│   ├── deploy-migrated-forms.sh  # Production deployment
│   ├── decommission-legacy.sh    # Legacy shutdown
│   └── shutdown-legacy.sh        # Legacy system shutdown
│
├── database/                     # Database scripts
│   ├── clear_all_tables.sql      # Clear all tables
│   ├── clearuser.sql             # Clear user data
│   └── comply_crafter_db.sql     # Database schema
│
└── development/                  # Development scripts
    └── install_frontend_deps.sh  # Frontend dependency installation
```

---

## 🛠️ Scripts Documentation

### Migration Scripts

#### migrate-all-forms.py
**Purpose:** Automated migration of all 51 forms from legacy to modern stack

**Usage:**
```bash
python scripts/migration/migrate-all-forms.py
```

**Output:**
- Creates Angular components for all forms
- Creates FastAPI models, services, and routes
- Generates migration summary

**Results:**
- 51 forms migrated
- 255 Angular files created
- 153 FastAPI files created

#### generate-form-wireframes.py
**Purpose:** Generate ASCII wireframes and documentation for all forms

**Usage:**
```bash
python scripts/migration/generate-form-wireframes.py
```

**Output:**
- Creates 53 wireframe markdown files
- Generates complete documentation
- Creates index file

**Results:**
- 53 wireframes created
- ~34,000 lines of documentation
- Complete form catalog

### Deployment Scripts

#### deploy-migrated-forms.sh
**Purpose:** Deploy migrated forms to production

**Usage:**
```bash
./scripts/deployment/deploy-migrated-forms.sh
```

**Features:**
- Backup current deployment
- Install dependencies
- Build applications
- Run migrations
- Deploy services
- Health checks

#### decommission-legacy.sh
**Purpose:** Shutdown and archive legacy .NET system

**Usage:**
```bash
./scripts/deployment/decommission-legacy.sh
```

**Features:**
- Stop legacy services
- Archive code
- Backup database
- Update documentation

### Database Scripts

#### clear_all_tables.sql
**Purpose:** Clear all data from tables (development only)

**Usage:**
```sql
psql -d complycrafter -f scripts/database/clear_all_tables.sql
```

**⚠️ Warning:** This will delete all data!

#### clearuser.sql
**Purpose:** Clear user data (development only)

#### comply_crafter_db.sql
**Purpose:** Complete database schema

---

## 🔒 Safety Guidelines

### Before Running Scripts

1. ✅ Review script contents
2. ✅ Backup data if needed
3. ✅ Test in development first
4. ✅ Have rollback plan
5. ✅ Notify team members

### Production Scripts

- Always run in maintenance window
- Have rollback procedure ready
- Monitor logs during execution
- Verify results before proceeding

---

## 🎯 Script Categories

| Category | Scripts | Purpose |
|----------|---------|---------|
| **Migration** | 2 | Automated migration tools |
| **Deployment** | 3 | Production deployment |
| **Database** | 3 | Database management |
| **Development** | 1 | Dev environment setup |

---

**For questions, contact DevOps team.**

