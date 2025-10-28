# Data Flow Diagrams
## ComplyCrafter - Complete Data Flow Documentation

**Date:** October 27, 2024  
**Version:** 1.0

---

## 1. FORM SUBMISSION FLOW

### 1.1 Complete Form Submission Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FORM SUBMISSION - END TO END FLOW                         │
└─────────────────────────────────────────────────────────────────────────────┘

STEP 1: User Fills Form
───────────────────────
┌──────────────┐
│   Browser    │  User fills ADT1 form
│   (Angular)  │  • Company info (auto-filled)
│              │  • Auditor details
│              │  • Appointment date
│              │  • Uploads documents
└──────┬───────┘
       │ Real-time validation (Reactive Forms)
       │ All fields validated locally
       │
       ▼
STEP 2: Form Validation
───────────────────────
┌──────────────┐
│  Component   │  • Check required fields
│  Validation  │  • Validate formats (CIN, PAN, DIN)
│              │  • Check date ranges
│              │  • Validate file types/sizes
└──────┬───────┘
       │ Valid?
       │
       ├─ No ──▶ Show errors, prevent submit
       │
       └─ Yes
          ↓
STEP 3: Submit Request
──────────────────────
┌──────────────┐
│ ADT1 Service │  service.createADT1(formData)
│  (Angular)   │  • Prepare request payload
│              │  • Convert to JSON
└──────┬───────┘
       │ HTTP POST /api/adt1/
       │ Authorization: Bearer {token}
       │
       ▼
STEP 4: HTTP Interceptor
────────────────────────
┌──────────────┐
│ Auth         │  • Add auth token
│ Interceptor  │  • Add request ID
│              │  • Add timestamp
└──────┬───────┘
       │
       ▼
STEP 5: API Gateway
───────────────────
┌──────────────┐
│  Gateway     │  • Validate JWT token
│  Service     │  • Check rate limits
│              │  • Route to Forms Service
└──────┬───────┘
       │ POST http://forms-service:8001/api/adt1/
       │
       ▼
STEP 6: Forms Service - API Layer
──────────────────────────────────
┌──────────────┐
│FastAPI Route │  @router.post("/")
│  /adt1/      │  • Dependency injection
│              │  • get_current_user()
│              │  • get_db()
└──────┬───────┘
       │
       ▼
STEP 7: Pydantic Validation
────────────────────────────
┌──────────────┐
│  ADT1Create  │  • Validate all fields
│   Schema     │  • Type checking
│              │  • Custom validators
└──────┬───────┘
       │ Valid?
       │
       ├─ No ──▶ 422 Validation Error
       │
       └─ Yes
          ↓
STEP 8: Service Layer
─────────────────────
┌──────────────┐
│ ADT1Service  │  • Business logic validation
│              │  • Check auditor eligibility
│              │  • Verify company exists
│              │  • Check rotation rules
└──────┬───────┘
       │
       ▼
STEP 9: Database Transaction
─────────────────────────────
┌──────────────┐
│ SQLAlchemy   │  BEGIN TRANSACTION
│    ORM       │  • Create ADT1 record
│              │  • Update company auditor
│              │  • Log audit trail
│              │  COMMIT
└──────┬───────┘
       │
       ▼
STEP 10: PostgreSQL
───────────────────
┌──────────────┐
│  Database    │  • INSERT into tbl_adt1
│              │  • UPDATE tbl_company
│              │  • INSERT into tbl_api_log
│              │  • Return new record ID
└──────┬───────┘
       │ id: 123
       │
       ▼
STEP 11: Response Building
───────────────────────────
┌──────────────┐
│  ADT1View    │  • Map DB record to Pydantic
│   Schema     │  • Include related data
│              │  • Serialize to JSON
└──────┬───────┘
       │ 201 Created
       │ {id: 123, ...}
       │
       ▼
STEP 12: API Gateway
────────────────────
┌──────────────┐
│  Gateway     │  • Cache response (if needed)
│  Service     │  • Add response headers
│              │  • Return to client
└──────┬───────┘
       │
       ▼
