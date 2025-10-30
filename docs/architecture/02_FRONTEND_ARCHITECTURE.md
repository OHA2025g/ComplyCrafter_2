# 🎨 Frontend Architecture
## ComplyCrafter - Angular Application Structure

**Version:** 1.0  
**Date:** October 31, 2025  
**Technology:** Angular 17 + NX 18

---

## 📐 Frontend Architecture Overview

```mermaid
graph TB
    subgraph "Angular Application"
        subgraph "Core Modules"
            ROUTER[Router Module<br/>65 Routes]
            HTTP[HTTP Client Module<br/>API Communication]
            FORMS_MODULE[Reactive Forms<br/>Dynamic Form Generation]
        end

        subgraph "Feature Modules"
            AUTH_MODULE[Auth Module]
            FORMS_FEATURE[Forms Feature Module]
        end

        subgraph "Components"
            subgraph "Auth Components"
                LOGIN[Login Component]
                SIGNUP[Signup Component]
            end

            subgraph "Form Components"
                GENERIC[Generic Form Component<br/>Handles 51 forms]
                FORMS_LIST[Forms List Component<br/>Directory/Browse]
                ADT1[ADT1 Component]
                BEN2[BEN2 Component]
                PAS3[PAS3 Component]
                DPT3[DPT3 Component]
            end
        end

        subgraph "Services"
            API_SVC[API Client Service<br/>HTTP Wrapper]
            AUTH_SVC[Auth Service<br/>Token Management]
            FORM_SVC[Form Service<br/>Form State]
        end

        subgraph "Guards"
            AUTH_GUARD[Auth Guard<br/>Route Protection]
        end

        subgraph "Interceptors"
            AUTH_INT[Auth Interceptor<br/>Add JWT Token]
            ERROR_INT[Error Interceptor<br/>Global Error Handling]
        end

        subgraph "Shared"
            UI_LIB[UI Components Library<br/>CcCard, etc.]
            UTILS[Utilities<br/>Validators, Helpers]
        end
    end

    ROUTER --> AUTH_MODULE
    ROUTER --> FORMS_FEATURE
    
    AUTH_MODULE --> LOGIN
    AUTH_MODULE --> SIGNUP
    
    FORMS_FEATURE --> GENERIC
    FORMS_FEATURE --> FORMS_LIST
    FORMS_FEATURE --> ADT1
    FORMS_FEATURE --> BEN2
    FORMS_FEATURE --> PAS3
    FORMS_FEATURE --> DPT3
    
    LOGIN & SIGNUP --> AUTH_SVC
    GENERIC & FORMS_LIST & ADT1 --> API_SVC
    
    API_SVC --> HTTP
    HTTP --> AUTH_INT
    HTTP --> ERROR_INT
    
    AUTH_GUARD -.->|Protects| ROUTER
    AUTH_SVC -.->|Token| AUTH_INT
    
    GENERIC --> FORMS_MODULE
    API_SVC & AUTH_SVC & FORM_SVC --> UI_LIB
    API_SVC & AUTH_SVC --> UTILS

    style ANGULAR fill:#dd0031,color:#fff
    style GENERIC fill:#6366f1,color:#fff
    style AUTH_SVC fill:#8b5cf6,color:#fff
    style API_SVC fill:#10b981,color:#fff
```

---

## 🗂️ Frontend Directory Structure

```mermaid
graph TD
    ROOT[frontend/]
    
    ROOT --> APPS[apps/]
    ROOT --> LIBS[libs/]
    ROOT --> CONFIG[Config Files]
    
    APPS --> PORTAL[portal/]
    PORTAL --> SRC[src/]
    
    SRC --> APP[app/]
    APP --> AUTH[auth/<br/>Login & Signup]
    APP --> FORMS[forms/<br/>62 Form Components]
    APP --> CORE[core/<br/>Services, Guards, Interceptors]
    APP --> SHARED[shared/<br/>UI Components]
    
    FORMS --> GENERIC_FORM[generic-form/<br/>Universal Component]
    FORMS --> FORMS_LIST[forms-list/<br/>Directory]
    FORMS --> INDIVIDUAL[Individual Forms<br/>adt1/, ben2/, pas3/, dpt3/]
    
    LIBS --> DATA_ACCESS[data-access/<br/>API Services]
    LIBS --> UI[ui/<br/>Shared Components]
    
    CONFIG --> ANGULAR_JSON[angular.json]
    CONFIG --> NX_JSON[nx.json]
    CONFIG --> TSCONFIG[tsconfig.json]
    CONFIG --> PACKAGE[package.json]

    style ROOT fill:#dd0031,color:#fff
    style APP fill:#6366f1,color:#fff
    style FORMS fill:#8b5cf6,color:#fff
    style LIBS fill:#10b981,color:#fff
```

---

## 🔄 Component Communication

