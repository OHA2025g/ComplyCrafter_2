# 🚀 Quick Start Guide - ComplyCrafter v1.0

**Get ComplyCrafter running in 5 minutes!**

---

## ⚡ Prerequisites

### **Required:**
- **Docker** & Docker Compose (recommended)
- **Git** (to clone repository)
- **8GB RAM** minimum
- **10GB disk space**

### **Optional (for development):**
- Node.js 18+ & npm (for frontend)
- Python 3.11+ (for backend)
- PostgreSQL 15+ (if not using Docker)

---

## 🐳 Option 1: Docker (Recommended)

### **Step 1: Clone Repository**
```bash
# Clone the repository
git clone https://github.com/ComplyCrafter/ComplyCrafterNew.git
cd ComplyCrafterNew
```

### **Step 2: Start Services**
```bash
# Start all services
cd ops
docker-compose up -d

# Wait for services to be ready (30-60 seconds)
docker-compose ps
```

### **Step 3: Verify Services**
```bash
# Check service status
docker-compose ps

# You should see:
# - frontend (port 4200)
# - forms (port 8100)
# - gateway (port 8000)
# - db (port 5432)
# - redis (port 6379)
# - keycloak (port 8080)
# - mca-cache-updater
```

### **Step 4: Access Application**
Open your browser and navigate to:
- **Frontend:** http://localhost:4200
- **API Docs:** http://localhost:8100/docs
- **Backend API:** http://localhost:8100

### **Step 5: Test It Out**
1. Navigate to http://localhost:4200
2. Click on "Forms" to see all 62 forms
3. Try filling out a form (e.g., ADT1)
4. Check the API documentation at http://localhost:8100/docs

**🎉 Success!** ComplyCrafter is now running!

---

## 💻 Option 2: Development Mode

### **Step 1: Setup Database**
```bash
# Start PostgreSQL
docker run -d \
  --name comply-db \
  -p 5432:5432 \
  -e POSTGRES_USER=comply \
  -e POSTGRES_PASSWORD=comply \
  -e POSTGRES_DB=comply \
  postgres:15

# Run migrations
cd services/forms
export DATABASE_URL="postgresql://comply:comply@localhost:5432/comply"
python -m alembic upgrade head
```

### **Step 2: Setup Backend**
```bash
# Navigate to backend
cd services/forms

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start backend
uvicorn app.main:app --reload --port 8100
```

### **Step 3: Setup Frontend**
```bash
# Open new terminal
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

### **Step 4: Access Application**
- **Frontend:** http://localhost:4200
- **Backend API:** http://localhost:8100
- **API Docs:** http://localhost:8100/docs

**🎉 Success!** Development environment is ready!

---

## 🧪 Verify Installation

### **Test Backend:**
```bash
# Health check
curl http://localhost:8100/healthz

# Expected response:
# {"status":"ok","service":"ComplyCrafter Forms Service"}
```

### **Test Frontend:**
```bash
# Check if server is responding
curl -I http://localhost:4200

# Expected: HTTP 200 or 404 (Angular SPA routing)
```

### **Test Database:**
```bash
# Connect to database
docker exec -it ops-db-1 psql -U comply -d comply

# List tables
\dt

