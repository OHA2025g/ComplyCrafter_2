# 🚀 Project Restructuring - Execution Guide

## 📋 Overview

This guide provides **step-by-step commands** to restructure the ComplyCrafter project safely.

**Estimated Time**: 6 weeks  
**Risk Level**: Medium  
**Reversible**: Yes (we create backups)

---

## ⚠️ Pre-Execution Checklist

### Before You Start:
- [ ] **Backup**: Create full project backup
- [ ] **Git**: Ensure all changes are committed
- [ ] **Branch**: Create restructuring branch
- [ ] **Team**: Notify all team members
- [ ] **Time**: Schedule during low-traffic period
- [ ] **Tests**: Ensure all tests pass currently

###Run Backup:
```bash
# Create backup
cd "/Users/aghoresgwarprasadsingh/Desktop/OHA Systems/Comply Crafter"
tar -czf "Comply-Crafter-code-backup-$(date +%Y%m%d-%H%M%S).tar.gz" "Comply-Crafter-code/"

# Verify backup
ls -lh Comply-Crafter-code-backup-*.tar.gz
```

### Create Restructuring Branch:
```bash
cd "/Users/aghoresgwarprasadsingh/Desktop/OHA Systems/Comply Crafter/Comply-Crafter-code"
git checkout -b feature/project-restructuring
git push -u origin feature/project-restructuring
```

---

## 📦 Phase 1: Frontend Restructuring

### Step 1.1: Create Core Module Structure

```bash
cd "/Users/aghoresgwarprasadsingh/Desktop/OHA Systems/Comply Crafter/Comply-Crafter-code/frontend/apps/portal/src/app"

# Create core module directories
mkdir -p core/guards
mkdir -p core/interceptors
mkdir -p core/services
mkdir -p core/models
mkdir -p core/constants

# Move guards to core
mv guards/auth.guard.ts core/guards/
mv guards/guest.guard.ts core/guards/
rmdir guards

# Move interceptors to core
mv interceptors/auth.interceptor.ts core/interceptors/
rmdir interceptors

# Move auth service to core
mv services/auth.service.ts core/services/

# Keep other services in features where they belong
# We'll move them later to their respective feature modules
```

### Step 1.2: Update Imports After Guard Move

```bash
# Update app.routes.ts imports
# FROM: import { authGuard } from './guards/auth.guard';
# TO:   import { authGuard } from './core/guards/auth.guard';

# Update app.config.ts imports
# FROM: import { authInterceptor } from './interceptors/auth.interceptor';
# TO:   import { authInterceptor } from './core/interceptors/auth.interceptor';
```

**Note**: After this step, run the frontend to ensure no errors:
```bash
cd "/Users/aghoresgwarprasadsingh/Desktop/OHA Systems/Comply Crafter/Comply-Crafter-code/frontend"
npm start
```

### Step 1.3: Consolidate Forms Directories

```bash
cd "/Users/aghoresgwarprasadsingh/Desktop/OHA Systems/Comply Crafter/Comply-Crafter-code/frontend/apps/portal/src/app"

# Move forms/ content to features/forms/components/
mkdir -p features/forms/components

# Move existing forms from app/forms to features/forms/components
mv forms/adt1 features/forms/components/
mv forms/ben2 features/forms/components/
mv forms/dpt3 features/forms/components/
mv forms/pas3 features/forms/components/
mv forms/generic-form features/forms/components/
mv forms/forms-list features/forms/components/

# Move forms.routes.ts to features/forms/
mv forms/forms.routes.ts features/forms/

# Remove old forms directory
rmdir forms

# Note: features/forms/ already has 62 forms, keep them all there
```

### Step 1.4: Organize Features Properly

