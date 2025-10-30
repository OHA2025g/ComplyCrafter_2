# 🏗️ System/Application Architecture
## ComplyCrafter - Complete System Overview

**Version:** 1.0  
**Date:** October 31, 2025  
**Status:** ✅ Production

---

## 📋 System Overview

ComplyCrafter is a modern, microservices-based MCA forms platform built with Angular, FastAPI, and PostgreSQL.

---

## 🌐 High-Level System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        WEB[Web Browser<br/>Desktop/Mobile]
        PWA[Progressive Web App<br/>Future]
    end

    subgraph "Frontend Layer - Port 4200"
        ANGULAR[Angular 17 Frontend<br/>NX Workspace]
        ROUTER[Angular Router<br/>65 Routes]
        COMPONENTS[Components<br/>62 Forms + Auth]
        SERVICES[Services<br/>API Client, Auth]
    end

    subgraph "API Gateway Layer - Port 8000"
        GATEWAY[API Gateway<br/>FastAPI]
        PROXY[Request Proxy]
        RATE_LIMIT[Rate Limiting]
        AUTH_MW[Auth Middleware]
    end

    subgraph "Backend Services Layer - Port 8100"
        FORMS_API[Forms Service<br/>FastAPI]
        AUTH_API[Auth Module<br/>JWT/OAuth]
        subgraph "Business Logic"
            SERVICES_BL[62 Form Services<br/>Async Business Logic]
            AUTH_SVC[Auth Service<br/>Password Hashing]
        end
    end

    subgraph "Data Layer - Port 5432"
        POSTGRES[(PostgreSQL 15<br/>Database)]
        subgraph "Database Schema"
            FORM_TABLES[(Form Tables<br/>62 tables)]
            AUTH_TABLES[(Auth Tables<br/>user_accounts)]
            JSON_TABLES[(JSON Tables<br/>json_submissions)]
        end
    end

    subgraph "Infrastructure Layer"
        DOCKER[Docker Containers<br/>4 Services]
        COMPOSE[Docker Compose<br/>Orchestration]
        VOLUMES[Persistent Volumes<br/>DB Data, Logs]
    end

    WEB -->|HTTPS| ANGULAR
    PWA -->|HTTPS| ANGULAR
    ANGULAR --> ROUTER
    ROUTER --> COMPONENTS
    COMPONENTS --> SERVICES
    
    SERVICES -->|REST API| GATEWAY
    GATEWAY --> PROXY
    PROXY --> RATE_LIMIT
    RATE_LIMIT --> AUTH_MW
    
    AUTH_MW -->|Forward| FORMS_API
    AUTH_MW -->|Forward| AUTH_API
    
    FORMS_API --> SERVICES_BL
    AUTH_API --> AUTH_SVC
    
    SERVICES_BL -->|SQLAlchemy ORM| POSTGRES
    AUTH_SVC -->|SQLAlchemy ORM| POSTGRES
    
    POSTGRES --> FORM_TABLES
    POSTGRES --> AUTH_TABLES
    POSTGRES --> JSON_TABLES
    
    DOCKER --> ANGULAR
    DOCKER --> GATEWAY
    DOCKER --> FORMS_API
    DOCKER --> POSTGRES
    COMPOSE -.->|Manages| DOCKER
    VOLUMES -.->|Persistent Data| POSTGRES

    style ANGULAR fill:#6366f1,color:#fff
    style FORMS_API fill:#8b5cf6,color:#fff
    style POSTGRES fill:#336791,color:#fff
    style GATEWAY fill:#10b981,color:#fff
