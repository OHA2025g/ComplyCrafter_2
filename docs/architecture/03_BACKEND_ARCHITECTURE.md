# ⚙️ Backend Architecture
## ComplyCrafter - FastAPI Microservices

**Version:** 1.0  
**Date:** October 31, 2025  
**Technology:** FastAPI + Python 3.11

---

## 🏛️ Backend Architecture Overview

```mermaid
graph TB
    subgraph "API Layer"
        MAIN[main.py<br/>FastAPI App]
        
        subgraph "Routers - 63 total"
            AUTH_ROUTER[auth.py<br/>Auth Endpoints]
            FORM_ROUTERS[Form Routers<br/>62 files]
        end
    end

    subgraph "Service Layer - Business Logic"
        AUTH_SERVICE[AuthService<br/>User Management]
        FORM_SERVICES[Form Services<br/>62 async services]
        
        subgraph "Service Operations"
            CREATE[Create Operations]
            READ[Read Operations]
            UPDATE[Update Operations]
            DELETE[Delete Operations]
            SEARCH[Search/Filter]
        end
    end

    subgraph "Data Access Layer"
        ORM[SQLAlchemy ORM<br/>Async]
        MODELS[Database Models<br/>62 models]
        SCHEMAS[Pydantic Schemas<br/>Validation]
    end

    subgraph "Core Layer"
        CONFIG[Configuration<br/>Settings Management]
        DATABASE[Database Connection<br/>Async Pool]
        SECURITY[Security<br/>Auth, Hashing]
        LOGGING[Logging<br/>Structured Logs]
        EXCEPTIONS[Exception Handling]
    end

    subgraph "Database"
        PG[(PostgreSQL 15<br/>64 Tables)]
    end

    MAIN --> AUTH_ROUTER
    MAIN --> FORM_ROUTERS
    
    AUTH_ROUTER --> AUTH_SERVICE
    FORM_ROUTERS --> FORM_SERVICES
    
    AUTH_SERVICE --> CREATE & READ
    FORM_SERVICES --> CREATE & READ & UPDATE & DELETE & SEARCH
    
    CREATE & READ & UPDATE & DELETE & SEARCH --> ORM
    ORM --> MODELS
    ORM --> SCHEMAS
    
    MODELS -->|Query| PG
    
    AUTH_SERVICE & FORM_SERVICES -.->|Use| CONFIG
    AUTH_SERVICE & FORM_SERVICES -.->|Use| DATABASE
    AUTH_SERVICE -.->|Use| SECURITY
    FORM_SERVICES -.->|Use| LOGGING
    AUTH_SERVICE & FORM_SERVICES -.->|Throw| EXCEPTIONS

    style MAIN fill:#8b5cf6,color:#fff
    style FORM_SERVICES fill:#6366f1,color:#fff
    style PG fill:#336791,color:#fff
    style ORM fill:#10b981,color:#fff
```

---

## 🛤️ API Routing Structure

```mermaid
graph LR
    API[FastAPI App<br/>main.py]
    
    subgraph "Auth Routes /auth"
        AUTH_SIGNUP[POST /auth/signup]
        AUTH_LOGIN[POST /auth/login]
        AUTH_ME[GET /auth/me]
    end

    subgraph "Form Routes /forms"
        GET_LIST[GET /forms/:formcode]
        GET_BY_ID[GET /forms/:formcode/:id]
        POST_CREATE[POST /forms/:formcode]
        PUT_UPDATE[PUT /forms/:formcode/:id]
        DELETE_REMOVE[DELETE /forms/:formcode/:id]
    end

    subgraph "Health Routes"
        HEALTH[GET /healthz]
        DOCS[GET /docs]
    end

    API --> AUTH_SIGNUP & AUTH_LOGIN & AUTH_ME
    API --> GET_LIST & GET_BY_ID & POST_CREATE & PUT_UPDATE & DELETE_REMOVE
    API --> HEALTH & DOCS

    style API fill:#8b5cf6,color:#fff
    style AUTH_SIGNUP fill:#6366f1,color:#fff
    style POST_CREATE fill:#10b981,color:#fff
```

---

## 💼 Service Layer Architecture

