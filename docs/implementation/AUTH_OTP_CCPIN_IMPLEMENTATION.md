# Authentication Revamp: Mobile OTP + CCPIN Implementation

## Overview

This document describes the complete implementation of three major authentication features:
1. **Phone Number OTP Verification During Signup**
2. **CCPIN Creation During Signup**
3. **Login Using CCPIN OR Password**

## Implementation Summary

### Database Changes

#### Migration: `074_add_otp_ccpin_phone.sql`
- Added columns to `user_accounts` table:
  - `first_name VARCHAR(100)`
  - `last_name VARCHAR(100)`
  - `phone_number VARCHAR(20)` (indexed)
  - `phone_verified BOOLEAN DEFAULT FALSE`
  - `ccpin_hash VARCHAR(255)`

- Created `otp_verifications` table:
  - `id SERIAL PRIMARY KEY`
  - `phone_number VARCHAR(20) NOT NULL` (indexed)
  - `otp_code VARCHAR(6) NOT NULL`
  - `expires_at TIMESTAMP NOT NULL` (indexed)
  - `verified BOOLEAN DEFAULT FALSE`
  - `created_at TIMESTAMP DEFAULT NOW()`
  - `verified_at TIMESTAMP NULL`

### Backend Changes

#### New Models
1. **OTPVerification Model** (`app/models/otp_verification.py`)
   - Stores OTP codes with expiration
   - Tracks verification status

#### Updated Models
1. **UserAccount Model** (`app/models/user_account.py`)
   - Added: `first_name`, `last_name`, `phone_number`, `phone_verified`, `ccpin_hash`

#### New Services
1. **OTPService** (`app/services/otp_service.py`)
   - `send_otp(phone_number)` - Generates and stores 6-digit OTP (10 min expiry) and dispatches via MobiLogic SMS API
   - `verify_otp(phone_number, otp_code)` - Verifies OTP
   - `is_otp_verified(phone_number)` - Checks if phone has verified OTP
   - Phone validation: Exactly 10 digits

#### Updated Services
1. **AuthService** (`app/services/auth_service.py`)
   - Updated `create_user()` to accept: first_name, last_name, phone_number, ccpin
   - Added `_hash_ccpin()` and `_verify_ccpin()` functions
   - Updated `verify_user()` to accept either password OR ccpin
   - Validates duplicate phone numbers

#### New API Endpoints

1. **POST `/auth/send-otp`**
   - Request: `{ "phone_number": "9876543210", "template_id": "optional", "name": "optional" }`
   - Response: `{ "message": "OTP sent successfully" }`
   - Validates phone number (10 digits)
   - Generates 6-digit OTP
    - Stores OTP with 10-minute expiry and enforces 60-second resend cooldown

2. **POST `/auth/verify-otp`**
   - Request: `{ "phone_number": "9876543210", "otp": "123456" }`
   - Response: `{ "message": "OTP verified successfully" }`
   - Validates OTP code
   - Marks OTP as verified

#### Updated API Endpoints

1. **POST `/auth/signup`**
   - **New Required Fields:**
     - `first_name` (string, required)
     - `last_name` (string, required)
     - `phone_number` (string, 10 digits, required)
     - `ccpin` (string, 4 digits, required)
     - `confirm_ccpin` (string, 4 digits, must match ccpin)
   
   - **Validation:**
     - Phone number must be verified with OTP before signup
     - CCPIN must be exactly 4 digits
     - CCPIN and confirm_ccpin must match
     - Email must be valid and unique
     - Phone number must be unique
     - Password must be at least 8 characters

2. **POST `/auth/login`**
   - **Updated Request Format:**
     ```json
     {
       "email": "user@example.com",
       "password": "optional",
       "ccpin": "optional"
     }
     ```
   
   - **Login Logic:**
     - Either `password` OR `ccpin` must be provided (not both required)
     - If password provided → validates password hash
     - If ccpin provided → validates ccpin_hash
     - Returns JWT token on success

#### Updated Schemas (`app/schemas/auth.py`)

1. **SignupRequest** - Added fields:
   - `first_name`, `last_name`, `phone_number`, `ccpin`, `confirm_ccpin`

2. **New Schemas:**
   - `SendOTPRequest` - `{ "phone_number": "...", "template_id": "optional", "name": "optional" }`
   - `VerifyOTPRequest` - `{ "phone_number": "...", "otp": "..." }`

3. **LoginRequest** - Updated:
   - `email` (required)
   - `password` (optional)
   - `ccpin` (optional)

### Frontend Changes

#### Signup Component (`frontend/apps/portal/src/app/auth/signup/signup.component.ts`)

**New Features:**
1. **First Name & Last Name fields**
2. **Phone Number field with Send OTP button**
   - Validates 10-digit phone number
   - Sends OTP on button click
   - Shows countdown timer (10 minutes)
   - Resend button with countdown
