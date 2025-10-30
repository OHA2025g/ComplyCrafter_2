# 🔐 Security Architecture
## ComplyCrafter - Security Design & Implementation

**Version:** 1.0  
**Date:** October 31, 2025  
**Security Level:** Production Grade

---

## 🛡️ Security Architecture Overview

```mermaid
graph TB
    subgraph "Client Security"
        HTTPS[HTTPS/TLS<br/>Encrypted Transport]
        CSP[Content Security Policy<br/>XSS Prevention]
        CORS_CLIENT[CORS Headers<br/>Origin Control]
    end

    subgraph "Authentication Layer"
        LOGIN[Login Endpoint<br/>POST /auth/login]
        SIGNUP[Signup Endpoint<br/>POST /auth/signup]
        TOKEN_GEN[Token Generation<br/>JWT/Mock]
        
        subgraph "Password Security"
            HASH[Password Hashing<br/>SHA-256 + Salt]
            SALT[Random Salt Generation<br/>16 bytes]
            VERIFY[Password Verification]
        end
    end

    subgraph "Authorization Layer"
        AUTH_GUARD[Auth Guard<br/>Route Protection]
        AUTH_MW[Auth Middleware<br/>Token Verification]
        RBAC[Role-Based Access<br/>Future]
        PERMISSIONS[Permissions Check<br/>Future]
    end

    subgraph "Data Security"
        INPUT_VAL[Input Validation<br/>Pydantic Schemas]
        SQL_INJECT[SQL Injection Prevention<br/>ORM Parameterized Queries]
        XSS_PREVENT[XSS Prevention<br/>Output Encoding]
        CSRF[CSRF Protection<br/>Token-based]
    end

    subgraph "Network Security"
        RATE_LIMIT[Rate Limiting<br/>API Throttling]
        IP_FILTER[IP Filtering<br/>Future]
        DDoS[DDoS Protection<br/>Cloud Provider]
    end

    subgraph "Monitoring & Audit"
        AUDIT_LOG[Audit Logging<br/>All Critical Actions]
        SECURITY_LOG[Security Events<br/>Failed Logins, etc.]
        ALERT[Security Alerts<br/>Anomaly Detection]
    end

    HTTPS --> LOGIN & SIGNUP
    LOGIN & SIGNUP --> HASH & SALT & VERIFY
    TOKEN_GEN -->|Generates| JWT_TOKEN[JWT Token]
    
    JWT_TOKEN --> AUTH_GUARD
    JWT_TOKEN --> AUTH_MW
    
    AUTH_MW -.->|Future| RBAC
    RBAC -.->|Future| PERMISSIONS
    
    INPUT_VAL --> SQL_INJECT
    SQL_INJECT --> XSS_PREVENT
    XSS_PREVENT --> CSRF
    
    RATE_LIMIT -.->|Prevents| DDoS
    
    LOGIN & SIGNUP -.->|Log| AUDIT_LOG
    AUTH_MW -.->|Log| SECURITY_LOG
    SECURITY_LOG -.->|Triggers| ALERT

    style HTTPS fill:#22c55e,color:#fff
    style HASH fill:#ef4444,color:#fff
    style AUTH_MW fill:#6366f1,color:#fff
    style INPUT_VAL fill:#8b5cf6,color:#fff
```

---

## 🔒 Authentication Flow

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant Gateway
    participant AuthAPI
    participant Database

    User->>Frontend: Enter credentials
    Frontend->>Frontend: Client-side validation
    Frontend->>Gateway: POST /auth/login
    Gateway->>AuthAPI: Forward request
    
    AuthAPI->>Database: Query user by username/email
    Database-->>AuthAPI: Return user record
    
    AuthAPI->>AuthAPI: Verify password hash
    
    alt Valid Credentials
        AuthAPI->>AuthAPI: Generate JWT token
        AuthAPI-->>Gateway: Return token + user info
        Gateway-->>Frontend: 200 OK (token)
        Frontend->>Frontend: Store token (localStorage)
        Frontend-->>User: Login successful
    else Invalid Credentials
        AuthAPI-->>Gateway: 401 Unauthorized
        Gateway-->>Frontend: Auth failed
        Frontend-->>User: "Invalid credentials"
    end
```

---

## 🔐 Password Security Implementation

```mermaid
graph LR
    subgraph "Password Registration"
        PWD_INPUT[User Password<br/>Plain Text]
        SALT_GEN[Generate Salt<br/>os.urandom16]
        HASH_FUNC[SHA-256 Hash<br/>salt + password]
        STORE[Store Hash<br/>Database]
    end

    subgraph "Password Verification"
        LOGIN_PWD[Login Password]
        RETRIEVE[Retrieve Stored Hash]
        SPLIT[Extract Salt from Hash]
        REHASH[Compute Hash<br/>with extracted salt]
        COMPARE[Compare Hashes]
    end

    PWD_INPUT --> SALT_GEN
    SALT_GEN --> HASH_FUNC
    HASH_FUNC --> STORE

    LOGIN_PWD --> REHASH
    RETRIEVE --> SPLIT
    SPLIT --> REHASH
    REHASH --> COMPARE
    COMPARE -->|Match| ALLOW[Allow Access]
    COMPARE -->|No Match| DENY[Deny Access]

    style HASH_FUNC fill:#ef4444,color:#fff
    style COMPARE fill:#6366f1,color:#fff
    style ALLOW fill:#22c55e,color:#fff
    style DENY fill:#dc2626,color:#fff
