# Quick Start Guide - Comply Crafter

## 🚀 Get Running in 3 Steps

### Step 1: Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

### Step 2: Start Docker Services
```bash
cd ops
docker-compose up --build
```

### Step 3: Access the Application
- **Frontend:** http://localhost:4200
- **Gateway API:** http://localhost:8000
- **Forms API:** http://localhost:8100
- **API Docs:** http://localhost:8100/docs

---

## 🔧 Common Commands

### Start Services
```bash
cd ops
docker-compose up
```

### Stop Services
```bash
docker-compose down
```

### Rebuild After Changes
```bash
docker-compose up --build
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f forms
docker-compose logs -f gateway
docker-compose logs -f frontend
```

### Clean Everything
```bash
docker-compose down -v
docker system prune -a
```

---

## 🧪 Test Endpoints

### Health Checks
```bash
curl http://localhost:8100/healthz    # Forms service
curl http://localhost:8000/healthz    # Gateway
```

### Forms Endpoints
```bash
curl http://localhost:8100/forms/adt1
curl http://localhost:8100/forms/ben2
curl http://localhost:8100/forms/pas3
curl http://localhost:8100/forms/dpt3
curl http://localhost:8100/forms/aoc4
curl http://localhost:8100/forms/msme
```

### API Documentation
Open in browser:
- Forms API: http://localhost:8100/docs
- Gateway API: http://localhost:8000/docs

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :4200  # Frontend
lsof -i :8000  # Gateway
lsof -i :8100  # Forms
lsof -i :5432  # Database

# Kill the process
kill -9 <PID>
```

### Database Connection Issues
```bash
# Restart just the database
docker-compose restart db

# Check database is running
docker-compose ps
```

### Import Errors
```bash
# Rebuild with no cache
docker-compose build --no-cache

# Check PYTHONPATH
docker exec ops-forms-1 env | grep PYTHON
```

### Frontend Not Loading
```bash
# Check if container is running
docker-compose ps frontend

# Rebuild frontend
docker-compose up --build frontend
```

---

## 📂 Project Structure

```
Comply-Crafter-code/
├── frontend/               # Angular/NX frontend
├── services/
│   ├── forms/             # Forms microservice
│   ├── gateway/           # API gateway
│   ├── billing/           # Billing service
│   ├── compliance/        # Compliance service
│   └── jobs/              # Background jobs
├── libs/
│   └── python/
│       └── data_access/   # Shared database lib
├── ops/
│   └── docker-compose.yml # Docker orchestration
└── docs/                  # Documentation
```

---

## 🔑 Environment Variables

### Forms Service
```bash
DATABASE_URL=postgresql+asyncpg://comply:comply@db:5432/comply
PYTHONPATH=/app:/app/libs
```

### Gateway Service
```bash
DATABASE_URL=postgresql+asyncpg://comply:comply@db:5432/comply
AUTH_ISSUER=http://keycloak:8080/realms/comply
FORMS_BASE_URL=http://forms:8100
PYTHONPATH=/app:/app/libs
```

---

## 📖 Documentation Files

- **COMPLETE_FIX_SUMMARY.md** - Overview of all fixes
- **FIXES_APPLIED.md** - Original 5 issues
- **CODE_REVIEW_FIXES.md** - Additional 3 issues
- **TESTING_GUIDE.md** - Comprehensive testing
- **QUICK_START.md** - This file

---

## ✅ Verify Installation

Run this to ensure everything is working:

```bash
# Health checks
curl http://localhost:8100/healthz
curl http://localhost:8000/healthz

# Forms endpoint
curl http://localhost:8100/forms/adt1

# Frontend (should return HTML)
curl http://localhost:4200/
```

All should return successful responses!

---

## 💡 Development Tips

1. **Hot Reload:** Code changes auto-reload (volume mounts configured)
2. **Database:** PostgreSQL data persists in named volume `db-data`
3. **Logs:** Use `docker-compose logs -f <service>` to debug
4. **Shell Access:** `docker exec -it ops-forms-1 /bin/bash`
5. **Python Console:** `docker exec -it ops-forms-1 python`

---

## 🎯 Next Steps

1. ✅ Start the application
2. ✅ Verify all services are running
3. ✅ Test the endpoints
4. 📝 Configure authentication (Keycloak)
5. 📝 Set up production environment
6. 📝 Configure CI/CD pipeline

---

**Happy Coding!** 🎉