3. **OTP Input field**
   - Appears after OTP is sent
   - 6-digit numeric input
   - Verify OTP button
   - Shows expiration countdown
4. **CCPIN fields**
   - Create CCPIN (4 digits, masked)
   - Confirm CCPIN (4 digits, masked)
   - Validates match
   - Numeric-only input

**Form Validation:**
- All fields required
- Phone: Exactly 10 digits
- OTP: Must be verified before signup
- CCPIN: Exactly 4 digits, must match confirm

#### Login Component (`frontend/apps/portal/src/app/auth/login/login.component.ts`)

**New Features:**
1. **Email field** (replaces username/email)
2. **Password field** (optional)
3. **OR divider**
4. **CC PIN field** (4 digits, masked, optional)

**Login Logic:**
- If password entered → uses password authentication
- If CCPIN entered → uses CCPIN authentication
- If both empty → shows error
- Validates CCPIN format (4 digits)

## Testing

### Test Script: `scripts/test_auth_flows.py`

Comprehensive test suite covering:
- ✅ Send OTP with valid/invalid phone
- ✅ Verify OTP (correct/wrong/expired)
- ✅ Signup with CCPIN validation
- ✅ Login with password
- ✅ Login with CCPIN
- ✅ Edge cases (duplicate email/phone, invalid formats, missing fields)

**Run Tests:**
```bash
python scripts/test_auth_flows.py
```

## Security Features

1. **OTP Security:**
   - 6-digit random OTP
   - 10-minute expiration
   - One-time use (marked as verified)
   - Phone number validation

2. **CCPIN Security:**
   - Hashed using SHA-256 (same as password)
   - Stored as `ccpin_hash` in database
   - Never stored in plain text

3. **Password Security:**
   - Minimum 8 characters
   - Must include letters and numbers
   - Hashed with salt

4. **Validation:**
   - Phone number: Exactly 10 digits
   - CCPIN: Exactly 4 digits
   - Email: Valid format, unique
   - OTP: Must be verified before signup

## API Usage Examples

### Complete Signup Flow

1. **Send OTP:**
```bash
curl -X POST http://localhost:8100/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "9876543210",
    "template_id": "1207175405379469327",
    "name": "Jane Doe"
  }'
```

2. **Verify OTP:**
```bash
curl -X POST http://localhost:8100/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone_number": "9876543210", "otp": "123456"}'
```

3. **Signup:**
```bash
curl -X POST http://localhost:8100/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test@123456",
    "first_name": "Test",
    "last_name": "User",
    "phone_number": "9876543210",
    "ccpin": "1234",
    "confirm_ccpin": "1234"
  }'
```

### Login Flow

**Login with Password:**
```bash
curl -X POST http://localhost:8100/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123456"
  }'
```

**Login with CCPIN:**
```bash
curl -X POST http://localhost:8100/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "ccpin": "1234"
  }'
```

## Migration Instructions

1. **Run Database Migration:**
```bash
# Apply migration 074_add_otp_ccpin_phone.sql
psql -d your_database -f services/forms/migrations/074_add_otp_ccpin_phone.sql
```

2. **Restart Backend Service:**
```bash
# Backend will automatically load new models and routes
```

3. **Rebuild Frontend (if needed):**
```bash
cd frontend
npm run build
```

## Notes

- **OTP Delivery:** Integrated with MobiLogic SMS API using approved DLT templates, URL-encoded payloads, and retry logic.
- **Token Generation:** Currently uses mock tokens. Replace with proper JWT implementation.
- **Phone Validation:** Accepts exactly 10 digits (no country code).
- **CCPIN:** 4-digit numeric PIN, masked like password in UI.

## Files Modified/Created

### Backend
- `services/forms/migrations/074_add_otp_ccpin_phone.sql` (NEW)
- `services/forms/app/models/otp_verification.py` (NEW)
- `services/forms/app/models/user_account.py` (UPDATED)
- `services/forms/app/services/otp_service.py` (NEW)
- `services/forms/app/services/auth_service.py` (UPDATED)
- `services/forms/app/schemas/auth.py` (UPDATED)
- `services/forms/app/api/routes/auth.py` (UPDATED)

### Frontend
- `frontend/apps/portal/src/app/auth/signup/signup.component.ts` (UPDATED)
- `frontend/apps/portal/src/app/auth/login/login.component.ts` (UPDATED)

### Testing
- `scripts/test_auth_flows.py` (NEW)

## Future Enhancements

1. Add delivery-status webhooks / reporting for MobiLogic responses
2. Fine-tune adaptive rate limiting & introduce per-IP throttles
3. Implement proper JWT token generation
4. Add OTP resend functionality with cooldown
5. Add phone number country code support
6. Add 2FA using CCPIN for sensitive operations