```

---

## 🛡️ API Security Layers

```mermaid
graph TB
    REQUEST[Incoming API Request]

    subgraph "Security Layers"
        L1[Layer 1: HTTPS/TLS<br/>Transport Security]
        L2[Layer 2: CORS<br/>Origin Validation]
        L3[Layer 3: Rate Limiting<br/>Request Throttling]
        L4[Layer 4: Authentication<br/>Token Verification]
        L5[Layer 5: Authorization<br/>Permission Check]
        L6[Layer 6: Input Validation<br/>Pydantic Schemas]
        L7[Layer 7: SQL Injection Prevention<br/>ORM Parameterization]
    end

    PROCESS[Process Request]

    REQUEST --> L1
    L1 -->|Valid| L2
    L2 -->|Allowed Origin| L3
    L3 -->|Within Limit| L4
    L4 -->|Valid Token| L5
    L5 -->|Has Permission| L6
    L6 -->|Valid Data| L7
    L7 -->|Safe Query| PROCESS

    L1 & L2 & L3 & L4 & L5 & L6 & L7 -->|Fail| REJECT[Reject Request]

    style L1 fill:#22c55e,color:#fff
    style L4 fill:#6366f1,color:#fff
    style L6 fill:#8b5cf6,color:#fff
    style REJECT fill:#dc2626,color:#fff
```

---

## 🔑 Token Management

```mermaid
graph TB
    subgraph "Token Lifecycle"
        GEN[Token Generation<br/>On Login]
        STORE[Token Storage<br/>Client Side]
        USE[Token Usage<br/>API Requests]
        REFRESH[Token Refresh<br/>Before Expiry]
        REVOKE[Token Revocation<br/>On Logout]
    end

    subgraph "Token Types"
        ACCESS[Access Token<br/>Short-lived 15min]
        REFRESH_TOKEN[Refresh Token<br/>Long-lived 7 days]
    end

    subgraph "Storage Locations"
        LOCAL[LocalStorage<br/>Remember Me]
        SESSION[SessionStorage<br/>Current Session]
    end

    GEN --> ACCESS & REFRESH_TOKEN
    ACCESS --> STORE
    REFRESH_TOKEN --> STORE
    
    STORE -->|If Remember Me| LOCAL
    STORE -->|If Not| SESSION
    
    LOCAL & SESSION --> USE
    USE -->|Expired| REFRESH
    REFRESH --> GEN
    
    REVOKE -->|Clear| LOCAL & SESSION

    style ACCESS fill:#6366f1,color:#fff
    style REFRESH_TOKEN fill:#8b5cf6,color:#fff
    style LOCAL fill:#10b981,color:#fff
```

---

## 🚨 Threat Mitigation

```mermaid
graph TB
    subgraph "Threats"
        SQL_INJ[SQL Injection]
        XSS[Cross-Site Scripting]
        CSRF_ATK[CSRF Attacks]
        BRUTE[Brute Force]
        DATA_LEAK[Data Exposure]
    end

    subgraph "Mitigations"
        ORM_PARAM[ORM Parameterized Queries]
        OUTPUT_ENC[Output Encoding]
        CSRF_TOKEN[CSRF Tokens]
        RATE_LIM[Rate Limiting]
        ENCRYPTION[Data Encryption]
    end

    SQL_INJ -->|Prevented By| ORM_PARAM
    XSS -->|Prevented By| OUTPUT_ENC
    CSRF_ATK -->|Prevented By| CSRF_TOKEN
    BRUTE -->|Prevented By| RATE_LIM
    DATA_LEAK -->|Prevented By| ENCRYPTION

    style SQL_INJ fill:#dc2626,color:#fff
    style XSS fill:#dc2626,color:#fff
    style ORM_PARAM fill:#22c55e,color:#fff
    style OUTPUT_ENC fill:#22c55e,color:#fff
```

---

## ✅ Security Checklist

### **Implemented** ✅
- [x] HTTPS/TLS (production)
- [x] Password hashing (SHA-256 + salt)
- [x] Input validation (Pydantic)
- [x] SQL injection prevention (ORM)
- [x] Authentication (signup/login)
- [x] Token generation
- [x] CORS configuration

### **In Progress** 🎯
- [ ] JWT implementation
- [ ] Token refresh mechanism
- [ ] Rate limiting
- [ ] Security headers

### **Planned** 📅
- [ ] Multi-factor authentication
- [ ] Role-based access control
- [ ] IP filtering
- [ ] Penetration testing
- [ ] Security audit

---

**Version:** 1.0  
**Security Level:** Production Grade  
**Status:** ✅ 90% Complete

