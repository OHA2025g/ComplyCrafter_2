# 🗃️ Data Model Diagram
## ComplyCrafter - Complete Database Schema

**Version:** 1.0  
**Date:** October 31, 2025  
**Database:** PostgreSQL 15

---

## 📊 Complete Entity Relationship Diagram

```mermaid
erDiagram
    USER_ACCOUNTS ||--o{ ADT1_SUBMISSIONS : creates
    USER_ACCOUNTS ||--o{ BEN2_SUBMISSIONS : creates
    USER_ACCOUNTS ||--o{ PAS3_SUBMISSIONS : creates
    USER_ACCOUNTS ||--o{ DPT3_SUBMISSIONS : creates
    USER_ACCOUNTS ||--o{ JSON_SUBMISSIONS : creates
    USER_ACCOUNTS ||--o{ TBL_GENERIC : creates

    USER_ACCOUNTS {
        int id PK
        varchar username UK
        varchar email UK
        varchar password_hash
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    ADT1_SUBMISSIONS {
        int id PK
        int ref_user_id FK
        int company_id
        varchar cin
        varchar company_name
        varchar company_address
        varchar company_email
        varchar falling_section
        varchar appointment_nature
        varchar is_auditor_appointed
        numeric auditor_number
        varchar annual_general_meeting
        timestamp agm_date
        timestamp appointment_date
        varchar is_casual_vacancy
        varchar srn_of_relevant_form
        varchar person_vacated
        timestamp vacancy_date
        varchar casual_vacancy_reasons
        numeric membership_number
        boolean auditor_serial
        varchar auditor_member_no
        varchar resolution_number
        timestamp resolution_date
        varchar signed_by
        varchar designation
        varchar din
        varchar ref_user_name
        timestamp created_at
    }

    BEN2_SUBMISSIONS {
        int id PK
        int ref_user_id FK
        int company_id
        varchar cin
        varchar company_name
        varchar company_address
        varchar company_email
        varchar beneficial_owner_name
        varchar pan_number
        varchar nationality
        varchar date_of_birth
        timestamp created_at
    }

    PAS3_SUBMISSIONS {
        int id PK
        int ref_user_id FK
        int company_id
        varchar cin
        varchar company_name
        varchar return_type
        int total_shares_allotted
        numeric total_consideration
        timestamp created_at
    }

    DPT3_SUBMISSIONS {
        int id PK
        int ref_user_id FK
        int company_id
        varchar cin
        varchar company_name
        varchar deposit_type
        numeric outstanding_amount
        int number_of_depositors
        timestamp created_at
    }

    JSON_SUBMISSIONS {
        int id PK
        int created_by FK
        varchar form_type
        varchar cin
        varchar company_name
        varchar contact_email
        varchar filing_period
        jsonb submission_data
        timestamp created_at
        timestamp updated_at
        boolean is_active
    }

    TBL_GENERIC {
        int id PK
        int ref_user FK
        int company_id
        varchar cin
        varchar company_name
        varchar company_address
        varchar company_email
        int created_by FK
        timestamp created_on
        int updated_by FK
        timestamp updated_on
        boolean is_active
    }
```

---

## 📋 Phase 1 & 2 Forms - Detailed Schemas

```mermaid
erDiagram
    ADT1_SUBMISSIONS {
        int id PK "Primary Key"
        int ref_user_id "User Reference"
        varchar cin "CIN - 21 chars"
        varchar company_name "Company Name - 255 chars"
        timestamp agm_date "AGM Date"
        timestamp created_at "Timestamp"
    }

    BEN2_SUBMISSIONS {
        int id PK
        varchar beneficial_owner_name "Owner Name"
        varchar pan_number "PAN - 10 chars"
        varchar nationality "Nationality"
        timestamp created_at "Timestamp"
    }

    PAS3_SUBMISSIONS {
        int id PK
        varchar return_type "Return Type"
        int total_shares_allotted "Share Count"
        numeric total_consideration "Amount in INR"
        timestamp created_at "Timestamp"
    }

    DPT3_SUBMISSIONS {
        int id PK
        varchar deposit_type "Deposit Type"
        numeric outstanding_amount "Amount in INR"
        int number_of_depositors "Depositor Count"
        timestamp created_at "Timestamp"
    }
```

---

## 📦 Phase 3+ Forms - Generic Schema Pattern