```bash
cd "/Users/aghoresgwarprasadsingh/Desktop/OHA Systems/Comply Crafter/Comply-Crafter-code/frontend/apps/portal/src/app"

# Move auth to features
mv auth features/

# Move dashboard to features
mv dashboard features/

# Create features/company and move company-search
mkdir -p features/company
mv company features/company/

# Organize masters
mkdir -p features/masters/components
mv masters/*.component.ts features/masters/components/
mv masters/capital features/masters/components/

# Organize meetings
mkdir -p features/meetings/components
mv meetings/*.component.ts features/meetings/components/
```

### Step 1.5: Enhance Shared Module

```bash
cd "/Users/aghoresgwarprasadsingh/Desktop/OHA Systems/Comply Crafter/Comply-Crafter-code/frontend/apps/portal/src/app"

# Create shared subdirectories
mkdir -p shared/components
mkdir -p shared/directives
mkdir -p shared/pipes
mkdir -p shared/utils

# Move existing shared items
mv shared/sidebar shared/components/
mv shared/placeholder.component.ts shared/components/
```

### Step 1.6: Move Services to Feature Modules

```bash
cd "/Users/aghoresgwarprasadsingh/Desktop/OHA Systems/Comply Crafter/Comply-Crafter-code/frontend/apps/portal/src/app"

# Create services directories in features
mkdir -p features/masters/services
mkdir -p features/meetings/services
mkdir -p features/forms/services

# Move services to their features
mv services/companies.service.ts features/masters/services/
mv services/directors.service.ts features/masters/services/
mv services/shareholders.service.ts features/masters/services/
mv services/shareholder-management.service.ts features/masters/services/
mv services/share-certificates.service.ts features/masters/services/
mv services/debenture-holders.service.ts features/masters/services/
mv services/auditor.service.ts features/masters/services/
mv services/capital.service.ts features/masters/services/
mv services/agendas.service.ts features/masters/services/

mv services/meetings.service.ts features/meetings/services/

# Remove empty services directory
rmdir services
```

### Step 1.7: Create Environment Files

```bash
cd "/Users/aghoresgwarprasadsingh/Desktop/OHA Systems/Comply Crafter/Comply-Crafter-code/frontend/apps/portal/src"

# Create environments directory
mkdir -p environments

# Create environment files
cat > environments/environment.ts << 'EOF'
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8100',
  gatewayUrl: 'http://localhost:8000',
};
EOF

cat > environments/environment.prod.ts << 'EOF'
export const environment = {
  production: true,
  apiUrl: 'https://api.complycrafter.com',
  gatewayUrl: 'https://gateway.complycrafter.com',
};
EOF
```

---

## 📦 Phase 2: Root Level Cleanup

### Step 2.1: Move ALL Root-Level .md Files

```bash
cd "/Users/aghoresgwarprasadsingh/Desktop/OHA Systems/Comply Crafter/Comply-Crafter-code"

echo "📦 Moving ALL .md files from root to appropriate directories..."

# Create all necessary directories
mkdir -p docs/guides/features
mkdir -p docs/planning
mkdir -p docs/getting-started

# ============================================
# FILES THAT STAY IN ROOT (Essential)
# ============================================
# ✅ README.md - Main project README
# ✅ CHANGELOG.md - Version history

# ============================================
# MOVE: Feature Documentation
# ============================================
echo "  📄 Moving feature documentation..."
mv LOGOUT_IMPLEMENTATION_SUMMARY.md docs/guides/features/authentication-logout.md
mv ROUTE_PROTECTION_SUMMARY.md docs/guides/features/route-protection.md
mv SECURITY_FIX_COMPLETE.md docs/guides/features/security-implementation.md

# ============================================
# MOVE: Restructuring Documentation (ALL 6 files)
# ============================================
echo "  📄 Moving restructuring documentation..."
mv PROJECT_RESTRUCTURING_PLAN.md docs/planning/
mv RESTRUCTURING_BEFORE_AFTER.md docs/planning/
mv RESTRUCTURING_EXECUTION_GUIDE.md docs/planning/
mv RESTRUCTURING_QUICK_REFERENCE.md docs/planning/
mv RESTRUCTURING_README.md docs/planning/
mv RESTRUCTURING_UPDATE.md docs/planning/

# ============================================
# MOVE: Project Documentation
# ============================================
echo "  📄 Moving project documentation..."
mv PROJECT_INDEX.md docs/PROJECT_INDEX.md
mv START_HERE.md docs/getting-started/START_HERE.md

echo "✅ All .md files moved! Root directory cleaned up."
echo ""
echo "📊 Summary:"
echo "  • Kept in root: 2 files (README.md, CHANGELOG.md)"
echo "  • Moved to docs/: 11 files"
echo "  • Total root .md files: 2 (down from 13)"
echo ""
```