```mermaid
graph LR
    subgraph "Components"
        FORM[Form Component]
        LIST[Forms List]
    end

    subgraph "Services"
        API[API Service]
        AUTH[Auth Service]
        STATE[State Service]
    end

    subgraph "Backend"
        BACKEND[FastAPI Backend]
    end

    FORM -->|Uses| API
    FORM -->|Uses| AUTH
    LIST -->|Uses| API
    
    API -->|HTTP Calls| BACKEND
    AUTH -->|Token Management| API
    STATE -.->|Shares Data| FORM
    STATE -.->|Shares Data| LIST

    style FORM fill:#6366f1,color:#fff
    style API fill:#8b5cf6,color:#fff
    style BACKEND fill:#10b981,color:#fff
```

---

## 📋 Form Configuration System

```mermaid
graph TB
    CONFIG[all-forms.config.ts<br/>51 Form Configurations]
    
    subgraph "Form Configuration"
        META[Form Metadata<br/>code, title, description]
        FIELDS[Field Definitions<br/>name, type, validation]
        API_PATH[API Endpoints<br/>apiEndpoint]
    end

    GENERIC[Generic Form Component]
    DYNAMIC_FORM[Dynamic Form Builder]
    VALIDATORS[Validation Engine]
    RENDERER[Template Renderer]

    CONFIG --> META
    CONFIG --> FIELDS
    CONFIG --> API_PATH
    
    GENERIC -->|Load Config| CONFIG
    GENERIC --> DYNAMIC_FORM
    DYNAMIC_FORM --> VALIDATORS
    DYNAMIC_FORM --> RENDERER
    
    FIELDS --> VALIDATORS
    META --> RENDERER

    style CONFIG fill:#6366f1,color:#fff
    style GENERIC fill:#8b5cf6,color:#fff
    style DYNAMIC_FORM fill:#10b981,color:#fff
```

---

## 🎯 Routing Architecture

```mermaid
graph TB
    ROOT_ROUTE[/ - App Root]
    
    subgraph "Main Routes"
        FORMS_ROOT[/forms - Forms Directory]
        LOGIN[/forms/login - Login]
        SIGNUP[/forms/signup - Signup]
    end

    subgraph "Phase 1&2 Forms - Individual Components"
        ADT1[/forms/adt1]
        BEN2[/forms/ben2]
        PAS3[/forms/pas3]
        DPT3[/forms/dpt3]
        AOC4[/forms/aoc4]
        MORE_P12[... 6 more]
    end

    subgraph "Phase 3+ Forms - Generic Component"
        DIR3[/forms/dir3]
        CHG1[/forms/chg1]
        MGT14[/forms/mgt14]
        INC4[/forms/inc4]
        MORE_P3[... 47 more]
    end

    CATCH_ALL[/forms/:code - Dynamic]

    ROOT_ROUTE --> FORMS_ROOT
    ROOT_ROUTE --> LOGIN
    ROOT_ROUTE --> SIGNUP
    
    FORMS_ROOT --> ADT1 & BEN2 & PAS3 & DPT3 & AOC4 & MORE_P12
    FORMS_ROOT --> DIR3 & CHG1 & MGT14 & INC4 & MORE_P3
    FORMS_ROOT --> CATCH_ALL

    style FORMS_ROOT fill:#6366f1,color:#fff
    style LOGIN fill:#8b5cf6,color:#fff
    style CATCH_ALL fill:#10b981,color:#fff
```

---

## 🔐 State Management

```mermaid
graph TB
    subgraph "Application State"
        AUTH_STATE[Auth State<br/>User, Token]
        FORM_STATE[Form State<br/>Draft, Submitted]
        UI_STATE[UI State<br/>Loading, Errors]
    end

    subgraph "Storage"
        LOCAL[LocalStorage<br/>Persistent]
        SESSION[SessionStorage<br/>Temporary]
        MEMORY[In-Memory<br/>Current Session]
    end

    subgraph "Services"
        AUTH_SVC[Auth Service]
        FORM_SVC[Form Service]
    end

    AUTH_SVC -->|Manages| AUTH_STATE
    FORM_SVC -->|Manages| FORM_STATE
    
    AUTH_STATE -->|Persist| LOCAL
    FORM_STATE -->|Cache| SESSION
    UI_STATE -->|Runtime| MEMORY

    style AUTH_STATE fill:#6366f1,color:#fff
    style FORM_STATE fill:#8b5cf6,color:#fff
    style LOCAL fill:#10b981,color:#fff
```

---

## ✅ Frontend Features

| Feature | Implementation | Status |
|---------|----------------|--------|
| **Routing** | Angular Router (65 routes) | ✅ |
| **Forms** | Reactive Forms (62 forms) | ✅ |
| **Auth** | Login + Signup components | ✅ |
| **Validation** | Client-side validation | ✅ |
| **Responsive** | Mobile/Tablet/Desktop | ✅ |
| **Lazy Loading** | Route-based code splitting | ✅ |
| **Type Safety** | TypeScript strict mode | ✅ |
| **Accessibility** | WCAG AA compliant | ✅ |

---

**Version:** 1.0  
**Framework:** Angular 17  
**Build Tool:** NX 18  
**Status:** ✅ Production Ready

