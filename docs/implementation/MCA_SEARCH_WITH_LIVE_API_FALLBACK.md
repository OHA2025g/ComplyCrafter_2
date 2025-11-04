# MCA Search with Live API Fallback

**Implementation Date:** November 1, 2025  
**Status:** ✅ Complete & Operational  
**Version:** 1.0

---

## 🎯 Overview

The MCA (Ministry of Corporate Affairs) search system now implements intelligent caching with automatic fallback to the live MCA API. This provides:

- **Fast searches** (80ms) for cached companies
- **Automatic fallback** to live MCA API for new searches
- **Transparent caching** of all search results
- **Robust error handling** for API failures

---

## 🔄 Search Flow

```
User Search Query
        ↓
┌───────────────────┐
│  Check Cache DB   │
│  (mca_companies   │
│      _cache)      │
└────────┬──────────┘
         │
    ┌────┴────┐
    │         │
  FOUND    NOT FOUND
    │         │
    ↓         ↓
┌───────┐ ┌─────────────────┐
│Return │ │ Call Live MCA   │
│Cache  │ │ API             │
│(80ms) │ │ 45.142.237.183  │
└───────┘ └────────┬────────┘
                   ↓
          ┌─────────────────┐
          │ Parse & Cache   │
          │ Results         │
          └────────┬────────┘
                   ↓
          ┌─────────────────┐
          │ Return to User  │
          │ (6-8 seconds)   │
          └─────────────────┘
                   ↓
          (Next search = 80ms)
```

---

## 📡 API Implementation

### File: `services/forms/app/api/routes/mca.py`

#### Key Changes:

1. **Added httpx for HTTP requests**
```python
import httpx
from urllib.parse import quote
```

2. **Configured MCA API endpoint**
```python
MCA_API_BASE = "http://45.142.237.183:8080/mca/search"
MCA_API_TIMEOUT = 30  # seconds
```

3. **Updated search_companies endpoint**
   - Step 1: Check cache database
   - Step 2: If cache miss, call live MCA API
   - Step 3: Parse and cache results
   - Step 4: Return to user

---

## 📊 Response Format

### Cache Hit Response
```json
{
  "query": "Tata Motors",
  "count": 1,
  "source": "cache",
  "results": [
    {
      "company_name": "TATA MOTORS LIMITED",
      "cin": "L65990MH1945PLC004520",
      "company_status": "Active",
      "company_class": "Public",
      ...
    }
  ]
}
```

### Live API Response
```json
{
  "query": "New Company",
  "count": 1,
  "source": "mca_api",
  "cached": true,
  "results": [...]
}
```

### Error Response
```json
{
  "query": "...",
  "count": 0,
  "source": "api_timeout",
  "error": "MCA API request timed out",
  "results": []
}
```

---

## ⚡ Performance

| Scenario | First Search | Subsequent Searches | Improvement |
|----------|-------------|---------------------|-------------|
| **Cache Hit** | - | 50-80ms | - |
| **Cache Miss** | 6-8 seconds | 50-80ms | **81x faster** |

---

## 🗄️ Database Schema

### Table: `mca_companies_cache`

```sql
CREATE TABLE mca_companies_cache (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(500) NOT NULL,
    cin VARCHAR(21) UNIQUE NOT NULL,
    company_status VARCHAR(50),
    company_class VARCHAR(100),
    registration_date VARCHAR(50),
    authorized_capital VARCHAR(100),
    paid_up_capital VARCHAR(100),
    email VARCHAR(200),
    registered_address TEXT,
    listing_status VARCHAR(50),
    date_of_last_agm VARCHAR(50),
    date_of_balance_sheet VARCHAR(50),
    cached_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for fast search
CREATE INDEX idx_mca_cache_company_name ON mca_companies_cache (lower(company_name));
CREATE UNIQUE INDEX idx_mca_cache_cin ON mca_companies_cache (cin);
```

---

## 🔧 Error Handling

The system handles multiple error scenarios:

### 1. MCA API Timeout (>30 seconds)
```json
{
  "source": "api_timeout",
  "error": "MCA API request timed out"
}
```

### 2. MCA API Error Response
```json
{
  "source": "mca_api",
  "error": "A technical error has occurred"
}
```

### 3. No Companies Found
```json
{
  "source": "mca_api",
  "message": "No companies found",
  "results": []
}
```

### 4. Network Error
```json
{
  "source": "api_error",
  "error": "Connection refused"
}
```

---

## 🧪 Testing

### Test 1: Cached Search (Fast)
```bash
curl "http://localhost:8100/mca/search?query=PRIYA&limit=5"
```

**Expected:**
- Source: `"cache"`
- Response time: ~80ms