### Step 2.2: Move Root-Level Scripts

```bash
cd "/Users/aghoresgwarprasadsingh/Desktop/OHA Systems/Comply Crafter/Comply-Crafter-code"

# Move scripts
mkdir -p scripts/startup
mv start-complycrafter.sh scripts/startup/
mv test_mca_fix.sh scripts/testing/

# Remove temporary files
rm -f GIT_COMMIT_MESSAGE.txt

# Move logo to assets
mkdir -p frontend/apps/portal/src/assets/branding
mv comply_crafter_logo.png frontend/apps/portal/src/assets/branding/
```

### Step 2.3: Archive Legacy Code

```bash
cd "/Users/aghoresgwarprasadsingh/Desktop/OHA Systems/Comply Crafter/Comply-Crafter-code"

# Create .archive directory (hidden)
mkdir -p .archive/legacy-csharp
mkdir -p .archive/migration-backups

# Move legacy code
mv legacy/* .archive/legacy-csharp/
rmdir legacy

mv archive/* .archive/migration-backups/
rmdir archive

mv backups/* .archive/migration-backups/
rmdir backups

# Create README in .archive
cat > .archive/README.md << 'EOF'
# Archive Directory

This directory contains archived code and backups that are no longer actively used.

## Contents

- `legacy-csharp/` - Original C# ASP.NET codebase
- `migration-backups/` - Backup snapshots during migration

## Note

These files are kept for reference only. Do not use them in the current project.
EOF
```

---

## 📦 Phase 3: Backend Restructuring

### Step 3.1: Rename Services to Backend

```bash
cd "/Users/aghoresgwarprasadsingh/Desktop/OHA Systems/Comply Crafter/Comply-Crafter-code"

# Rename services directory to backend
mv services backend
```

### Step 3.2: Update Docker Compose

```bash
cd "/Users/aghoresgwarprasadsingh/Desktop/OHA Systems/Comply Crafter/Comply-Crafter-code/ops"

# Update docker-compose.yml paths
# Change all references from ./services/ to ./backend/
# This needs to be done with a text editor
```

### Step 3.3: Rename Ops to Infrastructure

```bash
cd "/Users/aghoresgwarprasadsingh/Desktop/OHA Systems/Comply Crafter/Comply-Crafter-code"

# Rename ops to infrastructure
mv ops infrastructure

# Create environment-specific structure
cd infrastructure
mkdir -p docker/development
mkdir -p docker/staging
mkdir -p docker/production

# Move docker-compose.yml to development
mv docker-compose.yml docker/development/
```

---

## 📦 Phase 4: Update All Import Paths

### Step 4.1: Update Frontend Imports

Create a script to help update imports:

