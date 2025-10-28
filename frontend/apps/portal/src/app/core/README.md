# Core Module

This module contains singleton services and core functionality that is used throughout the application.

---

## 📁 Structure

```
core/
├── services/              # Core services
│   ├── auth.service.ts
│   ├── api.service.ts
│   ├── storage.service.ts
│   └── notification.service.ts
│
├── guards/                # Route guards
│   ├── auth.guard.ts
│   └── role.guard.ts
│
├── interceptors/          # HTTP interceptors
│   ├── auth.interceptor.ts
│   ├── error.interceptor.ts
│   └── loading.interceptor.ts
│
├── models/                # Core models
│   ├── user.model.ts
│   ├── response.model.ts
│   └── error.model.ts
│
└── README.md (this file)
```

---

## 🎯 Purpose

The core module contains:
- **Services** that should be singleton (auth, API, storage)
- **Guards** for route protection
- **Interceptors** for HTTP requests
- **Core models** used across the app

---

## ⚠️ Important

- Import CoreModule only once in AppModule
- Do not import CoreModule in feature modules
- All services here are provided in 'root'