STEP 13: HTTP Interceptor
─────────────────────────
┌──────────────┐
│   Response   │  • Handle errors
│ Interceptor  │  • Transform data
│              │  • Update loading state
└──────┬───────┘
       │
       ▼
STEP 14: Angular Service
────────────────────────
┌──────────────┐
│ ADT1 Service │  • Process response
│  (Angular)   │  • Update local state
│              │  • Emit success event
└──────┬───────┘
       │
       ▼
STEP 15: Component Update
─────────────────────────
┌──────────────┐
│  Component   │  • Show success message
│              │  • Navigate to list view
│              │  • Update UI state
└──────────────┘

STEP 16: Background Jobs (Async)
─────────────────────────────────
┌──────────────┐
│ Jobs Service │  • Send confirmation email
│              │  • Update compliance tracker
│              │  • Generate PDF
│              │  • Sync with MCA (if configured)
└──────────────┘

Total Time: < 1 second for steps 1-15
Background jobs: 30 seconds - 5 minutes
```

---

## 2. USER AUTHENTICATION FLOW

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       USER AUTHENTICATION FLOW                               │
└─────────────────────────────────────────────────────────────────────────────┘

LOGIN FLOW
──────────

User enters credentials
         │
         ▼
┌────────────────────┐
│  Login Component   │  • Username/email
│    (Angular)       │  • Password
└─────────┬──────────┘
          │ formSubmit()
          ▼
┌────────────────────┐
│   Auth Service     │  login(credentials)
└─────────┬──────────┘
          │ POST /api/auth/login
          ▼
┌────────────────────┐
│   API Gateway      │  • Route to Forms Service
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Auth Route        │  • Validate credentials
│  (FastAPI)         │  • Check password hash
│                    │  • Verify user active
└─────────┬──────────┘
          │ Valid?
          │
          ├─ No ──▶ 401 Unauthorized
          │
          └─ Yes
             ↓
┌────────────────────┐
│  Generate JWT      │  • access_token (30 min)
│                    │  • refresh_token (7 days)
│                    │  • Include user_id, role
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Return Tokens     │  200 OK
│                    │  {access_token, refresh_token, user}
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Auth Service      │  • Store tokens (localStorage)
│   (Angular)        │  • Store user info (state)
│                    │  • Set auth status = true
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Route to          │  Navigate to /dashboard
│  Dashboard         │
└────────────────────┘


TOKEN REFRESH FLOW
──────────────────

Access token expires (30 min)
         │
         ▼
┌────────────────────┐
│  HTTP Request      │  GET /api/forms/adt1/
│                    │  Authorization: Bearer {expired_token}
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  API Gateway       │  • Validate token
│                    │  • Token expired!
│                    │  • Return 401
└─────────┬──────────┘
          │ 401 Unauthorized
          ▼
┌────────────────────┐
│  HTTP Interceptor  │  • Detect 401
│   (Angular)        │  • Check if refresh token valid
└─────────┬──────────┘
          │ refresh_token exists?
          │
          ├─ No ──▶ Logout, redirect to login
          │
          └─ Yes
             ↓
┌────────────────────┐
│  Refresh Request   │  POST /api/auth/refresh
│                    │  {refresh_token}
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Auth Route        │  • Validate refresh token
│                    │  • Generate new access token
│                    │  • Return new token
└─────────┬──────────┘
          │ {access_token}
          ▼
┌────────────────────┐
│  Store New Token   │  • Update localStorage
│                    │  • Retry original request
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Original Request  │  GET /api/forms/adt1/
│  Retried           │  Authorization: Bearer {new_token}
│                    │  • Success!
└────────────────────┘
```

---

## 3. FILE UPLOAD FLOW

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FILE UPLOAD FLOW                                     │
└─────────────────────────────────────────────────────────────────────────────┘

STEP 1: User Selects File
─────────────────────────
┌──────────────┐
│ File Input   │  <input type="file" (change)="onFileSelect($event)">
│  Component   │
└──────┬───────┘
       │ File selected
       ▼
