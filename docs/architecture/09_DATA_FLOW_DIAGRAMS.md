# 🔄 Data Flow Diagrams
## ComplyCrafter - Complete Data Flow Scenarios

**Version:** 1.0  
**Date:** October 31, 2025  
**Flows:** All Critical User Journeys

---

## 📋 Form Submission Flow (End-to-End)

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant Angular
    participant Gateway
    participant FormsAPI
    participant Database

    Note over User,Database: Complete Form Submission Journey

    User->>Browser: Navigate to /forms
    Browser->>Angular: Load Forms List Component
    Angular->>Gateway: GET /forms/adt1 (get existing)
    Gateway->>FormsAPI: Forward request
    FormsAPI->>Database: SELECT * FROM adt1_submissions
    Database-->>FormsAPI: Return records []
    FormsAPI-->>Gateway: Return JSON
    Gateway-->>Angular: Form data
    Angular-->>Browser: Render Form UI
    
    User->>Browser: Fill form fields
    User->>Browser: Click Submit
    
    Browser->>Angular: Form submit event
    Angular->>Angular: Validate form (client-side)
    
    alt Form Valid
        Angular->>Gateway: POST /forms/adt1 {data}
        Gateway->>Gateway: Rate limit check
        Gateway->>Gateway: Auth check (mock)
        Gateway->>FormsAPI: Forward request
        
        FormsAPI->>FormsAPI: Validate with Pydantic
        FormsAPI->>FormsAPI: Call ADT1Service.create()
        FormsAPI->>Database: INSERT INTO adt1_submissions
        Database-->>FormsAPI: Return ID: 5
        FormsAPI->>Database: SELECT * WHERE id=5
        Database-->>FormsAPI: Full record
        
        FormsAPI-->>Gateway: 201 Created {id:5, ...}
        Gateway-->>Angular: Success response
        Angular-->>Browser: Show success message
        Browser-->>User: "Form submitted successfully! (ID: 5)"
    else Form Invalid
        Angular-->>Browser: Show validation errors
        Browser-->>User: "Please fix errors"
    end
```

---

## 🔐 User Signup Flow

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant AuthAPI
    participant AuthService
    participant Database

    User->>Frontend: Navigate to /forms/signup
    Frontend->>Frontend: Render signup form
    
    User->>Frontend: Enter username, email, password
    User->>Frontend: Click "Create account"
    
    Frontend->>Frontend: Client validation
    
    alt Valid Input
        Frontend->>AuthAPI: POST /auth/signup
        AuthAPI->>AuthAPI: Validate with Pydantic
        AuthAPI->>AuthService: create_user(username, email, password)
        
        AuthService->>Database: Check if user exists
        Database-->>AuthService: No existing user
        
        AuthService->>AuthService: Generate salt (16 bytes)
        AuthService->>AuthService: Hash password (SHA-256)
        AuthService->>Database: INSERT INTO user_accounts
        Database-->>AuthService: Return user ID: 1
        
        AuthService->>Database: SELECT user WHERE id=1
        Database-->>AuthService: Full user record
        AuthService-->>AuthAPI: Return user
        
        AuthAPI-->>Frontend: 201 Created {id, username, email}
        Frontend-->>User: "Account created! Redirecting..."
        Frontend->>Frontend: Redirect to /forms
    else Validation Error
        Frontend-->>User: Show validation errors
    else User Exists
        AuthAPI-->>Frontend: 400 "Username or email already exists"
        Frontend-->>User: Show error message
    end
```

---

## 🔓 User Login Flow

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant AuthAPI
    participant AuthService
    participant Database

    User->>Frontend: Navigate to /forms/login
    Frontend->>Frontend: Render login form
    
    User->>Frontend: Enter username, password
    User->>Frontend: Click "Sign in"
    
    Frontend->>AuthAPI: POST /auth/login {username, password}
    AuthAPI->>AuthService: verify_user(username, password)
    
    AuthService->>Database: SELECT * FROM user_accounts WHERE username = ?
    Database-->>AuthService: Return user record
    
    AuthService->>AuthService: Extract salt from password_hash
    AuthService->>AuthService: Hash input password with salt
    AuthService->>AuthService: Compare hashes
    
    alt Passwords Match
        AuthService-->>AuthAPI: Return user object
        AuthAPI->>AuthAPI: Generate access token
        AuthAPI-->>Frontend: 200 OK {access_token, user}
        Frontend->>Frontend: Store token (localStorage/sessionStorage)
        Frontend-->>User: "Login successful!"
        Frontend->>Frontend: Redirect to /forms
    else Passwords Don't Match
        AuthService-->>AuthAPI: Return None
        AuthAPI-->>Frontend: 401 Unauthorized
        Frontend-->>User: "Invalid username or password"
    end