```

---

## 🔄 Request Flow

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant Angular
    participant Gateway
    participant FormsAPI
    participant Database

    User->>Browser: Access http://localhost:4200/forms/adt1
    Browser->>Angular: Load Form Component
    Angular->>Angular: Render ADT1 Form
    Angular-->>Browser: Display Form UI
    
    User->>Browser: Fill Form & Submit
    Browser->>Angular: Form Submit Event
    Angular->>Angular: Validate Form Data
    
    Angular->>Gateway: POST /forms/adt1 (JSON)
    Gateway->>Gateway: Rate Limit Check
    Gateway->>Gateway: Auth Verification
    Gateway->>FormsAPI: Forward Request
    
    FormsAPI->>FormsAPI: Validate with Pydantic
    FormsAPI->>FormsAPI: Call ADT1 Service
    FormsAPI->>Database: INSERT INTO adt1_submissions
    Database-->>FormsAPI: Return ID
    
    FormsAPI-->>Gateway: 201 Created (JSON)
    Gateway-->>Angular: Response
    Angular-->>Browser: Show Success Message
    Browser-->>User: "Form Submitted Successfully!"
```

---

## 🏛️ Microservices Architecture

```mermaid
graph LR
    subgraph "Presentation Tier"
        FE[Frontend Service<br/>Angular 17]
    end

    subgraph "API Tier"
        GW[Gateway Service<br/>FastAPI]
    end

    subgraph "Application Tier"
        FORMS[Forms Service<br/>FastAPI<br/>62 Forms]
        AUTH[Auth Module<br/>Within Forms Service]
    end

    subgraph "Data Tier"
        DB[(Database<br/>PostgreSQL 15)]
        CACHE[(Redis Cache<br/>Future)]
    end

    subgraph "Infrastructure"
        DOCKER[Docker Engine]
        NETWORK[Docker Network]
    end

    FE -->|HTTP/REST| GW
    GW -->|Proxy| FORMS
    GW -->|Proxy| AUTH
    FORMS -->|ORM| DB
    AUTH -->|ORM| DB
    FORMS -.->|Cache| CACHE
    
    DOCKER -.->|Contains| FE
    DOCKER -.->|Contains| GW
    DOCKER -.->|Contains| FORMS
    DOCKER -.->|Contains| DB
    NETWORK -.->|Connects| DOCKER

    style FE fill:#6366f1,color:#fff
    style FORMS fill:#8b5cf6,color:#fff
    style DB fill:#336791,color:#fff
    style GW fill:#10b981,color:#fff
```

---

## 🔧 Technology Stack

```mermaid
graph TD
    subgraph "Frontend Stack"
        A1[Angular 17]
        A2[NX 18]
        A3[TypeScript 5]
        A4[TailwindCSS]
        A5[RxJS]
    end

    subgraph "Backend Stack"
        B1[Python 3.11]
        B2[FastAPI]
        B3[SQLAlchemy]
        B4[Pydantic]
        B5[Uvicorn]
    end

    subgraph "Database Stack"
        C1[PostgreSQL 15]
        C2[Asyncpg Driver]
        C3[Alembic Migrations]
    end

    subgraph "DevOps Stack"
        D1[Docker]
        D2[Docker Compose]
        D3[Poetry]
        D4[npm]
    end

    A1 & A2 & A3 --> FRONTEND[Frontend Application]
    B1 & B2 & B3 --> BACKEND[Backend Services]
    C1 & C2 --> DATABASE[Database Layer]
    D1 & D2 --> INFRA[Infrastructure]

    FRONTEND -->|Calls| BACKEND
    BACKEND -->|Queries| DATABASE
    INFRA -->|Orchestrates| FRONTEND
    INFRA -->|Orchestrates| BACKEND
    INFRA -->|Orchestrates| DATABASE

    style FRONTEND fill:#6366f1,color:#fff
    style BACKEND fill:#8b5cf6,color:#fff
    style DATABASE fill:#336791,color:#fff
    style INFRA fill:#10b981,color:#fff
```

---

## 📊 Component Breakdown

### **Frontend Components: 65**
- Forms: 62 components
- Auth: 2 components (login, signup)
- Navigation: 1 component (forms-list)

### **Backend Services: 63**
- Form Services: 62 services
- Auth Service: 1 service

### **Database Tables: 64**
- Form Tables: 62 tables
- Auth Tables: 1 table (user_accounts)
- JSON Tables: 1 table (json_submissions)