STEP 2: Client-Side Validation
───────────────────────────────
┌──────────────┐
│  Component   │  • Check file type (.pdf, .doc, .docx)
│  Logic       │  • Check file size (max 5MB)
│              │  • Validate file name
└──────┬───────┘
       │ Valid?
       │
       ├─ No ──▶ Show error, clear selection
       │
       └─ Yes
          ↓
STEP 3: Preview (Optional)
──────────────────────────
┌──────────────┐
│  Show        │  • Display file name
│  Preview     │  • Display file size
│              │  • Show thumbnail (if image)
└──────┬───────┘
       │
       ▼
STEP 4: Upload Initiation
─────────────────────────
┌──────────────┐
│Upload Service│  uploadFile(file, formId)
│  (Angular)   │  • Create FormData object
│              │  • Append file
│              │  • Add metadata
└──────┬───────┘
       │ POST /api/forms/{formId}/upload
       │ Content-Type: multipart/form-data
       │
       ▼
STEP 5: Upload Progress
───────────────────────
┌──────────────┐
│  Progress    │  • Track upload progress
│  Indicator   │  • Show percentage (0-100%)
│              │  • Allow cancel
└──────┬───────┘
       │ Uploading...
       │
       ▼
STEP 6: API Gateway
───────────────────
┌──────────────┐
│  Gateway     │  • Validate token
│  Service     │  • Check file size limit
│              │  • Route to Forms Service
└──────┬───────┘
       │
       ▼
STEP 7: Forms Service - Upload Route
─────────────────────────────────────
┌──────────────┐
│ FastAPI      │  @router.post("/{formId}/upload")
│  Upload      │  • file: UploadFile = File(...)
│  Handler     │  • Validate file type
│              │  • Validate file size
└──────┬───────┘
       │
       ▼
STEP 8: File Processing
───────────────────────
┌──────────────┐
│  Service     │  • Generate unique filename
│  Layer       │  • Virus scan (if configured)
│              │  • Extract metadata
└──────┬───────┘
       │
       ▼
STEP 9: Save to Storage
───────────────────────
┌──────────────┐
│ S3/MinIO     │  • Upload to object storage
│  Storage     │  • Path: /uploads/{formId}/{filename}
│              │  • Set permissions (private)
│              │  • Get public URL
└──────┬───────┘
       │ file_path: "https://..."
       │
       ▼
STEP 10: Update Database
────────────────────────
┌──────────────┐
│ SQLAlchemy   │  UPDATE tbl_adt1
│    ORM       │  SET attachment_file = file_path
│              │  WHERE id = formId
└──────┬───────┘
       │
       ▼
STEP 11: Response
─────────────────
┌──────────────┐
│ FastAPI      │  200 OK
│  Response    │  {file_url, file_name, file_size}
└──────┬───────┘
       │
       ▼
STEP 12: UI Update
──────────────────
┌──────────────┐
│ Component    │  • Hide progress indicator
│              │  • Show success message
│              │  • Display file link
│              │  • Enable form submit
└──────────────┘

