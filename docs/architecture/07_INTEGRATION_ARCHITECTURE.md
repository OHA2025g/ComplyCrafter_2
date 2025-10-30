# 🔗 Integration Architecture
## ComplyCrafter - External System Integrations

**Version:** 1.0  
**Date:** October 31, 2025  
**Integrations:** Current + Planned

---

## 🌐 Integration Overview

```mermaid
graph TB
    subgraph "ComplyCrafter Platform"
        FRONTEND[Angular Frontend]
        BACKEND[FastAPI Backend]
        DATABASE[(PostgreSQL Database)]
    end

    subgraph "External Integrations"
        subgraph "Authentication - Future"
            KEYCLOAK[Keycloak SSO<br/>OAuth 2.0/OIDC]
            GOOGLE_AUTH[Google OAuth]
            MS_AUTH[Microsoft OAuth]
        end

        subgraph "Government Systems - Future"
            MCA[MCA Portal<br/>Ministry of Corporate Affairs]
            GSTN[GSTN Portal<br/>GST Network]
        end

        subgraph "Payment Integration - Future"
            RAZORPAY[Razorpay<br/>Payment Gateway]
            STRIPE[Stripe<br/>International Payments]
        end

        subgraph "Messaging - Future"
            MSG91[MSG91<br/>SMS Gateway]
            SENDGRID[SendGrid<br/>Email Service]
        end

        subgraph "Digital Signature - Future"
            EMUDHRA[eMudhra<br/>Digital Signature]
            NSDL[NSDL e-Sign<br/>Digital Signature]
        end

        subgraph "Document Management - Future"
            AWS_S3[AWS S3<br/>File Storage]
            AZURE_BLOB[Azure Blob<br/>File Storage]
        end
    end

    FRONTEND -->|REST API| BACKEND
    BACKEND --> DATABASE
    
    BACKEND -.->|OAuth 2.0| KEYCLOAK
    KEYCLOAK -.->|Federate| GOOGLE_AUTH & MS_AUTH
    
    BACKEND -.->|API Integration| MCA
    BACKEND -.->|API Integration| GSTN
    
    BACKEND -.->|Payment API| RAZORPAY
    BACKEND -.->|Payment API| STRIPE
    
    BACKEND -.->|SMS API| MSG91
    BACKEND -.->|Email API| SENDGRID
    
    BACKEND -.->|Signature API| EMUDHRA
    BACKEND -.->|Signature API| NSDL
    
    BACKEND -.->|S3 SDK| AWS_S3
    BACKEND -.->|Blob SDK| AZURE_BLOB

    style BACKEND fill:#8b5cf6,color:#fff
    style KEYCLOAK fill:#ef4444,color:#fff
    style MCA fill:#6366f1,color:#fff
    style RAZORPAY fill:#0c4a6e,color:#fff
```

---

## 🔐 Keycloak SSO Integration (Planned)

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant Keycloak
    participant Backend
    participant Database

    User->>Frontend: Click "Login"
    Frontend->>Keycloak: Redirect to Keycloak
    Keycloak->>User: Show login page
    User->>Keycloak: Enter credentials
    
    alt Valid Credentials
        Keycloak->>Keycloak: Authenticate user
        Keycloak-->>Frontend: Redirect with code
        Frontend->>Keycloak: Exchange code for token
        Keycloak-->>Frontend: JWT Access Token
        
        Frontend->>Backend: API call with JWT
        Backend->>Keycloak: Verify token
        Keycloak-->>Backend: Token valid + user info
        Backend->>Database: Get/Create user
        Database-->>Backend: User data
        Backend-->>Frontend: Protected resource
        Frontend-->>User: Show content
    else Invalid Credentials
        Keycloak-->>User: Login failed
    end
```

---

## 💳 Payment Integration Flow (Planned)

```mermaid
graph LR
    subgraph "User Action"
        USER[User<br/>Select Plan]
    end

    subgraph "ComplyCrafter"
        FRONTEND[Frontend<br/>Payment Page]
        BACKEND[Backend<br/>Payment Service]
        DB[(Database<br/>Orders)]
    end

    subgraph "Razorpay"
        RAZORPAY_API[Razorpay API<br/>Create Order]
        PAYMENT_PAGE[Payment Page<br/>Checkout]
        WEBHOOK[Webhook<br/>Payment Status]
    end

    USER --> FRONTEND
    FRONTEND --> BACKEND
    BACKEND --> RAZORPAY_API
    RAZORPAY_API --> DB
    RAZORPAY_API --> PAYMENT_PAGE
    
    PAYMENT_PAGE -->|Success| WEBHOOK
    WEBHOOK --> BACKEND
    BACKEND --> DB

    style FRONTEND fill:#6366f1,color:#fff
    style RAZORPAY_API fill:#0c4a6e,color:#fff
    style WEBHOOK fill:#10b981,color:#fff