```bash
cd "/Users/aghoresgwarprasadsingh/Desktop/OHA Systems/Comply Crafter/Comply-Crafter-code"

# Create update script
cat > scripts/utilities/update-imports.sh << 'EOF'
#!/bin/bash

cd frontend/apps/portal/src/app

# Update guard imports
find . -type f -name "*.ts" -exec sed -i '' "s|from './guards/|from './core/guards/|g" {} +
find . -type f -name "*.ts" -exec sed -i '' "s|from '../guards/|from '../core/guards/|g" {} +

# Update interceptor imports
find . -type f -name "*.ts" -exec sed -i '' "s|from './interceptors/|from './core/interceptors/|g" {} +
find . -type f -name "*.ts" -exec sed -i '' "s|from '../interceptors/|from '../core/interceptors/|g" {} +

# Update auth service imports
find . -type f -name "*.ts" -exec sed -i '' "s|from './services/auth.service'|from './core/services/auth.service'|g" {} +
find . -type f -name "*.ts" -exec sed -i '' "s|from '../services/auth.service'|from '../core/services/auth.service'|g" {} +
find . -type f -name "*.ts" -exec sed -i '' "s|from '../../services/auth.service'|from '../../core/services/auth.service'|g" {} +

echo "✅ Import paths updated!"
EOF

chmod +x scripts/utilities/update-imports.sh
./scripts/utilities/update-imports.sh
```

### Step 4.2: Update Configuration Files

```bash
cd "/Users/aghoresgwarprasadsingh/Desktop/OHA Systems/Comply Crafter/Comply-Crafter-code"

# Update startup script
sed -i '' 's|ops/docker-compose.yml|infrastructure/docker/development/docker-compose.yml|g' scripts/startup/start-complycrafter.sh

# Update README references
# This should be done manually as it requires context-aware changes
```

---

## 📦 Phase 5: Testing & Validation

### Step 5.1: Test Frontend

```bash
cd "/Users/aghoresgwarprasadsingh/Desktop/OHA Systems/Comply Crafter/Comply-Crafter-code/frontend"

# Install dependencies (if needed)
npm install

# Run linting
npm run lint

# Run tests
npm test

# Start development server
npm start
```

**Verify:**
- ✅ No compile errors
- ✅ All routes working
- ✅ Login/logout functional
- ✅ Forms accessible
- ✅ Dashboard displays correctly

### Step 5.2: Test Backend

```bash
cd "/Users/aghoresgwarprasadsingh/Desktop/OHA Systems/Comply Crafter/Comply-Crafter-code/infrastructure/docker/development"

# Stop existing services
docker compose down

# Start services with new structure
docker compose up -d

# Check service health
docker compose ps

# Test API endpoints
curl http://localhost:8100/health
curl http://localhost:8000/health
```

**Verify:**
- ✅ All services start
- ✅ Database connects
- ✅ API endpoints respond
- ✅ Forms service working

### Step 5.3: Integration Testing

```bash
cd "/Users/aghoresgwarprasadsingh/Desktop/OHA Systems/Comply Crafter/Comply-Crafter-code"

# Run smoke tests
./scripts/testing/smoke-test.sh

# Test critical flows:
# 1. Login
# 2. Access dashboard
# 3. Create a form
# 4. Access masters
# 5. Logout
```

---

## 📦 Phase 6: Documentation Update

### Step 6.1: Update README Files

```bash
cd "/Users/aghoresgwarprasadsingh/Desktop/OHA Systems/Comply Crafter/Comply-Crafter-code"

# Update main README with new structure
# This should be done manually

# Update package.json scripts if needed
# Update start scripts to reflect new paths
```

### Step 6.2: Create New Documentation Index

```bash
cd "/Users/aghoresgwarprasadsingh/Desktop/OHA Systems/Comply Crafter/Comply-Crafter-code/docs"

cat > README.md << 'EOF'
# ComplyCrafter Documentation

## 📚 Quick Links

- [Getting Started](./getting-started/README.md)
- [Architecture](./architecture/README.md)
- [API Documentation](./api/README.md)
- [Development Guides](./guides/README.md)

## 📖 Documentation Structure

- `getting-started/` - Setup and installation guides
- `architecture/` - System design and architecture
- `guides/` - How-to guides for development, deployment, features
- `api/` - API documentation
- `features/` - Feature-specific documentation
- `troubleshooting/` - Common problems and solutions

## 🚀 Quick Start

1. [Installation Guide](./getting-started/01-installation.md)
2. [Configuration Guide](./getting-started/02-configuration.md)
3. [First Steps](./getting-started/03-first-steps.md)

EOF
```