Total Time: 2-5 seconds (depending on file size)
```

---

## 2. SEARCH & FILTER FLOW

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SEARCH & FILTER FLOW                                 │
└─────────────────────────────────────────────────────────────────────────────┘

User enters search term: "ABC Company"
         │
         ▼
┌────────────────────┐
│  Search Input      │  <input (input)="onSearch($event)">
│   Component        │  • Debounce 300ms
└─────────┬──────────┘
          │ After debounce
          ▼
┌────────────────────┐
│  Search Service    │  search(term, filters)
│    (Angular)       │  • Build query params
└─────────┬──────────┘
          │ GET /api/adt1/?q=ABC+Company&status=active
          │
          ▼
┌────────────────────┐
│  API Gateway       │  • Validate token
│                    │  • Forward to Forms Service
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  FastAPI Route     │  @router.get("/")
│                    │  • Parse query params
│                    │  • Validate parameters
└─────────┬──────────┘
          │ q="ABC Company", status="active"
          ▼
┌────────────────────┐
│  Service Layer     │  search_adt1s(query, filters)
│                    │  • Build SQLAlchemy query
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Query Builder     │  SELECT * FROM vw_adt1
│  (SQLAlchemy)      │  WHERE (
│                    │    company_name ILIKE '%ABC Company%'
│                    │    OR auditor_name ILIKE '%ABC Company%'
│                    │  ) AND is_active = TRUE
│                    │  ORDER BY created_on DESC
│                    │  LIMIT 100 OFFSET 0
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  PostgreSQL        │  • Execute query with indexes
│                    │  • Return matching rows
└─────────┬──────────┘
          │ [ADT1 records]
          ▼
┌────────────────────┐
│  Pydantic Response │  • Map to ADT1View models
│                    │  • Serialize to JSON
└─────────┬──────────┘
          │ 200 OK
          │ {results: [...], total: 15}
          ▼
┌────────────────────┐
│  Search Service    │  • Process results
│   (Angular)        │  • Update state
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Component         │  • Display results
│                    │  • Show total count
│                    │  • Enable pagination
└────────────────────┘

Total Time: < 200ms
```

---

## 3. COMPANY DATA FLOW

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        COMPANY SELECTION FLOW                                │
│                    (Auto-populate form fields)                               │
└─────────────────────────────────────────────────────────────────────────────┘

User selects company from dropdown
         │
         ▼
┌────────────────────┐
│  Company Select    │  <select (change)="onCompanyChange($event)">
│   Component        │  • company_id selected
└─────────┬──────────┘
          │ companyId: 123
          ▼
┌────────────────────┐
│ Company Service    │  getCompany(123)
│   (Angular)        │
└─────────┬──────────┘
          │ GET /api/company/123
          ▼
┌────────────────────┐
│  API Gateway       │  • Validate token
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Forms Service     │  GET /company/{id}
│  Company Route     │  • Query company details
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Database          │  SELECT c.*, cd.*, cfd.*
│  (PostgreSQL)      │  FROM tbl_company c
│                    │  LEFT JOIN tbl_company_details cd
│                    │  LEFT JOIN tbl_company_financial_details cfd
│                    │  WHERE c.id = 123
└─────────┬──────────┘
          │ Company data
          ▼
┌────────────────────┐
│  Response          │  200 OK
│                    │  {id, cin, name, address, email, ...}
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Company Service    │  • Process response
│   (Angular)        │  • Store in state
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Form Component    │  formGroup.patchValue({
│                    │    companyId: data.id,
│                    │    cin: data.cin,
│                    │    companyName: data.name,
│                    │    companyAddress: data.address,
│                    │    companyEmail: data.email
│                    │  })
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Form UI           │  • All company fields populated
│                    │  • Fields become readonly
│                    │  • User fills remaining fields
└────────────────────┘

Parallel Request: Get Related Data
───────────────────────────────────

Company Selected (id: 123)
         │
         ├──────────────┬──────────────┬──────────────┐
         │              │              │              │
         ▼              ▼              ▼              ▼
    ┌────────┐    ┌────────┐    ┌────────┐    ┌────────┐
    │Directors│   │Auditors │   │Capital │   │Documents│
    │/api/dir│   │/api/aud │   │/api/cap│   │/api/dms │
    │/comp/123│   │/comp/123│   │/comp/123│   │/comp/123│
    └────┬───┘    └────┬───┘    └────┬───┘    └────┬───┘
         │              │              │              │
         └──────────────┴──────────────┴──────────────┘
                        │
                        ▼
               ┌────────────────┐
               │ Aggregate Data │
               │ • 3 Directors  │
               │ • 1 Auditor    │
               │ • Capital info │
               │ • 5 Documents  │
               └────────────────┘

