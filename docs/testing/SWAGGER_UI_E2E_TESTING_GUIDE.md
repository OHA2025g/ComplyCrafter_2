# 🧪 Swagger UI E2E Testing Guide - ComplyCrafter

## 🎯 Testing URL
**👉 http://localhost:8100/docs**

---

## ✅ Testing Checklist

### **Step 1: Health Check** (2 minutes)

1. Open: http://localhost:8100/docs
2. Find: `GET /healthz`
3. Click: **"Try it out"**
4. Click: **"Execute"**
5. ✅ Verify Response:
   ```json
   {
     "status": "ok"
   }
   ```
6. 📸 **Screenshot:** Save as `01_health_check.png`

---

### **Step 2: Company Search (MCA API)** (5 minutes)

1. Find: `GET /mca/search`
2. Click: **"Try it out"**
3. Enter Query: `illuminati innovation`
4. Click: **"Execute"**
5. ✅ Verify: Returns list of companies with "ILLUMINATI" in name
6. ✅ Check: Response time < 1 second (cached)
7. 📸 **Screenshot:** Save as `02_company_search.png`

**Expected Response:**
```json
{
  "results": [
    {
      "company_name": "ILLUMINATI INNOVATION PRIVATE LIMITED",
      "cin": "U...",
      ...
    }
  ]
}
```

---

### **Step 3: Authentication Testing** (10 minutes)

#### A. Signup
1. Find: `POST /auth/signup`
2. Click: **"Try it out"**
3. Edit Request Body:
   ```json
   {
     "username": "testuser1",
     "email": "testuser1@test.com",
     "password": "Test@123456"
   }
   ```
4. Click: **"Execute"**
5. ✅ Verify: 200 OK response with user data
6. 📸 **Screenshot:** Save as `03_auth_signup.png`

#### B. Login
1. Find: `POST /auth/login`
2. Click: **"Try it out"**
3. Edit Request Body:
   ```json
   {
     "username": "testuser1",
     "password": "Test@123456"
   }
   ```
4. Click: **"Execute"**
5. ✅ Verify: Returns access token
6. 📸 **Screenshot:** Save as `04_auth_login.png`

---

### **Step 4: Form Testing (Phase 1 - Top 10 Forms)** (30 minutes)

Test these 10 core forms:

#### **4.1. ADT1 - Appointment of Auditors**

**GET (List submissions):**
1. Find: `GET /adt1/`
2. Click: **"Try it out"** → **"Execute"**
3. ✅ Verify: Returns list (may be empty initially)
4. 📸 **Screenshot:** `05_adt1_list.png`

**POST (Submit new form):**
1. Find: `POST /adt1/`
2. Click: **"Try it out"**
3. Edit Request Body:
   ```json
   {
     "company_id": 1,
     "auditor_name": "John Smith & Associates",
     "appointment_date": "2025-01-01",
     "status": "active"
   }
   ```
4. Click: **"Execute"**
5. ✅ Verify: 201 Created or 200 OK
6. ✅ Note: Record the returned `id`
7. 📸 **Screenshot:** `06_adt1_submit.png`

**GET (Verify submission):**
1. Run `GET /adt1/` again
2. ✅ Verify: New submission appears in list
3. 📸 **Screenshot:** `07_adt1_verify.png`

---

#### **4.2. BEN2 - Beneficial Interest Register**
1. Find: `POST /ben2/`
2. Submit:
   ```json
   {
     "company_id": 1,
     "beneficial_owner": "Jane Doe",
     "share_percentage": 25.5,
     "date_of_registration": "2025-01-01"
   }
   ```
3. ✅ Verify: Success response
4. 📸 **Screenshot:** `08_ben2_submit.png`

---

#### **4.3. CHG1 - Charge Registration**
1. Find: `POST /chg1/`
2. Submit:
   ```json
   {
     "company_id": 1,
     "charge_holder": "ABC Bank Ltd",
     "charge_amount": 1000000,
     "date_of_creation": "2025-01-01"
   }
   ```
3. ✅ Verify: Success
4. 📸 **Screenshot:** `09_chg1_submit.png`

---

#### **4.4. DIR3 - Director KYC**
1. Find: `POST /dir3/`
2. Submit:
   ```json
   {
     "company_id": 1,
     "director_name": "Rajesh Kumar",
     "din": "00123456",
     "date_of_appointment": "2025-01-01"
   }
   ```
3. ✅ Verify: Success
4. 📸 **Screenshot:** `10_dir3_submit.png`

---

#### **4.5. DIR12 - Changes in Director Details**
1. Find: `POST /dir12/`
2. Submit:
   ```json
   {
     "company_id": 1,
     "director_din": "00123456",
     "change_type": "address",
     "effective_date": "2025-01-01"
   }
   ```
3. ✅ Verify: Success
4. 📸 **Screenshot:** `11_dir12_submit.png`

---

#### **4.6. INC22 - Company Registration**
1. Find: `POST /inc22/`
2. Submit:
   ```json
   {
     "company_name": "Test Pvt Ltd",
     "registration_date": "2025-01-01",
     "cin": "U12345MH2025PTC123456"
   }
   ```
3. ✅ Verify: Success
4. 📸 **Screenshot:** `12_inc22_submit.png`

---

#### **4.7. MGT14 - Resolutions Filing**
1. Find: `POST /mgt14/`
2. Submit:
   ```json
   {
     "company_id": 1,
     "resolution_type": "Board Resolution",
     "date_of_resolution": "2025-01-01"
   }
   ```
3. ✅ Verify: Success
4. 📸 **Screenshot:** `13_mgt14_submit.png`

---

