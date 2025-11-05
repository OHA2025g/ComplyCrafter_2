# HTTPS Mixed Content & 307 Redirect Fix Summary

## 🎯 Root Causes Identified

### Issue 1: Mixed Content Errors
**Problem:** Frontend (HTTPS) → Backend API requests blocked as HTTP  
**Root Cause:** FastAPI 307 redirects were losing HTTPS scheme

### Issue 2: 307 Temporary Redirect
**Problem:** All POST requests getting 307 redirects  
**Root Cause:** Missing trailing slashes on API endpoints

### Issue 3: Missing Form Routes  
**Problem:** Only 11 forms working, others return 404  
**Root Cause:** Dynamic routes missing `/forms/` prefix

---

## ✅ All Fixes Applied

### Backend Fixes

#### 1. **Enable Proxy Header Trust** ✅
**Files Changed:**
- `services/forms/Dockerfile`
- `docker-compose.backend.yml`
- `ops/docker-compose.yml`

**What Changed:**
Added `--proxy-headers --forwarded-allow-ips "*"` to uvicorn command so FastAPI respects `X-Forwarded-Proto: https` from Nginx.

**Before:**
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8100
```

**After:**
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8100 --proxy-headers --forwarded-allow-ips "*"
```

#### 2. **Fix Dynamic Form Routes** ✅
**File Changed:** `services/forms/app/main.py`

**What Changed:**
Dynamic form routes now automatically get `/forms/` prefix if missing.

**Result:** All 51+ forms now available at `/forms/{formname}/`

---

### Frontend Fixes

#### 1. **Hardcoded HTTPS URLs** ✅
**Files Changed:**
- `frontend/apps/portal/src/environments/environment.ts`
- `frontend/apps/portal/src/environments/environment.prod.ts`

**What Changed:**
```typescript
// Before
apiUrl: ensureHttps('api.menindata.org')

// After
apiUrl: 'https://api.menindata.org'
```

#### 2. **Fixed Trailing Slash - Company Routes** ✅
**Files Changed:**
- `frontend/apps/portal/src/app/company/company-search.component.ts`
- `frontend/apps/portal/src/app/services/companies.service.ts`

**What Changed:**
```typescript
// Before
await this.http.post(`${this.API_BASE_URL}/companies`, data)

// After
await this.http.post(`${this.API_BASE_URL}/companies/`, data)
```

#### 3. **Fixed Trailing Slash - Generic Form Component** ✅
**File Changed:** `frontend/apps/portal/src/app/forms/generic-form/generic-form.component.ts`

**What Changed:**
Automatically adds trailing slash to all form submission endpoints.

```typescript
// Submit to backend API - ensure trailing slash for FastAPI
let endpoint = `${this.API_BASE_URL}${this.formConfig.apiEndpoint}`;
if (!endpoint.endsWith('/')) {
  endpoint += '/';
}
```

#### 4. **Fixed TypeScript Config** ✅
**File Changed:** `frontend/apps/portal/tsconfig.app.json`

**What Changed:**
Removed unnecessary `vite/client` type definition that was causing errors.

---

## 📦 Deployment Steps

### Step 1: Commit Changes to Git

```bash
cd C:\Users\pc\Downloads\Comply-Crafter-code

# Stage all changes
git add .

# Commit with descriptive message
git commit -m "Fix HTTPS Mixed Content errors and 307 redirects

- Enable proxy headers in uvicorn for HTTPS redirects
- Add trailing slashes to API endpoints
- Fix dynamic form route registration
- Hardcode HTTPS in environment configs
- Add trailing slash helper in form component
"

# Push to repository
git push origin clean-main
```

### Step 2: Deploy Backend Changes

**SSH into production server:**
```bash
ssh root@your-server-ip
cd /opt/complycrafter

# Pull latest changes
git pull origin clean-main

# Rebuild and restart backend with new uvicorn flags
docker-compose -f docker-compose.backend.yml down
docker-compose -f docker-compose.backend.yml up -d --build

# Check logs to verify all forms registered
docker logs complycrafter-forms --tail 100
```

**Expected in logs:**
```
✓ Registered route: chg1
✓ Registered route: chg4
✓ Registered route: form11
... (51+ forms)
```

### Step 3: Deploy Frontend Changes

```bash
# Still on server
cd frontend
rm -rf dist .nx/cache node_modules/.vite
npm run build

# Redeploy frontend container
cd ..
docker-compose -f docker-compose.frontend.yml up -d --build
```

### Step 4: Verify All Issues Fixed

**Test 1: Add Company**
1. Go to `https://menindata.org/company-search`
2. Search for "OHA"
3. Click "Add to My Companies"
4. ✅ Should work without errors

**Test 2: Submit Form**
1. Go to `https://menindata.org/forms/chg1`
2. Fill out form
3. Click "Submit Form"
4. ✅ Should work without 307 redirect

**Test 3: Verify All Forms Available**
1. Go to `https://api.menindata.org/docs`
2. ✅ Should see all 51+ forms under `/forms/` endpoints

---

## 🐛 What Was Causing Each Error

### Error: "Mixed Content: requested insecure XMLHttpRequest"
**Cause:** FastAPI redirected with HTTP instead of HTTPS  
**Fix:** Added `--proxy-headers` to trust Nginx's `X-Forwarded-Proto` header

### Error: "POST /companies HTTP/1.1 307 Temporary Redirect"
**Cause:** Missing trailing slash (`/companies` vs `/companies/`)  
**Fix:** Added trailing slashes to frontend API calls

### Error: "POST /forms/chg1 HTTP/1.1 404 Not Found"
**Cause:** Dynamic routes missing `/forms/` prefix  
**Fix:** Added prefix when registering dynamic routers

---

## 🎉 Expected Results After Deployment

✅ No more Mixed Content errors  
✅ No more 307 redirects  
✅ All 51+ forms accessible and working  
✅ Company add functionality works  
✅ All form submissions work  
✅ HTTPS enforced throughout

---

## 📋 Files Modified

**Backend (4 files):**
1. `services/forms/Dockerfile`
2. `services/forms/app/main.py`
3. `docker-compose.backend.yml`
4. `ops/docker-compose.yml`

**Frontend (6 files):**
1. `frontend/apps/portal/src/environments/environment.ts`
2. `frontend/apps/portal/src/environments/environment.prod.ts`
3. `frontend/apps/portal/src/app/company/company-search.component.ts`
4. `frontend/apps/portal/src/app/services/companies.service.ts`
5. `frontend/apps/portal/src/app/forms/generic-form/generic-form.component.ts`
6. `frontend/apps/portal/tsconfig.app.json`

---

## 🔍 How to Debug If Issues Persist

### Check backend logs:
```bash
docker logs complycrafter-forms -f
```

### Check if proxy headers are enabled:
```bash
docker exec complycrafter-forms ps aux | grep uvicorn
# Should show: --proxy-headers --forwarded-allow-ips *
```

### Test API directly:
```bash
curl -I https://api.menindata.org/forms/chg1/
# Should return 405 Method Not Allowed (POST required)
# NOT 307 Temporary Redirect
```

### Check browser console:
- Should see HTTPS URLs, not HTTP
- Should see 200/201 responses, not 307
- Should see no Mixed Content warnings

---

**Last Updated:** November 6, 2025  
**Status:** All fixes applied, ready for deployment