```

---

## 📧 Email/SMS Integration (Planned)

```mermaid
graph TB
    subgraph "Trigger Events"
        SIGNUP[User Signup]
        SUBMISSION[Form Submission]
        APPROVAL[Form Approval]
        REMINDER[Deadline Reminder]
    end

    subgraph "Message Queue"
        QUEUE[Message Queue<br/>RabbitMQ/Redis]
    end

    subgraph "Notification Service"
        EMAIL_SVC[Email Service]
        SMS_SVC[SMS Service]
    end

    subgraph "External Providers"
        SENDGRID[SendGrid<br/>Email Delivery]
        MSG91[MSG91<br/>SMS Delivery]
    end

    SIGNUP & SUBMISSION & APPROVAL & REMINDER --> QUEUE
    QUEUE --> EMAIL_SVC & SMS_SVC
    
    EMAIL_SVC --> SENDGRID
    SMS_SVC --> MSG91
    
    SENDGRID & MSG91 -.->|Delivery Status| QUEUE

    style QUEUE fill:#f59e0b,color:#fff
    style EMAIL_SVC fill:#6366f1,color:#fff
    style SENDGRID fill:#10b981,color:#fff
```

---

## 📄 Document Integration (Planned)

```mermaid
graph LR
    subgraph "Document Upload"
        USER[User Upload<br/>Form Attachments]
        FRONTEND[Frontend<br/>File Input]
    end

    subgraph "ComplyCrafter"
        BACKEND[Backend API<br/>File Handler]
        DB[(Database<br/>File Metadata)]
    end

    subgraph "Storage"
        S3[AWS S3<br/>Object Storage]
        CDN[CloudFront CDN<br/>Fast Delivery]
    end

    subgraph "Processing"
        SCAN[Virus Scan<br/>ClamAV]
        THUMBNAIL[Thumbnail Generation<br/>Images]
        OCR[OCR Processing<br/>Tesseract]
    end

    USER --> FRONTEND
    FRONTEND --> BACKEND
    BACKEND --> SCAN
    SCAN -->|Clean| S3
    S3 --> DB
    S3 --> CDN
    
    S3 -.->|Process| THUMBNAIL
    S3 -.->|Process| OCR

    style S3 fill:#f59e0b,color:#fff
    style SCAN fill:#ef4444,color:#fff
    style CDN fill:#10b981,color:#fff
```

---

## 🔌 API Integration Patterns

```mermaid
graph TB
    subgraph "Integration Patterns"
        REST[REST APIs<br/>HTTP/JSON]
        WEBHOOK[Webhooks<br/>Event-driven]
        QUEUE[Message Queues<br/>Async Processing]
        SDK[SDK Integration<br/>Third-party Libraries]
    end

    subgraph "Use Cases"
        REST_USE[Real-time Data<br/>Synchronous]
        WEBHOOK_USE[Event Notifications<br/>Asynchronous]
        QUEUE_USE[Background Jobs<br/>Deferred]
        SDK_USE[Service Integration<br/>Abstracted]
    end

    REST --> REST_USE
    WEBHOOK --> WEBHOOK_USE
    QUEUE --> QUEUE_USE
    SDK --> SDK_USE

    REST_USE -->|Example| MCA_INT[MCA Portal Integration]
    WEBHOOK_USE -->|Example| PAYMENT_INT[Payment Confirmations]
    QUEUE_USE -->|Example| EMAIL_INT[Email Sending]
    SDK_USE -->|Example| STORAGE_INT[File Storage]

    style REST fill:#6366f1,color:#fff
    style WEBHOOK fill:#8b5cf6,color:#fff
    style QUEUE fill:#f59e0b,color:#fff
    style SDK fill:#10b981,color:#fff
```

---

## 🔄 Integration Error Handling

```mermaid
graph TB
    REQUEST[API Request to External Service]

    subgraph "Error Handling Strategy"
        RETRY[Retry Logic<br/>3 attempts with backoff]
        FALLBACK[Fallback Mechanism<br/>Cached/Default Response]
        CIRCUIT[Circuit Breaker<br/>Fail Fast if Service Down]
        LOG[Error Logging<br/>Track Failures]
        ALERT[Alert Team<br/>Critical Failures]
    end

    SUCCESS[Success Response]
    FAILURE[Permanent Failure]

    REQUEST --> RETRY
    RETRY -->|Attempt 1| FAIL1[Fail]
    RETRY -->|Attempt 2| FAIL2[Fail]
    RETRY -->|Attempt 3| FAIL3[Fail]
    RETRY -->|Success| SUCCESS
    
    FAIL1 & FAIL2 --> RETRY
    FAIL3 --> CIRCUIT
    CIRCUIT -->|Open| FALLBACK
    FALLBACK --> LOG
    LOG --> ALERT
    ALERT --> FAILURE

    style RETRY fill:#f59e0b,color:#fff
    style FALLBACK fill:#6366f1,color:#fff
    style SUCCESS fill:#22c55e,color:#fff
    style FAILURE fill:#dc2626,color:#fff
```

---

## ✅ Integration Status

| Integration | Type | Status | Priority |
|-------------|------|--------|----------|
| **Internal API** | REST | ✅ Complete | ✅ |
| **Keycloak SSO** | OAuth 2.0 | 🎯 Planned | High |
| **MCA Portal** | REST API | 🎯 Planned | High |
| **Razorpay** | Payment API | 🎯 Planned | Medium |
| **SendGrid** | Email API | 🎯 Planned | Medium |
| **MSG91** | SMS API | 🎯 Planned | Low |
| **Digital Signature** | API | 🎯 Planned | Medium |
| **File Storage** | S3 SDK | 🎯 Planned | Medium |

---

**Version:** 1.0  
**Current Integrations:** Internal only  
**Planned:** 7 external integrations  
**Status:** ✅ Ready for Integration Phase

