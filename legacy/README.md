# Legacy .NET System

**Status:** ⚠️ **DEPRECATED** - Maintained for reference only  
**Replacement:** Modern Angular 17 + FastAPI system  
**Last Updated:** November 1, 2025

---

## ⚠️ Important Notice

This directory contains the **legacy .NET MVC system** that has been replaced by the modern stack. 

**Do NOT use this code for new development.**

---

## 📁 Contents

### **ComplyCrafter_API/** 
ASP.NET Core Web API project
- 85+ controllers
- REST API endpoints
- Company management
- Form submissions

### **ComplyCrafter_BL/**
Business Logic Layer
- Repository pattern
- Service classes
- Validation logic
- 58+ form repositories

### **ComplyCrafter_Data/**
Data Access Layer
- Entity models
- Database context
- 61+ form models
- Entity Framework

### **ComplyCrafter_UI/**
ASP.NET MVC Web Application
- Razor views (240+ views)
- Controllers
- wwwroot (static files)

### **ComplyCrafter_UI.sln**
Visual Studio Solution file

---

## 🔄 Migration Status

**✅ Migrated to Modern Stack:**
- Frontend: Angular 17 (in `/frontend`)
- Backend: FastAPI (in `/services/forms`)
- Database: PostgreSQL 15 (in `/services/forms/migrations`)
- All 62 forms migrated
- All API endpoints recreated
- All database tables migrated

**📊 Migration Stats:**
- Forms migrated: 62/62 (100%)
- API endpoints: 227+ (100%)
- Database tables: 68/68 (100%)
- Performance: 66% faster + 90% MCA optimization

---

## 🚫 Why Deprecated?

### **Problems with Legacy System:**
- ❌ Monolithic architecture
- ❌ Tight coupling
- ❌ Slow performance
- ❌ Difficult to test
- ❌ Hard to deploy
- ❌ No API documentation
- ❌ Limited scalability

### **Modern System Benefits:**
- ✅ Microservices architecture
- ✅ Loosely coupled
- ✅ Fast performance (66% faster)
- ✅ Easy to test
- ✅ Docker deployment
- ✅ OpenAPI/Swagger docs
- ✅ Highly scalable
- ✅ MCA API optimization (90% faster)

---

## 🔧 If You Need to Run Legacy System

### **Prerequisites:**
- .NET Core 6.0+
- SQL Server or PostgreSQL
- Visual Studio 2022+

### **Steps:**
```bash
# 1. Restore dependencies
dotnet restore ComplyCrafter_UI.sln

# 2. Update database connection
# Edit appsettings.json in each project

# 3. Run migrations
dotnet ef database update --project ComplyCrafter_Data

# 4. Run API
cd ComplyCrafter_API
dotnet run

# 5. Run UI
cd ComplyCrafter_UI
dotnet run
```

**⚠️ Warning:** Legacy system may not work with current database schema due to migrations for the modern system.

---

## 📚 Documentation

### **Architecture:**
See `/docs/legacy/architecture.md` for system design

### **API Reference:**
See `/docs/legacy/api-reference.md` for endpoints

### **Database Schema:**
See `/docs/legacy/database-schema.md` for tables

---

## 🔍 Code Reference

Use this legacy code only for:
- Understanding business logic
- Comparing implementations
- Field mapping verification
- Migration validation

**Do NOT:**
- Make new features here
- Fix bugs here
- Deploy to production
- Use as primary system

---

## ➡️ Modern System

**Use the modern system instead:**

### **Frontend:**
```bash
cd frontend
npm install
npm start
# http://localhost:4200
```

### **Backend:**
```bash
cd services/forms
pip install -r requirements.txt
uvicorn main:app --reload
# http://localhost:8100
```

### **Complete Stack:**
```bash
cd ops
docker-compose up -d
# All services running
```

---

## 📞 Support

For questions about:
- **Legacy system:** Reference only, no active support
- **Modern system:** See main README.md
- **Migration:** See `/docs/migration/`

---

## 🗑️ Deprecation Timeline

| Date | Event |
|------|-------|
| Oct 27, 2025 | Legacy code archived |
| Oct 31, 2025 | Modern system production ready |
| Nov 1, 2025 | Legacy moved to `/legacy` directory |
| Dec 31, 2025 | Legacy system fully deprecated |
| Mar 31, 2026 | Legacy code may be removed |

---

**For all new development, use the modern Angular 17 + FastAPI system!**

See main README.md for getting started.