---

## 📦 Phase 7: Final Cleanup & Commit

### Step 7.1: Remove Empty Directories

```bash
cd "/Users/aghoresgwarprasadsingh/Desktop/OHA Systems/Comply Crafter/Comply-Crafter-code"

# Find and remove empty directories
find . -type d -empty -delete

# Verify no broken links
find . -type l ! -exec test -e {} \; -print
```

### Step 7.2: Update .gitignore

```bash
cd "/Users/aghoresgwarprasadsingh/Desktop/OHA Systems/Comply Crafter/Comply-Crafter-code"

# Add .archive to .gitignore (it's already hidden but make sure it's ignored)
echo "" >> .gitignore
echo "# Archive directory" >> .gitignore
echo ".archive/" >> .gitignore
echo "logs/" >> .gitignore
echo "*.log" >> .gitignore
```

### Step 7.3: Commit Changes

```bash
cd "/Users/aghoresgwarprasadsingh/Desktop/OHA Systems/Comply Crafter/Comply-Crafter-code"

# Stage all changes
git add -A

# Commit with detailed message
git commit -m "refactor: Complete project restructuring

- Consolidated frontend forms directories (removed duplication)
- Created core/ module for guards, interceptors, services
- Organized features by domain (auth, dashboard, forms, masters, meetings)
- Moved services to respective feature modules
- Renamed services/ to backend/
- Renamed ops/ to infrastructure/
- Archived legacy code to .archive/
- Moved root-level documentation to docs/
- Created environment-specific configurations
- Updated all import paths
- Improved overall project organization

BREAKING CHANGES:
- Directory structure has changed significantly
- Import paths have been updated
- Docker compose paths have changed
- Script locations have changed

See PROJECT_RESTRUCTURING_PLAN.md for complete details."

# Push to remote
git push origin feature/project-restructuring
```

---

## 📦 Phase 8: Review & Merge

### Step 8.1: Create Pull Request

1. Go to GitHub/GitLab
2. Create PR from `feature/project-restructuring` to `main`
3. Add detailed description
4. Request reviews from team

### Step 8.2: Team Review

**Review Checklist:**
- [ ] All tests passing
- [ ] No broken imports
- [ ] Documentation updated
- [ ] Docker configs working
- [ ] CI/CD pipelines updated
- [ ] Team approved

### Step 8.3: Merge to Main

```bash
# After approval, merge PR
# Then locally:
git checkout main
git pull origin main

# Tag the release
git tag -a v2.1.0 -m "Project restructuring complete"
git push origin v2.1.0
```

---

## 🎯 Post-Restructuring Tasks

### Update Team

- [ ] Announce completion
- [ ] Share updated documentation
- [ ] Conduct team walkthrough
- [ ] Update onboarding docs
- [ ] Update development guides

### Monitor

- [ ] Watch for issues
- [ ] Monitor performance
- [ ] Check error logs
- [ ] Gather feedback

### Continuous Improvement

- [ ] Review after 1 week
- [ ] Review after 1 month
- [ ] Identify improvements
- [ ] Implement refinements

---

## 🆘 Rollback Plan

If something goes wrong:

```bash
cd "/Users/aghoresgwarprasadsingh/Desktop/OHA Systems/Comply Crafter/Comply-Crafter-code"

# Restore from backup
cd ..
tar -xzf Comply-Crafter-code-backup-YYYYMMDD-HHMMSS.tar.gz

# Or revert git commits
git reset --hard HEAD~1

# Or revert to specific commit
git revert <commit-hash>
```

---

## 📞 Support

**Issues during restructuring?**
- Check logs: `docker compose logs`
- Review errors: `npm run lint`
- Consult team lead
- Create issue with `restructuring` label

---

**Status**: 📋 Ready for Execution  
**Last Updated**: November 4, 2025  
**Estimated Time**: 6 weeks  
**Risk Level**: Medium (with backups: Low)