Total Time: < 300ms for all requests (parallel)
```

---

## 4. REAL-TIME NOTIFICATION FLOW

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      REAL-TIME NOTIFICATION FLOW                             │
└─────────────────────────────────────────────────────────────────────────────┘

EVENT TRIGGER: Form Submission Completed
────────────────────────────────────────

Forms Service
      │ Form submitted successfully
      │ id: 123, type: ADT1, company_id: 456
      ▼
┌────────────────────┐
│  Event Publisher   │  • Create event object
│                    │  • Publish to Jobs Service
└─────────┬──────────┘
          │ POST /api/jobs/queue
          │ {event: "form_submitted", data: {...}}
          ▼
┌────────────────────┐
│  Jobs Service      │  • Queue background job
│  (Celery/FastAPI)  │  • Task: process_form_submission
└─────────┬──────────┘
          │
     ┌────┴────┬─────────────┬─────────────┐
     │         │             │             │
     ▼         ▼             ▼             ▼
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│  Email  │ │   SMS   │ │ Update  │ │  Sync   │
│  Task   │ │  Task   │ │ Compl.  │ │  Task   │
└────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘
     │           │           │           │
     ▼           ▼           ▼           ▼

EMAIL NOTIFICATION
──────────────────
┌────────────────────┐
│  Send Email        │  • To: user@example.com
│  (SMTP)            │  • Subject: "ADT1 Submitted"
│                    │  • Body: Form details + link
│                    │  • Attachment: PDF
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Track Email       │  INSERT into tbl_email_tracker
│                    │  • email_id, user_id, status
└────────────────────┘


SMS NOTIFICATION
────────────────
┌────────────────────┐
│  Send SMS          │  • To: +91-9876543210
│  (MSG91)           │  • Message: "ADT1 form submitted"
│                    │  • Template: FORM_SUBMIT
└────────────────────┘


COMPLIANCE UPDATE
─────────────────
┌────────────────────┐
│  Update Tracker    │  • Mark ADT1 as filed
│  (Compliance Svc)  │  • Update next deadline
│                    │  • Recalculate compliance %
└────────────────────┘


MCA SYNC (If configured)
────────────────────────
┌────────────────────┐
│  Prepare Data      │  • Convert to MCA format
│  for MCA           │  • Validate against XSD
│                    │  • Generate XML
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Submit to MCA     │  • POST to MCA API
│  Portal            │  • Get SRN
│                    │  • Store acknowledgment
└─────────┬──────────┘
          │ SRN received
          ▼
┌────────────────────┐
│  Update Form       │  UPDATE tbl_adt1
│  Record            │  SET srn = '...'
│                    │  SET status = 'submitted'
└────────────────────┘

Total Time: 30 seconds - 5 minutes (background)
```

---

## 5. REPORT GENERATION FLOW

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       REPORT GENERATION FLOW                                 │
└─────────────────────────────────────────────────────────────────────────────┘

User clicks "Generate Report"
         │
         ▼
┌────────────────────┐
│  Report Component  │  • Select report type
│                    │  • Select date range
│                    │  • Select company
└─────────┬──────────┘
          │ generateReport()
          ▼
┌────────────────────┐
│  Report Service    │  POST /api/reports/generate
│   (Angular)        │  {type, start_date, end_date, company_id}
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  API Gateway       │  • Validate token
│                    │  • Route to Forms Service
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Reports Route     │  • Validate parameters
│  (FastAPI)         │  • Check permissions
│                    │  • Queue report job
└─────────┬──────────┘
          │ 202 Accepted
          │ {job_id: "abc123"}
          ▼
┌────────────────────┐
│  Jobs Service      │  • Background task
│  (Celery)          │  • Generate report
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Data Aggregation  │  • Query multiple tables
│                    │  • Join company, forms, directors
│                    │  • Aggregate statistics
│                    │  • Calculate compliance %
└─────────┬──────────┘
          │ Aggregated data
          ▼
┌────────────────────┐
│  PDF Generation    │  • Use template (Jinja2)
│                    │  • Insert data
│                    │  • Generate charts
│                    │  • Create PDF (ReportLab)
└─────────┬──────────┘
          │ PDF file
          ▼
