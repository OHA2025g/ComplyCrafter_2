# Scripts Directory

Collection of utility scripts for ComplyCrafter project.

---

## 📋 Quick Reference

| Script | Purpose | Usage |
|--------|---------|-------|
| `setup_masters_meetings.sh` | Setup Masters & Meetings database | `./setup_masters_meetings.sh` |
| `seed_companies.sh` | Seed sample company data | `./seed_companies.sh` |
| `update_company_data.sh` | Update company incorporation dates | `./update_company_data.sh` |
| `fix_angular_di.sh` | Fix Angular DI errors | `./fix_angular_di.sh` |

---

## 🗂️ Organized Scripts

### Setup Scripts (`setup/`)
Initial project setup and configuration.

### Database Scripts (`database/`)
- `backup.sql` - Backup database
- `restore.sql` - Restore database
- `cleanup.sql` - Clean up old data

### Deployment Scripts (`deployment/`)
- `deploy.sh` - Deploy to production
- `rollback.sh` - Rollback deployment
- Various environment-specific scripts

### Testing Scripts (`testing/`)
- `test_all_apis.sh` - Test all API endpoints
- Other API/E2E test scripts

### Migration Scripts (`migration/`)
- Tools for migrating from legacy .NET system

---

## 📦 Main Scripts (Root Level)

### `setup_masters_meetings.sh`
**Purpose**: Setup all Masters and Meetings database tables with sample data

**What it does:**
- Creates 9 database tables (agendas, capitals, meetings)
- Adds proper indexes
- Seeds sample data (26 records)
- Verifies data was created

**Usage:**
```bash
./setup_masters_meetings.sh
```

**Output:**
- ✅ Creates agendas table (3 records)
- ✅ Creates shareholder_transactions table (3 records)
- ✅ Creates capital structure tables (6 records)
- ✅ Creates meeting tables (14 records)

---

### `seed_companies.sh`
**Purpose**: Seed sample company data into user_companies table

**What it does:**
- Inserts 6 sample companies
- Sets realistic incorporation dates
- Marks companies as active/inactive
- Shows company list

**Usage:**
```bash
./seed_companies.sh
```

**Sample Data:**
- Tech Innovations Private Limited
- Global Solutions India Pvt Ltd
- Mumbai Trading Corporation
- Bangalore Finance Services Ltd
- Chennai Consulting Group
- Gujarat Education Services

---

### `update_company_data.sh`
**Purpose**: Update existing companies with incorporation dates

**What it does:**
- Updates incorporation_date for all companies
- Sets realistic dates based on CIN
- Verifies updates

**Usage:**
```bash
./update_company_data.sh
```

---

### `fix_angular_di.sh`
**Purpose**: Fix Angular Dependency Injection errors

**What it does:**
- Clears `.angular/` directory
- Clears `node_modules/.cache/`
- Clears `dist/` directory
- Resets NX cache
- Provides instructions to restart dev server

**Usage:**
```bash
./fix_angular_di.sh
```

**When to use:**
- Getting NG0202 errors
- After adding new services
- After major Angular updates
- Build cache issues

---

## 🔧 Usage Patterns

### First Time Setup
```bash
# 1. Setup database tables
./setup_masters_meetings.sh

# 2. Seed company data
./seed_companies.sh

# 3. Update company dates
./update_company_data.sh
```

### After Code Changes
```bash
# If Angular shows DI errors
./fix_angular_di.sh
```

### Testing
```bash
# Test all APIs
./testing/test_all_apis.sh
```

---

## 📝 Script Conventions

### Naming
- Use kebab-case: `setup-something.sh`
- Be descriptive: `seed_companies.sh` not `seed.sh`
- Include verb: `update_`, `fix_`, `test_`, `deploy_`

### Structure
All scripts should:
1. Start with `#!/bin/bash`
2. Use `set -e` for error handling
3. Print clear status messages
4. Show success/error indicators
5. Include usage comments

### Example Script Template
```bash
#!/bin/bash
# Script purpose and description
# Usage: ./script-name.sh

set -e

echo "Starting process..."

# Do work here

echo "✅ Process complete!"
```

---

## 🚀 Creating New Scripts

### Template
```bash
#!/bin/bash
# Your script description
# Usage: ./your-script.sh

set -e

PROJECT_ROOT="/Users/aghoresgwarprasadsingh/Desktop/OHA Systems/Comply Crafter/Comply-Crafter-code"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Your Script Title"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Your code here

echo "✅ Done!"
```

### Best Practices
1. Add to appropriate subdirectory
2. Make executable: `chmod +x script.sh`
3. Test before committing
4. Document in this README
5. Use clear error messages

---

## 🔍 Finding Scripts

### By Purpose
- **Setup**: `setup/` directory
- **Database**: `database/` directory  
- **Deployment**: `deployment/` directory
- **Testing**: `testing/` directory
- **Migration**: `migration/` directory

### By Name
```bash
# List all scripts
find . -name "*.sh" -type f

# Search by name
find . -name "*company*" -type f

# Search by content
grep -r "user_companies" *.sh
```

---

## ⚠️ Important Notes

1. **Always run from project root** unless script specifies otherwise
2. **Make scripts executable**: `chmod +x script.sh`
3. **Check Docker is running** for database scripts
4. **Read script comments** before running
5. **Keep backups** before running destructive scripts

---

## 📚 Related Documentation

- [Project Structure](../docs/PROJECT_STRUCTURE.md) - Complete project layout
- [Quick Start](../START_HERE.md) - Getting started guide
- [Deployment Guide](../docs/deployment/README.md) - Deployment instructions

---

**Last Updated**: November 2, 2025  
**Total Scripts**: 20+  
**Maintained By**: Development Team  
