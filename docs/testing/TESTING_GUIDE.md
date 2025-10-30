# Testing Guide - Verifying the Fixes

This guide will help you verify that all the fixes have been applied correctly and the application runs without errors.

## Prerequisites

- Docker and Docker Compose installed
- Node.js and npm installed (for local frontend development)
- Python 3.11+ and Poetry installed (for local backend development)

---

## Testing the Fixes

### 1. Frontend Package Version Fix

**Test:** Verify the correct jest-preset-angular version is installed

```bash
cd frontend
npm install
```

**Expected Result:** Installation should complete without ETARGET/notarget errors.

**Verify:**
```bash
cat package.json | grep jest-preset-angular
# Should show: "jest-preset-angular": "^14.0.0",
```

---

### 2. Docker Build Test

**Test:** Verify all Dockerfiles exist and can build

```bash
# From project root

# Test forms service Dockerfile
docker build -t comply-forms-test services/forms/

# Test gateway service Dockerfile
docker build -t comply-gateway-test services/gateway/

# Test frontend Dockerfile
docker build -t comply-frontend-test frontend/
```

**Expected Result:** All three builds should complete successfully without "Dockerfile not found" errors.

---

### 3. Full Stack Docker Compose Test

**Test:** Start all services with docker-compose

```bash
cd ops
docker-compose up
```

**Expected Results:**

1. **Database (db)** should start first
   ```
   db-1       | database system is ready to accept connections
   ```

2. **Forms service** should start without import errors
   ```
   forms-1    | INFO:     Uvicorn running on http://0.0.0.0:8100 (Press CTRL+C to quit)
   forms-1    | INFO:     Started reloader process [1] using WatchFiles
   ```
   
   **Should NOT see:**
   ```
   ModuleNotFoundError: No module named 'app.api.schemas'
   ```

3. **Gateway service** should start
   ```
   gateway-1  | INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
   ```

4. **Frontend** should start and be accessible
   ```
   frontend-1 | ➜  Local:   http://localhost:4200/
   frontend-1 | ➜  Network: http://0.0.0.0:4200/
   ```

---

### 4. Endpoint Testing

**Test:** Verify services are responding

```bash
# Test forms service health endpoint
curl http://localhost:8100/healthz

# Expected response:
# {"status":"ok","service":"ComplyCrafter Forms Service","environment":"dev"}

# Test gateway service health endpoint
curl http://localhost:8000/healthz

# Test frontend (should see HTML)
curl http://localhost:4200/

# Should NOT see:
# curl: (7) Failed to connect to localhost port 4200: Connection refused
```

---

### 5. Forms API Endpoints Test

**Test:** Verify the forms endpoints are working

```bash
# List ADT1 submissions
curl http://localhost:8100/forms/adt1

# Expected: [] or list of submissions

# List BEN2 submissions
curl http://localhost:8100/forms/ben2

# List PAS3 submissions
curl http://localhost:8100/forms/pas3

# List DPT3 submissions
curl http://localhost:8100/forms/dpt3
```

---

### 6. Core Module Test

**Test:** Verify the core module is properly structured

```bash
cd services/forms

# Check all core files exist
ls -la app/core/

# Should show:
# __init__.py
# config.py
# database.py
# exceptions.py
# logging.py
# security.py
# README.md
```

---

## Common Issues and Solutions

### Issue: Port Already in Use

**Error:**
```
Error response from daemon: driver failed programming external connectivity
```

**Solution:**
```bash
# Stop any running containers
docker-compose down

# Check for processes using the ports
lsof -i :4200  # Frontend
lsof -i :8000  # Gateway
lsof -i :8100  # Forms

# Kill the processes if needed
kill -9 <PID>
```

---

### Issue: Database Connection Errors

**Error:**
```
could not connect to server: Connection refused
```

**Solution:**
```bash
# Wait for database to be ready (usually 5-10 seconds)
# Or restart the services
docker-compose restart forms gateway
```

---

### Issue: Module Import Errors (if any persist)

**Check:**
1. Verify the import paths use three dots (`...`) not two (`..`)
2. Check that the module exists in the correct location
3. Verify `__init__.py` files exist in all package directories

---

## Success Criteria

✅ All Docker containers start without errors
✅ Forms service runs without `ModuleNotFoundError`
✅ Frontend is accessible at http://localhost:4200
✅ Gateway is accessible at http://localhost:8000
✅ Forms service is accessible at http://localhost:8100
✅ Health check endpoints return valid responses
✅ Core module files all exist

---

## Logs and Debugging

### View Service Logs

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs forms
docker-compose logs gateway
docker-compose logs frontend
docker-compose logs db

# Follow logs in real-time
docker-compose logs -f forms
```

### Enter a Running Container

```bash
# Enter forms service container
docker exec -it ops-forms-1 /bin/bash

# Enter gateway service container
docker exec -it ops-gateway-1 /bin/bash

# Enter frontend service container
docker exec -it ops-frontend-1 /bin/sh
```

### Check Python Imports

```bash
# Inside forms container
python -c "from app.core import get_settings; print('Success!')"
python -c "from app.schemas import Adt1Create; print('Success!')"
python -c "from app.services import adt1_service; print('Success!')"
```

---

## Next Steps After Successful Testing

1. Run the database migrations (if needed)
2. Configure environment variables for production
3. Set up proper authentication with Keycloak
4. Configure CORS origins for your domain
5. Set up monitoring and logging
6. Review and update the remaining service files that still reference old import patterns

---

**Happy Testing!** 🚀

If you encounter any issues not covered in this guide, check the application logs and refer to FIXES_APPLIED.md for details on what was changed.