┌────────────────────┐
│  Save to Storage   │  • Upload to S3/MinIO
│                    │  • Generate presigned URL
│                    │  • Set expiry (7 days)
└─────────┬──────────┘
          │ file_url
          ▼
┌────────────────────┐
│  Update Job Status │  UPDATE job_status
│                    │  SET status = 'completed'
│                    │  SET file_url = '...'
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Notify User       │  • WebSocket message
│                    │  • Email with link
│                    │  • In-app notification
└────────────────────┘


POLLING MECHANISM (Frontend)
─────────────────────────────

Report queued (job_id: "abc123")
         │
         ▼
┌────────────────────┐
│  Poll Job Status   │  setInterval(() => {
│                    │    checkJobStatus(job_id)
│                    │  }, 3000)
└─────────┬──────────┘
          │ Every 3 seconds
          │
          ▼
┌────────────────────┐
│  GET /api/jobs/    │  • Check status
│      {job_id}      │  • pending → processing → completed
└─────────┬──────────┘
          │
          ├─ pending/processing ──▶ Continue polling
          │
          └─ completed
             ↓
┌────────────────────┐
│  Download Report   │  • Stop polling
│                    │  • Show download link
│                    │  • Enable download button
└────────────────────┘

Total Time: 10-60 seconds (depending on report complexity)
```

---

## 6. COMPLIANCE TRACKING FLOW

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      COMPLIANCE TRACKING FLOW                                │
└─────────────────────────────────────────────────────────────────────────────┘

DAILY JOB: Check Upcoming Deadlines
────────────────────────────────────

┌────────────────────┐
│  Cron Job          │  Runs daily at 6 AM
│  (Jobs Service)    │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Query Companies   │  SELECT * FROM tbl_company
│                    │  WHERE is_active = TRUE
└─────────┬──────────┘
          │ For each company
          ▼
┌────────────────────┐
│  Calculate         │  • Check financial year end
│  Deadlines         │  • Calculate AGM deadline
│                    │  • Calculate filing deadlines
│                    │  • Check form due dates
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Check Status      │  • Query submitted forms
│                    │  • Compare with requirements
│                    │  • Calculate compliance %
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Identify Gaps     │  • Forms not filed
│                    │  • Upcoming deadlines
│                    │  • Overdue items
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Generate Alerts   │  • Email reminders
│                    │  • SMS notifications
│                    │  • In-app notifications
│                    │  • Dashboard updates
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Store in DB       │  INSERT into tbl_compliance_tracker
│                    │  • company_id
│                    │  • form_type
│                    │  • due_date
│                    │  • status
│                    │  • alert_sent
└────────────────────┘


REAL-TIME DASHBOARD UPDATE
──────────────────────────

Compliance data updated
         │
         ▼
┌────────────────────┐
│  Emit Event        │  • WebSocket message
│  (Jobs Service)    │  • Event: "compliance_updated"
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  WebSocket Server  │  • Broadcast to all connected clients
│  (API Gateway)     │  • Filter by company_id
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Angular Client    │  • Receive WebSocket message
│  (WebSocket)       │  • Update compliance widget
│                    │  • Refresh dashboard charts
│                    │  • Show notification badge
└────────────────────┘
```

---

## 7. PAYMENT FLOW

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PAYMENT PROCESSING FLOW                              │
└─────────────────────────────────────────────────────────────────────────────┘

User selects subscription plan
         │
         ▼
┌────────────────────┐
│  Plan Selection    │  • Plan: Professional
│   Component        │  • Amount: ₹10,000
│                    │  • Billing: Annual
└─────────┬──────────┘
          │ Proceed to payment
          ▼
┌────────────────────┐
│  Billing Service   │  createOrder(plan_id, user_id)
│   (Angular)        │
└─────────┬──────────┘
          │ POST /api/billing/create-order
          ▼