```

---

## 📝 Generic Form Submission Flow (Phase 3+)

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant GenericComponent
    participant FormConfig
    participant API
    participant Database

    User->>Browser: Navigate to /forms/dir3
    Browser->>GenericComponent: Load component
    GenericComponent->>FormConfig: getFormConfig('dir3')
    FormConfig-->>GenericComponent: Return DIR3 config + fields
    
    GenericComponent->>GenericComponent: buildForm() from config
    GenericComponent-->>Browser: Render dynamic form
    
    User->>Browser: Fill fields
    User->>Browser: Submit
    
    Browser->>GenericComponent: Form submit event
    GenericComponent->>GenericComponent: Validate
    
    alt Valid
        GenericComponent->>API: POST /forms/dir3 {data}
        API->>Database: INSERT INTO tbl_dir3
        Database-->>API: Return ID
        API-->>GenericComponent: Success
        GenericComponent-->>Browser: Show success
        Browser-->>User: "Submitted!"
    else Invalid
        GenericComponent-->>Browser: Show errors
        Browser-->>User: "Fix errors"
    end
```

---

## 🔍 Data Retrieval Flow

```mermaid
graph LR
    USER[User Request<br/>GET /forms/adt1]
    
    subgraph "Frontend"
        COMPONENT[Form Component]
        HTTP[HTTP Client]
    end

    subgraph "Backend"
        ROUTER[Route Handler<br/>/forms/adt1]
        SERVICE[ADT1 Service<br/>get_all_adt1]
        ORM[SQLAlchemy<br/>select query]
    end

    subgraph "Database"
        QUERY[SELECT * FROM<br/>adt1_submissions]
        INDEX[Use Primary Key Index]
        RESULT[Return Rows]
    end

    USER --> COMPONENT
    COMPONENT --> HTTP
    HTTP --> ROUTER
    ROUTER --> SERVICE
    SERVICE --> ORM
    ORM --> QUERY
    QUERY --> INDEX
    INDEX --> RESULT
    RESULT -->|JSON| ORM
    ORM -->|Models| SERVICE
    SERVICE -->|Pydantic| ROUTER
    ROUTER -->|JSON| HTTP
    HTTP -->|Observable| COMPONENT
    COMPONENT -->|Display| USER

    style COMPONENT fill:#6366f1,color:#fff
    style SERVICE fill:#8b5cf6,color:#fff
    style QUERY fill:#336791,color:#fff
```

---

## 🔄 Data Update Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Service
    participant Database

    User->>Frontend: Edit form (ID: 5)
    Frontend->>API: GET /forms/adt1/5
    API->>Service: get_adt1_by_id(5)
    Service->>Database: SELECT WHERE id=5
    Database-->>Service: Return record
    Service-->>API: Return model
    API-->>Frontend: JSON data
    Frontend-->>User: Display populated form
    
    User->>Frontend: Modify fields
    User->>Frontend: Save changes
    
    Frontend->>API: PUT /forms/adt1/5 {updated_data}
    API->>Service: update_adt1(5, data)
    Service->>Database: UPDATE adt1_submissions SET ... WHERE id=5
    Database-->>Service: Update successful
    Service->>Database: SELECT WHERE id=5
    Database-->>Service: Return updated record
    Service-->>API: Return model
    API-->>Frontend: 200 OK
    Frontend-->>User: "Updated successfully!"
```

---

## 🗑️ Data Deletion Flow (Soft Delete)

```mermaid
graph TB
    REQUEST[DELETE Request<br/>DELETE /forms/adt1/5]

    subgraph "Soft Delete Process"
        ROUTE[Route Handler]
        SERVICE[Service Layer]
        CHECK[Check Record Exists]
        UPDATE[UPDATE is_active = FALSE]
        LOG[Log Deletion]
    end

    subgraph "Database"
        QUERY[UPDATE adt1_submissions<br/>SET is_active = FALSE<br/>WHERE id = 5]
        RECORD[(Record ID:5<br/>is_active: FALSE)]
    end

    RESPONSE[Response<br/>204 No Content]

    REQUEST --> ROUTE
    ROUTE --> SERVICE
    SERVICE --> CHECK
    CHECK -->|Exists| UPDATE
    CHECK -->|Not Found| NOT_FOUND[404 Not Found]
    UPDATE --> LOG
    LOG --> QUERY
    QUERY --> RECORD
    RECORD --> RESPONSE

    style UPDATE fill:#f59e0b,color:#fff
    style RECORD fill:#94a3b8,color:#fff
    style RESPONSE fill:#22c55e,color:#fff