```mermaid
graph TB
    subgraph "Service Pattern - Example: ADT1Service"
        SERVICE_CLASS[ADT1Service Class]
        
        subgraph "Methods"
            CREATE_METHOD[create_adt1<br/>async def]
            GET_ALL[get_all_adt1<br/>async def]
            GET_BY_ID[get_adt1_by_id<br/>async def]
            UPDATE_METHOD[update_adt1<br/>async def]
            DELETE_METHOD[delete_adt1<br/>async def]
        end

        DB_SESSION[AsyncSession<br/>Database Connection]
        MODEL[Adt1 Model<br/>SQLAlchemy]
        SCHEMA[Adt1Create/Read Schemas<br/>Pydantic]
    end

    SERVICE_CLASS --> CREATE_METHOD & GET_ALL & GET_BY_ID & UPDATE_METHOD & DELETE_METHOD
    
    CREATE_METHOD & GET_ALL & GET_BY_ID & UPDATE_METHOD & DELETE_METHOD -->|Use| DB_SESSION
    CREATE_METHOD & UPDATE_METHOD -->|Validate| SCHEMA
    CREATE_METHOD & UPDATE_METHOD -->|Save| MODEL
    GET_ALL & GET_BY_ID -->|Query| MODEL

    style SERVICE_CLASS fill:#8b5cf6,color:#fff
    style DB_SESSION fill:#336791,color:#fff
    style SCHEMA fill:#10b981,color:#fff
```

---

## 🗃️ Data Model Layer

```mermaid
graph TB
    subgraph "Model Definition"
        BASE[Base Model<br/>SQLAlchemy Declarative]
        
        subgraph "Example: Adt1 Model"
            TABLE[__tablename__ = 'adt1_submissions']
            FIELDS[Fields<br/>Mapped columns]
            RELATIONSHIPS[Relationships<br/>Foreign Keys - Future]
        end
    end

    subgraph "Schema Definition"
        BASE_SCHEMA[BaseModel<br/>Pydantic]
        
        subgraph "Example: Adt1 Schemas"
            CREATE_SCHEMA[Adt1Create<br/>Input Validation]
            READ_SCHEMA[Adt1Read<br/>Output Serialization]
            UPDATE_SCHEMA[Adt1Update<br/>Partial Update]
        end
    end

    BASE --> TABLE & FIELDS & RELATIONSHIPS
    BASE_SCHEMA --> CREATE_SCHEMA & READ_SCHEMA & UPDATE_SCHEMA
    
    CREATE_SCHEMA -.->|Validates Input| FIELDS
    READ_SCHEMA -.->|Serializes Output| FIELDS

    style BASE fill:#336791,color:#fff
    style CREATE_SCHEMA fill:#10b981,color:#fff
    style FIELDS fill:#6366f1,color:#fff
```

---

## 🔧 Core Modules Architecture

```mermaid
graph TB
    subgraph "Core Module - app/core/"
        CONFIG_MOD[config.py<br/>Settings Management]
        DB_MOD[database.py<br/>DB Connection Pool]
        SECURITY_MOD[security.py<br/>Auth & Permissions]
        LOGGING_MOD[logging.py<br/>Structured Logging]
        EXCEPTIONS_MOD[exceptions.py<br/>Custom Exceptions]
    end

    subgraph "Configuration"
        ENV_VARS[Environment Variables]
        SETTINGS[Settings Class<br/>Pydantic BaseSettings]
    end

    subgraph "Database"
        ENGINE[Async Engine<br/>asyncpg]
        SESSION_FACTORY[Session Factory<br/>async_sessionmaker]
        GET_DB[get_db() Dependency<br/>Yields AsyncSession]
    end

    subgraph "Security"
        GET_USER[get_current_user()<br/>Auth Dependency]
        HASH_PASSWORD[Password Hashing<br/>SHA-256]
        VERIFY_TOKEN[Token Verification<br/>JWT - Future]
    end

    CONFIG_MOD --> ENV_VARS & SETTINGS
    DB_MOD --> ENGINE & SESSION_FACTORY & GET_DB
    SECURITY_MOD --> GET_USER & HASH_PASSWORD & VERIFY_TOKEN
    
    SETTINGS -.->|Used By| DB_MOD
    GET_DB -.->|Used By| FORM_SERVICES[All Services]
    GET_USER -.->|Protects| ROUTES[Protected Routes]

    style CONFIG_MOD fill:#8b5cf6,color:#fff
    style DB_MOD fill:#336791,color:#fff
    style SECURITY_MOD fill:#ef4444,color:#fff
```

---

## ⚡ Async Operations Flow

