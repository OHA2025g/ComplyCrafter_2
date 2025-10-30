# 🗄️ Data Architecture
## ComplyCrafter - Database Design & Structure

**Version:** 1.0  
**Date:** October 31, 2025  
**Database:** PostgreSQL 15

---

## 📊 Data Architecture Overview

```mermaid
graph TB
    subgraph "Application Layer"
        APP[Application Services<br/>62 Form Services + Auth]
    end

    subgraph "ORM Layer"
        SQLALCHEMY[SQLAlchemy ORM<br/>Async Engine]
        MODELS[Database Models<br/>62 Form Models + User]
    end

    subgraph "Database Layer - PostgreSQL 15"
        subgraph "Form Tables - 62 tables"
            PHASE1[Phase 1&2 Tables<br/>Detailed Schemas]
            ADT1_TBL[(adt1_submissions<br/>29 columns)]
            BEN2_TBL[(ben2_submissions<br/>28 columns)]
            PAS3_TBL[(pas3_submissions<br/>48 columns)]
            DPT3_TBL[(dpt3_submissions<br/>56 columns)]
            
            PHASE3[Phase 3+ Tables<br/>Core Schemas]
            TBL_DIR3[(tbl_dir3)]
            TBL_CHG1[(tbl_chg1)]
            TBL_MGT14[(tbl_mgt14)]
            MORE_TBLS[(... 47 more tables)]
        end

        subgraph "Auth Tables"
            USER_TBL[(user_accounts<br/>7 columns)]
        end

        subgraph "JSON Tables"
            JSON_TBL[(json_submissions<br/>11 columns<br/>JSONB data)]
        end

        subgraph "Indexes"
            PK_IDX[Primary Key Indexes<br/>64 indexes]
            FK_IDX[Foreign Key Indexes<br/>Future]
            CUSTOM_IDX[Custom Indexes<br/>username, email]
        end
    end

    APP --> SQLALCHEMY
    SQLALCHEMY --> MODELS
    MODELS --> PHASE1 & PHASE3 & USER_TBL & JSON_TBL
    
    PHASE1 --> ADT1_TBL & BEN2_TBL & PAS3_TBL & DPT3_TBL
    PHASE3 --> TBL_DIR3 & TBL_CHG1 & TBL_MGT14 & MORE_TBLS
    
    ADT1_TBL & BEN2_TBL & USER_TBL -.->|Indexed By| PK_IDX
    USER_TBL -.->|Indexed By| CUSTOM_IDX

    style SQLALCHEMY fill:#10b981,color:#fff
    style ADT1_TBL fill:#336791,color:#fff
    style USER_TBL fill:#ef4444,color:#fff
    style JSON_TBL fill:#f59e0b,color:#fff
```

---

## 🗂️ Database Schema Layers

```mermaid
graph TB
    subgraph "Schema Organization"
        PUBLIC[public schema<br/>Default]
        
        subgraph "Table Categories"
            FORM_CAT[Form Submission Tables<br/>62 tables]
            AUTH_CAT[Authentication Tables<br/>1 table]
            JSON_CAT[JSON Submission Tables<br/>1 table]
            AUDIT_CAT[Audit Tables<br/>Future]
        end

        subgraph "Common Fields Pattern"
            ID[id - SERIAL PRIMARY KEY]
            TIMESTAMPS[created_at, updated_at<br/>TIMESTAMP]
            AUDIT[created_by, updated_by<br/>INTEGER]
            ACTIVE[is_active<br/>BOOLEAN]
        end
    end

    PUBLIC --> FORM_CAT & AUTH_CAT & JSON_CAT & AUDIT_CAT
    
    FORM_CAT --> ID & TIMESTAMPS & AUDIT & ACTIVE
    AUTH_CAT --> ID & TIMESTAMPS & ACTIVE
    JSON_CAT --> ID & TIMESTAMPS & AUDIT & ACTIVE

    style PUBLIC fill:#336791,color:#fff
    style FORM_CAT fill:#6366f1,color:#fff
    style AUTH_CAT fill:#ef4444,color:#fff
```

---

## 📋 Table Schema Example - ADT1

```mermaid
erDiagram
    adt1_submissions {
        int id PK "Serial Primary Key"
        int ref_user_id "User Reference"
        int company_id "Company ID"
        varchar cin "Corporate Identity Number"
        varchar company_name "Company Name"
        varchar company_address "Address"
        varchar company_email "Email"
        varchar falling_section "Section Reference"
        varchar appointment_nature "Nature of Appointment"
        varchar is_auditor_appointed "Auditor Appointed"
        numeric auditor_number "Auditor Number"
        varchar annual_general_meeting "AGM Details"
        timestamp agm_date "AGM Date"
        timestamp appointment_date "Appointment Date"
        varchar is_casual_vacancy "Casual Vacancy"
        varchar srn_of_relevant_form "SRN"
        varchar person_vacated "Person Vacated"
        timestamp vacancy_date "Vacancy Date"
        varchar casual_vacancy_reasons "Vacancy Reasons"
        numeric membership_number "Membership Number"
        boolean auditor_serial "Auditor Serial"
        varchar auditor_member_no "Auditor Member No"
        varchar resolution_number "Resolution Number"
        timestamp resolution_date "Resolution Date"
        varchar signed_by "Signed By"
        varchar designation "Designation"
        varchar din "Director Identification Number"
        varchar ref_user_name "User Name Reference"
        timestamp created_at "Created Timestamp"
    }

    user_accounts {
        int id PK "Serial Primary Key"
        varchar username UK "Unique Username"
        varchar email UK "Unique Email"
        varchar password_hash "Hashed Password"
        boolean is_active "Active Status"
        timestamp created_at "Created Timestamp"
        timestamp updated_at "Updated Timestamp"
    }

    user_accounts ||--o{ adt1_submissions : "creates (future FK)"
```