```mermaid
erDiagram
    TBL_BOARDREPORT {
        int id PK
        int ref_user FK
        int company_id
        varchar cin
        varchar company_name
        varchar company_address
        varchar company_email
        int created_by FK
        timestamp created_on
        boolean is_active
    }

    TBL_CHG1 {
        int id PK
        int ref_user FK
        int company_id
        varchar cin
        varchar company_name
        varchar company_address
        varchar company_email
        int created_by FK
        timestamp created_on
        boolean is_active
    }

    TBL_DIR3 {
        int id PK
        int ref_user FK
        int company_id
        varchar cin
        varchar company_name
        varchar company_address
        varchar company_email
        int created_by FK
        timestamp created_on
        boolean is_active
    }

    TBL_MGT14 {
        int id PK
        int ref_user FK
        int company_id
        varchar cin
        varchar company_name
        varchar company_address
        varchar company_email
        int created_by FK
        timestamp created_on
        boolean is_active
    }
```

---

## 🗂️ JSON Submission Schema

```mermaid
erDiagram
    JSON_SUBMISSIONS {
        int id PK "Auto-increment ID"
        varchar form_type "aoc4, mgt7a, msme, etc."
        varchar cin "Corporate Identity Number"
        varchar company_name "Company Name"
        varchar contact_email "Contact Email"
        varchar filing_period "Filing Period"
        jsonb submission_data "Flexible JSON data"
        int created_by FK "User who created"
        timestamp created_at "Creation timestamp"
        timestamp updated_at "Update timestamp"
        boolean is_active "Soft delete flag"
    }

    USER_ACCOUNTS ||--o{ JSON_SUBMISSIONS : "creates"

    USER_ACCOUNTS {
        int id PK
        varchar username UK
        varchar email UK
        varchar password_hash
        boolean is_active
        timestamp created_at
    }
```

---

## 🔗 Future Relationship Model

```mermaid
erDiagram
    COMPANIES ||--o{ USERS : "employs"
    COMPANIES ||--o{ FORMS : "submits"
    USERS ||--o{ FORMS : "creates"
    USERS ||--o{ AUDIT_LOGS : "generates"
    FORMS ||--o{ ATTACHMENTS : "has"
    FORMS ||--o{ APPROVALS : "requires"

    COMPANIES {
        int id PK
        varchar cin UK
        varchar name
        varchar address
        timestamp created_at
    }

    USERS {
        int id PK
        int company_id FK
        varchar username UK
        varchar email UK
        varchar role
        timestamp created_at
    }

    FORMS {
        int id PK
        int company_id FK
        int user_id FK
        varchar form_type
        jsonb form_data
        varchar status
        timestamp created_at
    }

    ATTACHMENTS {
        int id PK
        int form_id FK
        varchar file_name
        varchar file_url
        int file_size
        timestamp uploaded_at
    }

    APPROVALS {
        int id PK
        int form_id FK
        int approver_id FK
        varchar status
        text comments
        timestamp approved_at
    }

    AUDIT_LOGS {
        int id PK
        int user_id FK
        varchar action
        varchar entity_type
        int entity_id
        jsonb changes
        timestamp created_at
    }
```

---

## 📊 Table Statistics

### **Current State**
| Category | Count | Description |
|----------|-------|-------------|
| **Form Tables** | 62 | Individual form submissions |
| **Auth Tables** | 1 | User accounts |
| **JSON Tables** | 1 | Flexible JSON submissions |
| **Total** | 64 | All database tables |

### **Table Size Distribution**
- **Small** (< 10 columns): 51 tables (Phase 3+)
- **Medium** (10-30 columns): 8 tables (Phase 1&2)
- **Large** (30+ columns): 5 tables (Complex forms)

### **Index Count**
- **Primary Keys:** 64 indexes
- **Unique Constraints:** 2 (username, email)
- **Custom Indexes:** 2 (username, email on user_accounts)
- **Total:** 68 indexes

---

## ✅ Data Model Features

| Feature | Implementation | Status |
|---------|----------------|--------|
| **Primary Keys** | SERIAL (auto-increment) | ✅ |
| **Foreign Keys** | Planned for relationships | 🎯 |
| **Unique Constraints** | username, email | ✅ |
| **Indexes** | Primary + custom | ✅ |
| **Timestamps** | created_at, updated_at | ✅ |
| **Soft Deletes** | is_active flag | ✅ |
| **Audit Fields** | created_by, updated_by | ✅ |
| **JSON Support** | JSONB columns | ✅ |

---

**Version:** 1.0  
**Database:** PostgreSQL 15  
**Tables:** 64  
**Status:** ✅ Production Ready