```mermaid
sequenceDiagram
    participant Router as Route Handler
    participant Service as Form Service
    participant DB as Database Session
    participant PG as PostgreSQL

    Router->>Service: await service.create_form(data)
    activate Service
    
    Service->>Service: Validate with Pydantic
    Service->>DB: db.add(model)
    Service->>DB: await db.commit()
    activate DB
    
    DB->>PG: INSERT query (async)
    activate PG
    PG-->>DB: Return ID
    deactivate PG
    
    DB-->>Service: Session updated
    deactivate DB
    
    Service->>DB: await db.refresh(model)
    activate DB
    DB->>PG: SELECT query
    PG-->>DB: Full object
    DB-->>Service: Refreshed model
    deactivate DB
    
    Service-->>Router: Return model
    deactivate Service
    Router-->>Client: JSON Response
```

---

## 📦 Dependency Injection

```mermaid
graph TB
    subgraph "FastAPI Dependency System"
        ROUTE[Route Function<br/>@router.post()]
        
        subgraph "Injected Dependencies"
            DB_DEP[db: AsyncSession = Depends<br/>get_async_session]
            USER_DEP[current_user: User = Depends<br/>get_current_user]
            SERVICE_DEP[service: FormService = Depends<br/>get_service]
        end
    end

    GET_DB[get_async_session()<br/>Generator]
    GET_USER[get_current_user()<br/>Auth Check]
    GET_SERVICE[get_service()<br/>Service Factory]

    ROUTE --> DB_DEP
    ROUTE --> USER_DEP
    ROUTE --> SERVICE_DEP
    
    DB_DEP -->|Resolves| GET_DB
    USER_DEP -->|Resolves| GET_USER
    SERVICE_DEP -->|Resolves| GET_SERVICE
    
    GET_DB -.->|Provides| DB_SESSION[(AsyncSession)]
    GET_USER -.->|Provides| USER[(User Object)]
    GET_SERVICE -.->|Provides| SERVICE[(Service Instance)]

    style ROUTE fill:#8b5cf6,color:#fff
    style DB_SESSION fill:#336791,color:#fff
    style USER fill:#ef4444,color:#fff
```

---

## 🔄 Request Processing Pipeline

```mermaid
graph LR
    REQUEST[Incoming Request] --> MIDDLEWARE[Middleware Chain]
    
    MIDDLEWARE --> CORS[CORS Middleware]
    CORS --> LOGGING[Logging Middleware]
    LOGGING --> AUTH_CHECK[Auth Middleware]
    
    AUTH_CHECK -->|Valid| ROUTER[Route Handler]
    AUTH_CHECK -->|Invalid| REJECT[401 Unauthorized]
    
    ROUTER --> VALIDATION[Pydantic Validation]
    VALIDATION -->|Valid| SERVICE[Service Layer]
    VALIDATION -->|Invalid| ERROR[422 Validation Error]
    
    SERVICE --> DATABASE[(Database)]
    DATABASE --> RESPONSE[Response Model]
    RESPONSE --> JSON[JSON Serialization]
    JSON --> CLIENT[Client Response]

    style REQUEST fill:#6366f1,color:#fff
    style SERVICE fill:#8b5cf6,color:#fff
    style DATABASE fill:#336791,color:#fff
    style JSON fill:#10b981,color:#fff
```

---

## 📊 Backend Services Summary

| Component | Count | Description |
|-----------|-------|-------------|
| **Routes** | 63 | API endpoint files |
| **Services** | 62 | Business logic services |
| **Models** | 62 | SQLAlchemy ORM models |
| **Schemas** | 120+ | Pydantic validation schemas |
| **Migrations** | 13 | SQL migration scripts |
| **Core Modules** | 5 | Config, DB, Security, Logging, Exceptions |

**Total Lines:** 15,000+ lines of Python code

---

## ✅ Backend Features

| Feature | Implementation | Status |
|---------|----------------|--------|
| **Async/Await** | Full async operations | ✅ |
| **Type Safety** | Pydantic validation | ✅ |
| **ORM** | SQLAlchemy 2.0 async | ✅ |
| **Auto Docs** | OpenAPI/Swagger | ✅ |
| **Dependency Injection** | FastAPI Depends | ✅ |
| **Error Handling** | Custom exceptions | ✅ |
| **Logging** | Structured logging | ✅ |
| **CORS** | Configured | ✅ |

---

**Version:** 1.0  
**Framework:** FastAPI  
**Python:** 3.11  
**Status:** ✅ Production Ready