```

---

## 🔎 Search/Filter Flow

```mermaid
graph LR
    USER[User<br/>Search Forms]

    subgraph "Frontend"
        SEARCH_INPUT[Search Input<br/>Filter Form]
        FILTER[Apply Filters<br/>Category, Search Term]
    end

    subgraph "Backend"
        API[API Endpoint<br/>GET /forms/adt1?search=...&filter=...]
        SERVICE[Service Layer<br/>Build Query]
        WHERE[WHERE Clauses<br/>SQL Filters]
    end

    subgraph "Database"
        QUERY[SELECT with WHERE]
        FILTER_DB[Filter Results]
        PAGINATE[LIMIT/OFFSET]
    end

    USER --> SEARCH_INPUT
    SEARCH_INPUT --> FILTER
    FILTER --> API
    API --> SERVICE
    SERVICE --> WHERE
    WHERE --> QUERY
    QUERY --> FILTER_DB
    FILTER_DB --> PAGINATE
    PAGINATE -->|Results| USER

    style SEARCH_INPUT fill:#6366f1,color:#fff
    style SERVICE fill:#8b5cf6,color:#fff
    style QUERY fill:#336791,color:#fff
```

---

## 📊 Analytics Data Flow (Future)

```mermaid
graph TB
    subgraph "Data Sources"
        FORMS[Form Submissions]
        USERS[User Actions]
        API_CALLS[API Requests]
    end

    subgraph "ETL Pipeline"
        EXTRACT[Extract Data<br/>Nightly Job]
        TRANSFORM[Transform<br/>Aggregate & Calculate]
        LOAD[Load<br/>To Analytics DB]
    end

    subgraph "Analytics"
        DW[(Data Warehouse<br/>Analytics DB)]
        BI[BI Tool<br/>Metabase/Superset]
        DASHBOARD[Analytics Dashboard]
    end

    FORMS & USERS & API_CALLS --> EXTRACT
    EXTRACT --> TRANSFORM
    TRANSFORM --> LOAD
    LOAD --> DW
    DW --> BI
    BI --> DASHBOARD

    style EXTRACT fill:#6366f1,color:#fff
    style DW fill:#336791,color:#fff
    style DASHBOARD fill:#10b981,color:#fff
```

---

## 🔔 Notification Data Flow (Future)

```mermaid
graph LR
    subgraph "Trigger Events"
        EVENT1[Form Submitted]
        EVENT2[Form Approved]
        EVENT3[Deadline Approaching]
    end

    subgraph "Event Processing"
        QUEUE[Message Queue]
        WORKER[Worker Process]
    end

    subgraph "Notification Channels"
        EMAIL[Email<br/>SendGrid]
        SMS[SMS<br/>MSG91]
        PUSH[Push Notification<br/>Firebase]
        IN_APP[In-App Notification]
    end

    EVENT1 & EVENT2 & EVENT3 --> QUEUE
    QUEUE --> WORKER
    WORKER --> EMAIL & SMS & PUSH & IN_APP

    style QUEUE fill:#f59e0b,color:#fff
    style WORKER fill:#6366f1,color:#fff
    style EMAIL fill:#10b981,color:#fff
```

---

## ✅ Data Flow Summary

| Flow Type | Complexity | Status |
|-----------|------------|--------|
| **Form Submission** | Medium | ✅ Complete |
| **User Signup** | Low | ✅ Complete |
| **User Login** | Low | ✅ Complete |
| **Data Retrieval** | Low | ✅ Complete |
| **Data Update** | Medium | ✅ Complete |
| **Soft Delete** | Low | ✅ Complete |
| **Search/Filter** | Medium | 🎯 Planned |
| **Analytics** | High | 🎯 Future |
| **Notifications** | Medium | 🎯 Future |

---

**Version:** 1.0  
**Flows Documented:** 9  
**Status:** ✅ Complete