### **API Endpoints: 230**
- Form Endpoints: 227 (GET, POST, PUT, DELETE for 62 forms)
- Auth Endpoints: 3 (signup, login, me)

---

## 🌍 Deployment Architecture

```mermaid
graph TB
    subgraph "Production Environment"
        LB[Load Balancer<br/>SSL Termination]
        
        subgraph "Application Cluster"
            FE1[Frontend Instance 1]
            FE2[Frontend Instance 2]
            API1[Backend Instance 1]
            API2[Backend Instance 2]
        end
        
        subgraph "Data Layer"
            DBPRIMARY[(Primary DB<br/>PostgreSQL)]
            DBREPLICA[(Read Replica<br/>PostgreSQL)]
            REDIS[(Redis Cache)]
        end
        
        subgraph "Monitoring"
            PROM[Prometheus]
            GRAF[Grafana]
            LOGS[Log Aggregation]
        end
    end

    USERS[Users] -->|HTTPS| LB
    LB --> FE1 & FE2
    FE1 & FE2 -->|API Calls| LB
    LB --> API1 & API2
    API1 & API2 -->|Write| DBPRIMARY
    API1 & API2 -->|Read| DBREPLICA
    API1 & API2 -->|Cache| REDIS
    DBPRIMARY -->|Replication| DBREPLICA
    
    API1 & API2 -.->|Metrics| PROM
    FE1 & FE2 -.->|Metrics| PROM
    PROM --> GRAF
    API1 & API2 -.->|Logs| LOGS
    FE1 & FE2 -.->|Logs| LOGS

    style LB fill:#f59e0b,color:#fff
    style DBPRIMARY fill:#336791,color:#fff
    style DBREPLICA fill:#60a5fa,color:#fff
    style REDIS fill:#dc2626,color:#fff
```

---

## 📈 Scalability Model

```mermaid
graph TB
    subgraph "Horizontal Scaling"
        FE_SCALE[Frontend<br/>2-10 Instances]
        API_SCALE[Backend<br/>2-20 Instances]
    end

    subgraph "Vertical Scaling"
        DB_SCALE[(Database<br/>4-32 CPU<br/>16-128 GB RAM)]
    end

    subgraph "Auto-Scaling Triggers"
        CPU[CPU > 70%]
        MEM[Memory > 80%]
        REQ[Requests > 1000/min]
    end

    CPU --> FE_SCALE
    MEM --> API_SCALE
    REQ --> FE_SCALE

    FE_SCALE -->|Distributed Load| USERS[Users 1k-100k]
    API_SCALE -->|Process Requests| FE_SCALE
    DB_SCALE -->|Data Storage| API_SCALE

    style FE_SCALE fill:#6366f1,color:#fff
    style API_SCALE fill:#8b5cf6,color:#fff
    style DB_SCALE fill:#336791,color:#fff
```

---

## ✅ System Characteristics

| Aspect | Implementation | Status |
|--------|----------------|--------|
| **Architecture** | Microservices | ✅ |
| **Frontend** | SPA (Single Page App) | ✅ |
| **Backend** | RESTful API | ✅ |
| **Database** | Relational (PostgreSQL) | ✅ |
| **Async** | Full async/await | ✅ |
| **Containerized** | Docker | ✅ |
| **Scalable** | Horizontal & Vertical | ✅ |
| **Type-Safe** | TypeScript + Pydantic | ✅ |

---

## 🎯 Key Design Principles

1. **Separation of Concerns** - Clear layer separation
2. **Microservices** - Independent, scalable services
3. **API-First** - Well-defined API contracts
4. **Type Safety** - Strong typing throughout
5. **Async Operations** - Non-blocking I/O
6. **Containerization** - Portable, reproducible environments
7. **Documentation** - Auto-generated API docs

---

**Version:** 1.0  
**Last Updated:** October 31, 2025  
**Status:** ✅ Production Ready