---

## 🔄 Database Migration Strategy

```mermaid
graph LR
    subgraph "Migration Files"
        M001[001_create_adt1.sql]
        M002[002_create_ben2.sql]
        M003[003_create_pas3.sql]
        M012[012_create_all_phase3_tables.sql]
        M013[013_create_users.sql]
    end

    subgraph "Migration Execution"
        MANUAL[Manual Execution<br/>psql commands]
        AUTO[Auto Migration<br/>Future: Alembic]
    end

    subgraph "Database"
        PG[(PostgreSQL)]
    end

    M001 & M002 & M003 & M012 & M013 --> MANUAL
    MANUAL -->|Apply| PG
    AUTO -.->|Future| PG

    style M001 fill:#6366f1,color:#fff
    style PG fill:#336791,color:#fff
    style AUTO fill:#94a3b8,color:#fff
```

---

## 💾 Data Storage Strategy

```mermaid
graph TB
    subgraph "Storage Types"
        RELATIONAL[Relational Data<br/>Form Fields]
        JSON_DATA[JSON/JSONB Data<br/>Dynamic Forms]
        BINARY[Binary Data<br/>File Uploads - Future]
    end

    subgraph "Storage Locations"
        PG_TABLES[(PostgreSQL Tables<br/>Structured Data)]
        PG_JSONB[(JSONB Columns<br/>Flexible Schema)]
        S3[S3/Object Storage<br/>Files - Future]
    end

    RELATIONAL --> PG_TABLES
    JSON_DATA --> PG_JSONB
    BINARY -.-> S3

    PG_TABLES -->|Query| SQLALCHEMY[SQLAlchemy ORM]
    PG_JSONB -->|JSON Functions| SQLALCHEMY
    S3 -.->|File URLs| SQLALCHEMY

    style PG_TABLES fill:#336791,color:#fff
    style PG_JSONB fill:#f59e0b,color:#fff
    style S3 fill:#94a3b8,color:#fff
```

---

## 🔍 Query Optimization

```mermaid
graph TB
    subgraph "Query Layer"
        QUERY[SQL Query]
    end

    subgraph "Optimization Techniques"
        INDEXES[Database Indexes<br/>Primary, Foreign, Custom]
        POOLING[Connection Pooling<br/>Async Pool]
        CACHING[Query Caching<br/>Redis - Future]
        PAGINATION[Pagination<br/>Limit/Offset]
    end

    subgraph "Performance"
        FAST[<100ms Response<br/>Average Query Time]
    end

    QUERY --> INDEXES
    QUERY --> POOLING
    QUERY -.-> CACHING
    QUERY --> PAGINATION
    
    INDEXES & POOLING & CACHING & PAGINATION --> FAST

    style QUERY fill:#6366f1,color:#fff
    style INDEXES fill:#10b981,color:#fff
    style FAST fill:#22c55e,color:#fff
```

---

## 📈 Data Volume Estimates

```mermaid
graph TB
    subgraph "Current"
        TABLES_NOW[64 Tables]
        RECORDS_NOW[~50 Records<br/>Test Data]
        SIZE_NOW[< 10 MB]
    end

    subgraph "6 Months"
        TABLES_6M[64 Tables]
        RECORDS_6M[~10,000 Records]
        SIZE_6M[~500 MB]
    end

    subgraph "1 Year"
        TABLES_1Y[64-70 Tables]
        RECORDS_1Y[~100,000 Records]
        SIZE_1Y[~5 GB]
    end

    TABLES_NOW -->|Growth| TABLES_6M
    TABLES_6M -->|Growth| TABLES_1Y
    
    RECORDS_NOW -->|200x| RECORDS_6M
    RECORDS_6M -->|10x| RECORDS_1Y
    
    SIZE_NOW -->|50x| SIZE_6M
    SIZE_6M -->|10x| SIZE_1Y

    style TABLES_NOW fill:#6366f1,color:#fff
    style TABLES_6M fill:#8b5cf6,color:#fff
    style TABLES_1Y fill:#a855f7,color:#fff
```

---

## ✅ Data Architecture Features

| Feature | Implementation | Status |
|---------|----------------|--------|
| **Database** | PostgreSQL 15 | ✅ |
| **ORM** | SQLAlchemy 2.0 async | ✅ |
| **Migrations** | SQL scripts | ✅ |
| **Indexes** | Primary keys + custom | ✅ |
| **JSON Support** | JSONB columns | ✅ |
| **Connection Pool** | Async pool | ✅ |
| **Performance** | <100ms avg | ✅ |
| **Backup** | Planned | 🎯 |

---

**Version:** 1.0  
**Database:** PostgreSQL 15  
**Tables:** 64  
**Status:** ✅ Production Ready