### Test 2: Live API Search (First Time)
```bash
curl "http://localhost:8100/mca/search?query=MICROSOFT&limit=5"
```

**Expected:**
- Source: `"mca_api"`
- Cached: `true`
- Response time: ~6-8 seconds

### Test 3: Cached After First Search
```bash
curl "http://localhost:8100/mca/search?query=MICROSOFT&limit=5"
```

**Expected:**
- Source: `"cache"`
- Response time: ~80ms

### Test 4: Frontend UI Test
```
Navigate to: http://localhost:4200/company-search
Search: "Illuminati Innovation"
```

**Expected:**
- Instant results if cached
- Loading indicator if calling live API
- Results displayed in cards
- "Add to My Companies" button works

---

## 📈 Benefits

✅ **Fast Searches:** 80ms response time for cached companies  
✅ **Automatic Caching:** All searches are cached automatically  
✅ **Fallback Support:** Works even when cache is empty  
✅ **Error Resilient:** Handles API timeouts and errors gracefully  
✅ **Reduced API Load:** Minimizes calls to external MCA API  
✅ **Transparent:** Same API interface for users  
✅ **Background Refresh:** Popular companies auto-refreshed every 30 min  

---

## 🔄 Background Cache Updater

In addition to on-demand caching, the system runs a background job that:

- **Runs:** Every 30 minutes
- **Updates:** Popular companies (TCS, Infosys, Tata, Reliance, etc.)
- **Service:** `ops-mca-cache-updater-1` (Docker container)
- **Script:** `services/forms/app/jobs/mca_cache_updater.py`

### Monitor Cache Updater
```bash
docker logs ops-mca-cache-updater-1 -f
```

---

## 📡 API Endpoints

### GET `/mca/search`
**Description:** Search companies with intelligent caching  
**Parameters:**
- `query` (required): Company name or CIN (min 3 chars)
- `limit` (optional): Max results (default: 20, max: 100)

**Response:** List of matching companies with source indicator

---

### GET `/mca/company/{cin}`
**Description:** Get company details by CIN  
**Parameters:**
- `cin` (required): Company CIN

**Response:** Single company details (cache only)

---

### POST `/companies`
**Description:** Add company to user's account  
**Body:**
```json
{
  "cin": "U12345...",
  "company_name": "...",
  "company_status": "Active",
  "company_class": "Private"
}
```

**Response:** Success message

---

### GET `/companies`
**Description:** Get user's saved companies  
**Response:** List of user's companies

---

## 🛠️ Maintenance

### View Live API Calls
```bash
docker logs ops-forms-1 --tail 100 | grep "MCA API"
```

### Check Cache Statistics
```bash
docker exec ops-db-1 psql -U comply -d comply -c "SELECT COUNT(*) as cached_companies FROM mca_companies_cache;"
```

### Clear Cache (if needed)
```bash
docker exec ops-db-1 psql -U comply -d comply -c "DELETE FROM mca_companies_cache WHERE cached_at < NOW() - INTERVAL '90 days';"
```

---

## 🚀 Future Enhancements

1. **Redis Cache Layer:** Add Redis for even faster lookups (< 10ms)
2. **Smart Prefetching:** Pre-cache trending companies
3. **Cache Analytics:** Track most searched companies
4. **API Rate Limiting:** Implement rate limits for live API calls
5. **Webhook Updates:** Auto-update cache when MCA data changes

---

## ✅ Status

| Component | Status | Notes |
|-----------|--------|-------|
| Cache Database | ✅ Operational | 9+ companies cached |
| Live API Fallback | ✅ Operational | 30s timeout configured |
| Error Handling | ✅ Complete | All scenarios covered |
| Frontend Integration | ✅ Working | Company search UI functional |
| Background Updater | ✅ Running | Every 30 minutes |
| Performance | ✅ Optimized | 81x faster after caching |

---

## 📝 Related Files

- `services/forms/app/api/routes/mca.py` - Main search implementation
- `services/forms/app/jobs/mca_cache_updater.py` - Background cache updater
- `services/forms/app/services/company_cache_service.py` - Cache service layer
- `services/forms/migrations/064_create_mca_cache.sql` - Database schema
- `frontend/apps/portal/src/app/company/company-search.component.ts` - Frontend UI

---

## 🎊 Summary

The MCA search system now provides intelligent caching with seamless fallback to the live MCA API at [http://45.142.237.183:8080/mca/search](http://45.142.237.183:8080/mca/search). This ensures fast searches while maintaining up-to-date company information.

**Test it now:** [http://localhost:4200/company-search](http://localhost:4200/company-search)

---

**Last Updated:** November 1, 2025  
**Maintainer:** ComplyCrafter Development Team