#### **4.8. PAS3 - Return of Allotment**
1. Find: `POST /pas3/`
2. Submit:
   ```json
   {
     "company_id": 1,
     "allotment_date": "2025-01-01",
     "number_of_shares": 10000
   }
   ```
3. ✅ Verify: Success
4. 📸 **Screenshot:** `14_pas3_submit.png`

---

#### **4.9. SH7 - Notice of Change in Shareholding**
1. Find: `POST /sh7/`
2. Submit:
   ```json
   {
     "company_id": 1,
     "shareholder_name": "Alice Johnson",
     "shares_transferred": 1000,
     "transfer_date": "2025-01-01"
   }
   ```
3. ✅ Verify: Success
4. 📸 **Screenshot:** `15_sh7_submit.png`

---

#### **4.10. SH8 - Variation of Share Capital**
1. Find: `POST /sh8/`
2. Submit:
   ```json
   {
     "company_id": 1,
     "variation_type": "increase",
     "amount": 500000,
     "effective_date": "2025-01-01"
   }
   ```
3. ✅ Verify: Success
4. 📸 **Screenshot:** `16_sh8_submit.png`

---

### **Step 5: Phase 3+ Forms Testing** (20 minutes)

Test 5 additional forms from Phase 3+:

1. **DPT4** - `POST /dpt4/`
2. **AOC4** - `POST /aoc4/`
3. **MGT7A** - `POST /mgt7a/`
4. **NDH1** - `POST /ndh1/`
5. **MSME** - `POST /msme/`

For each:
- Submit with minimal valid data
- Verify 200/201 response
- Take screenshot

📸 **Screenshots:** `17-21_phase3_forms.png`

---

### **Step 6: Database Verification** (10 minutes)

After submitting forms, verify data persistence:

1. Open terminal/command prompt
2. Run:
   ```bash
   docker exec -it ops-db-1 psql -U comply -d comply
   ```
3. Query submitted data:
   ```sql
   SELECT * FROM adt1 ORDER BY id DESC LIMIT 5;
   SELECT * FROM ben2 ORDER BY id DESC LIMIT 5;
   SELECT * FROM chg1 ORDER BY id DESC LIMIT 5;
   ```
4. ✅ Verify: Data matches what you submitted
5. 📸 **Screenshot:** `22_database_verification.png`
6. Exit: `\q`

---

## 📊 **Test Summary Template**

Create a summary document with:

```markdown
# ComplyCrafter E2E Test Results
**Date:** [Current Date]
**Tested By:** [Your Name]
**Environment:** Local Development

## Test Results

### 1. Health Check
- Status: ✅ PASS
- Response Time: X ms
- Notes: Service healthy

### 2. Company Search (MCA API)
- Status: ✅ PASS
- Results Returned: X companies
- Response Time: X ms (cached)
- Notes: ILLUMINATI INNOVATION found

### 3. Authentication
- Signup: ✅ PASS
- Login: ✅ PASS
- Token Generated: ✅ YES
- Notes: Auth flow working

### 4. Phase 1 Forms (10 forms)
| Form | Code | Status | Response Time | Notes |
|------|------|--------|---------------|-------|
| Auditor Appointment | ADT1 | ✅ PASS | X ms | - |
| Beneficial Interest | BEN2 | ✅ PASS | X ms | - |
| Charge Registration | CHG1 | ✅ PASS | X ms | - |
| Director KYC | DIR3 | ✅ PASS | X ms | - |
| Director Changes | DIR12 | ✅ PASS | X ms | - |
| Company Registration | INC22 | ✅ PASS | X ms | - |
| Resolutions Filing | MGT14 | ✅ PASS | X ms | - |
| Return of Allotment | PAS3 | ✅ PASS | X ms | - |
| Shareholding Change | SH7 | ✅ PASS | X ms | - |
| Share Capital Variation | SH8 | ✅ PASS | X ms | - |

### 5. Phase 3+ Forms (5 forms)
| Form | Code | Status | Notes |
|------|------|--------|-------|
| DPT-4 | DPT4 | ✅ PASS | - |
| AOC-4 | AOC4 | ✅ PASS | - |
| MGT-7A | MGT7A | ✅ PASS | - |
| NDH-1 | NDH1 | ✅ PASS | - |
| MSME Form | MSME | ✅ PASS | - |

### 6. Database Verification
- Status: ✅ PASS
- Data Persisted: ✅ YES
- Data Integrity: ✅ VERIFIED

## Overall Summary
- **Total Tests:** 18
- **Passed:** X
- **Failed:** Y
- **Success Rate:** Z%

## Recommendations
1. [Any issues or improvements]
2. [Performance observations]
3. [Additional testing needed]

## Conclusion
[Overall assessment of system readiness]
```

---

## 🎯 **Quick Test (5 Minutes)**

If short on time, test these 3 endpoints:

1. ✅ `GET /healthz` - Health check
2. ✅ `GET /mca/search?query=illuminati` - Company search
3. ✅ `POST /adt1/` - Submit one form

This proves:
- Backend working
- Database connected
- MCA integration working
- Form submission working

---

## 📁 **Save Screenshots To:**
`/Users/aghoresgwarprasadsingh/Desktop/OHA Systems/Comply Crafter/Comply-Crafter-code/docs/testing/swagger-screenshots/`

---

## ✅ **Success Criteria**

Your backend is production-ready if:
- ✅ Health check passes
- ✅ 90%+ of forms work
- ✅ Data persists in database
- ✅ MCA search returns results
- ✅ Authentication works
- ✅ Response times < 500ms

---

## 🚀 **START TESTING NOW!**
**URL:** http://localhost:8100/docs

Let me know when you're done or if you encounter any issues!