┌────────────────────┐
│  API Gateway       │  • Validate token
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Billing Service   │  • Create order record
│  (FastAPI)         │  • Calculate amount
│                    │  • Apply discounts/taxes
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Razorpay API      │  • POST /orders
│                    │  • amount: 1000000 (paise)
│                    │  • currency: INR
│                    │  • receipt: ORD_123
└─────────┬──────────┘
          │ {order_id: "order_xyz"}
          ▼
┌────────────────────┐
│  Store Order       │  INSERT into tbl_payment_details
│                    │  • order_id
│                    │  • user_id
│                    │  • amount
│                    │  • status: 'created'
└─────────┬──────────┘
          │ 200 OK {order_id, amount, key}
          ▼
┌────────────────────┐
│  Load Razorpay     │  • Initialize Razorpay SDK
│  Checkout          │  • Open payment modal
│                    │  • User selects payment method
└─────────┬──────────┘
          │ User completes payment
          ▼
┌────────────────────┐
│  Razorpay Webhook  │  POST /api/billing/webhook
│                    │  • payment.captured event
│                    │  • Signature verification
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Verify Payment    │  • Verify signature (HMAC)
│  (Backend)         │  • Match order_id
│                    │  • Validate amount
└─────────┬──────────┘
          │ Valid payment
          ▼
┌────────────────────┐
│  Update Records    │  BEGIN TRANSACTION
│                    │  • UPDATE payment status
│                    │  • INSERT subscription
│                    │  • UPDATE user limits
│                    │  COMMIT
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Send              │  • Confirmation email
│  Confirmations     │  • Invoice PDF
│                    │  • Receipt
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Update Frontend   │  • Success message
│                    │  • Redirect to dashboard
│                    │  • Update subscription status
└────────────────────┘

Total Time: 5-30 seconds (user-dependent)
```

---

## 8. DATA SYNC FLOW

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      DATA SYNCHRONIZATION FLOW                               │
└─────────────────────────────────────────────────────────────────────────────┘

SCENARIO: Multi-tab data consistency

Tab 1: User viewing form list
         │
         │ WebSocket connection established
         ▼
┌────────────────────┐
│  WebSocket Client  │  • Connected to gateway
│   (Angular)        │  • Listening for events
└────────────────────┘


Tab 2: User submits new form
         │
         ▼
┌────────────────────┐
│  Submit Form       │  POST /api/adt1/
│                    │  • Form data
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Backend Processes │  • Save to database
│                    │  • id: 789 created
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Emit Event        │  • Event: "form_created"
│  (WebSocket)       │  • Data: {id: 789, type: "adt1"}
└─────────┬──────────┘
          │
          │ Broadcast to all clients
          │ (filtered by company_id)
          ▼
┌────────────────────┐
│  Tab 1 Receives    │  • Event received
│  WebSocket Event   │  • Check if same company
│                    │  • Update local state
│                    │  • Refresh list
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  UI Auto Updates   │  • New form appears in list
│                    │  • Show notification
│                    │  • Increment count
└────────────────────┘

Real-time synchronization across all tabs/devices!
```

---

## ARCHITECTURE SUMMARY

### Key Features

✅ **Microservices Architecture**
- Independent services
- Clear boundaries
- Easy to scale
- Fault isolation

✅ **Layered Design**
- API Layer
- Service Layer
- Data Layer
- Clear separation

✅ **Async Processing**
- Non-blocking I/O
- Background jobs
- Event-driven
- High throughput

✅ **Real-time Updates**
- WebSocket support
- Live notifications
- Auto-refresh
- Multi-tab sync

✅ **Robust Security**
- JWT authentication
- Role-based authorization
- Encryption
- Audit trails

✅ **High Availability**
- Multiple replicas
- Auto-scaling
- Load balancing
- Disaster recovery

✅ **Performance Optimized**
- Caching layers
- Query optimization
- CDN integration
- Async operations

---

**Status:** ✅ Production Ready  
**Version:** 1.0  
**Last Updated:** October 27, 2024

🔄 **Complete Data Flow Documentation!** 🚀