# Expected: 68 tables
```

### **Run Tests:**
```bash
# Run comprehensive tests
cd scripts/testing
./test_all_62_forms_complete.sh
```

---

## 📊 What You Get

### **Services Running:**
- ✅ **Frontend** - Angular 17 SPA (port 4200)
- ✅ **Backend** - FastAPI service (port 8100)
- ✅ **Database** - PostgreSQL 15 (port 5432)
- ✅ **Gateway** - API Gateway (port 8000)
- ✅ **Redis** - Cache (port 6379)
- ✅ **Keycloak** - Auth (port 8080)
- ✅ **MCA Cache Updater** - Background job

### **Features Available:**
- 📝 **62 MCA Forms** - All statutory forms
- 🔐 **Authentication** - Signup & Login
- 📊 **Dashboard** - Overview of submissions
- 🔍 **Company Search** - MCA API integration
- 📈 **Performance** - Optimized with caching
- 📖 **API Docs** - Interactive Swagger UI

---

## 🔧 Common Commands

### **Start Services:**
```bash
docker-compose up -d              # Start all services
docker-compose up -d frontend     # Start frontend only
docker-compose up -d forms        # Start backend only
```

### **Stop Services:**
```bash
docker-compose down              # Stop all services
docker-compose stop              # Stop without removing containers
```

### **View Logs:**
```bash
docker-compose logs -f           # All logs
docker-compose logs -f forms     # Backend logs only
docker-compose logs -f frontend  # Frontend logs only
```

### **Restart Services:**
```bash
docker-compose restart           # Restart all
docker-compose restart forms     # Restart backend
docker-compose restart frontend  # Restart frontend
```

### **Check Status:**
```bash
docker-compose ps                # Service status
docker-compose top               # Resource usage
```

---

## 🐛 Troubleshooting

### **Services won't start:**
```bash
# Check if ports are in use
lsof -i :4200  # Frontend
lsof -i :8100  # Backend
lsof -i :5432  # Database

# Stop conflicting services or change ports
```

### **Database connection errors:**
```bash
# Verify database is running
docker-compose ps db

# Check database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

### **Frontend build errors:**
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### **Backend import errors:**
```bash
# Reinstall dependencies
cd services/forms
pip install --force-reinstall -r requirements.txt
```

### **Port conflicts:**
Edit `ops/docker-compose.yml` to change ports:
```yaml
ports:
  - "4201:4200"  # Change frontend port
  - "8101:8100"  # Change backend port
```

---

## 📚 Next Steps

### **For Developers:**
1. Read [Developer Guide](developer-guide.md)
2. Explore [Architecture](../architecture/system-overview.md)
3. Review [API Documentation](../api/README.md)
4. Check [Code Style Guide](developer-guide.md#code-style)

### **For QA/Testers:**
1. Review [Testing Strategy](../testing/strategy.md)
2. Run [Test Suite](../testing/e2e-testing.md)
3. Check [Test Reports](../reports/FINAL_QA_REPORT_COMPLETE.md)

### **For DevOps:**
1. Read [Deployment Guide](../deployment/README.md)
2. Review [Docker Setup](../deployment/docker.md)
3. Check [Production Checklist](../deployment/production-checklist.md)

---

## 🎯 First Tasks

### **Explore the Application:**
1. Open http://localhost:4200
2. Navigate through all 62 forms
3. Try submitting a form
4. Check the API documentation

### **Explore the Code:**
1. Frontend: `frontend/apps/portal/src/app`
2. Backend: `services/forms/app`
3. Database: `services/forms/migrations`
4. Scripts: `scripts/`

### **Make Your First Change:**
1. Edit a component in `frontend/apps/portal/src/app`
2. Hot reload will update automatically
3. Test your change
4. Commit and push

---

## ✅ Checklist

**Installation Complete When:**
- [ ] All services started successfully
- [ ] Frontend accessible at http://localhost:4200
- [ ] Backend accessible at http://localhost:8100
- [ ] API docs working at http://localhost:8100/docs
- [ ] Database has 68 tables
- [ ] Can view forms list
- [ ] Can fill and submit a form

**Ready for Development When:**
- [ ] Installation complete ✓
- [ ] Read [Developer Guide](developer-guide.md)
- [ ] Understand [Architecture](../architecture/system-overview.md)
- [ ] Explored the codebase
- [ ] Made first test change

---

## 📞 Need Help?

### **Getting Help:**
1. Check [Troubleshooting](../troubleshooting/common-issues.md)
2. Review [FAQs](faq.md)
3. Check [Documentation](../README.md)
4. Ask the team

### **Useful Links:**
- [Main README](../../README.md)
- [Documentation Index](../README.md)
- [Developer Guide](developer-guide.md)
- [Architecture Docs](../architecture/)

---

**🎉 Congratulations!** You've successfully set up ComplyCrafter!

Next: Read the [Developer Guide](developer-guide.md) to start building.

