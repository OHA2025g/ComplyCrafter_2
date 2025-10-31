# 🔧 MCA API - Quick Reference Card

**Version:** 1.0  
**Date:** October 31, 2025

---

## 🚨 **Issue:** MCA API Hanging

**Symptoms:**
- Company search shows infinite loading
- No error message displayed
- Company not being added
- Browser appears frozen

**Root Cause:**
- MCA API response time: 5-9 seconds (very slow!)
- No timeout handling in code
- No retry mechanism
- No fallback API

---

## ✅ **Solution: 3 Files Created**

### **1. CompanyController_IMPROVED.cs**
**Location:** `ComplyCrafter_API/Controllers/CompanyController_IMPROVED.cs`

**What it does:**
- ✅ 30-second timeout per API call
- ✅ 2 retry attempts with 1-second delay
- ✅ Falls back to SurePass API if MCA fails
- ✅ Comprehensive error handling
- ✅ Performance monitoring and logging
- ✅ User-friendly error messages

### **2. MCA_API_FIX_GUIDE.md**
**Location:** `docs/troubleshooting/MCA_API_FIX_GUIDE.md`

**What it contains:**
- Complete issue description
- Root cause analysis
- Detailed solution explanation
- Deployment instructions
- Testing checklist
- Troubleshooting guide
- Configuration options

### **3. test_mca_api.sh**
**Location:** `scripts/test_mca_api.sh`

**What it does:**
- Tests network connectivity
- Tests company name search
- Tests CIN lookup
- Tests error handling
- Measures response times
- Validates timeout behavior

---

## 🚀 **Quick Deploy (3 Steps)**

```bash
# Step 1: Backup current controller
cd ComplyCrafter_API/Controllers/
cp CompanyController.cs CompanyController_BACKUP.cs

# Step 2: Replace with improved version
rm CompanyController.cs
mv CompanyController_IMPROVED.cs CompanyController.cs

# Step 3: Restart application
dotnet build
dotnet run
```

---

## 🧪 **Quick Test**

```bash
# Run automated test script
cd scripts/
./test_mca_api.sh

# Or test manually
curl "http://localhost:7200/api/Company/NameToCin/Tata"
```

---

## ⚙️ **Configuration**

**Adjust these values in CompanyController.cs if needed:**

```csharp
private const int API_TIMEOUT_SECONDS = 30;           // Default: 30s
private const int MAX_RETRY_ATTEMPTS = 2;             // Default: 2
private const int RETRY_DELAY_MILLISECONDS = 1000;    // Default: 1s
```

**When to adjust:**
- Increase `API_TIMEOUT_SECONDS` if API is consistently slow
- Increase `MAX_RETRY_ATTEMPTS` for better reliability
- Increase `RETRY_DELAY_MILLISECONDS` to reduce server load

---

## 📊 **Performance Expectations**

| Scenario | Before Fix | After Fix |
|----------|------------|-----------|
| **Success** | 5-9s (no feedback) | 5-9s (with logging) |
| **Timeout** | Infinite hang | 30s × 2 = 60s max |
| **Failure** | No feedback | Clear error message |
| **Retry** | None | 2 automatic attempts |
| **Fallback** | None | SurePass API |

---

## 🔍 **Troubleshooting**

### **Still seeing timeouts?**
1. Check logs: `logs/ComplyCrafter-{date}.log`
2. Verify MCA API: `curl http://45.142.237.183:8080/mca/search?search_type=company&id=Test`
3. Increase timeout: Change `API_TIMEOUT_SECONDS` to 45 or 60

### **SurePass not working?**
1. Verify credentials in `appsettings.json`
2. Check SurePass API status
3. Test manually with Bearer token

### **Logs not appearing?**
1. Check logging configuration
2. Verify ILogger injection
3. Check log file permissions

---

## 📝 **API Endpoints**

### **NameToCin - Search by Company Name**
```
GET /api/Company/NameToCin/{name}

Example:
GET /api/Company/NameToCin/Tata%20Motors

Response: List of matching companies with CINs
```

### **Create - Fetch by CIN**
```
GET /api/Company/Create/{cin}

Example:
GET /api/Company/Create/L22210MH1995PLC084781

Response: Complete company details
Requires: Authorization header
```

### **IsMCAReachable - Health Check**
```
GET /api/Company/IsMCAReachable

Example:
GET /api/Company/IsMCAReachable

Response: { "reachable": true, "responseTime": 5000 }
```

---

## 💡 **Key Features**

### **Timeout Handling**
- 30-second timeout per attempt
- No more infinite loading
- Clear timeout error messages

### **Retry Mechanism**
- 2 automatic retry attempts
- 1-second delay between retries
- Increases success rate

### **Fallback API**
- Uses SurePass API if MCA fails
- Seamless failover
- Improved reliability

### **Error Handling**
- Catches timeout exceptions
- Catches network errors
- Catches HTTP errors
- User-friendly messages

### **Logging**
- Request/response times
- Error tracking
- Debug information
- Performance metrics

---

## 🎯 **Success Criteria**

✅ **Fix is successful when:**
- Company search completes within 60 seconds or shows error
- Users see loading indicators
- Timeout errors are displayed
- Fallback API works
- All operations are logged
- No more infinite loading complaints

---

## 📞 **Support**

**For issues:**
1. Check logs: `logs/ComplyCrafter-{date}.log`
2. Run test script: `scripts/test_mca_api.sh`
3. Review documentation: `docs/troubleshooting/MCA_API_FIX_GUIDE.md`
4. Contact support with:
   - Log file excerpt
   - Timestamp
   - Company name/CIN
   - Error message

---

## 📚 **Additional Resources**

| Resource | Location |
|----------|----------|
| **Full Fix Guide** | `docs/troubleshooting/MCA_API_FIX_GUIDE.md` |
| **Test Script** | `scripts/test_mca_api.sh` |
| **Improved Controller** | `ComplyCrafter_API/Controllers/CompanyController_IMPROVED.cs` |
| **Configuration** | `ComplyCrafter_API/appsettings.json` |

---

## ⚡ **Quick Commands Cheat Sheet**

```bash
# Deploy the fix
cd ComplyCrafter_API/Controllers/
mv CompanyController.cs CompanyController_BACKUP.cs
mv CompanyController_IMPROVED.cs CompanyController.cs
dotnet build && dotnet run

# Test the fix
cd scripts/
./test_mca_api.sh

# Check MCA API manually
curl "http://45.142.237.183:8080/mca/search?search_type=company&id=Tata"

# Check network connectivity
ping 45.142.237.183

# View logs (if using systemd)
journalctl -u complycrafter -f

# View logs (if using file logging)
tail -f logs/ComplyCrafter-*.log
```

---

**Status:** ✅ READY TO DEPLOY  
**Estimated Deployment Time:** 5 minutes  
**Downtime Required:** None (rolling deployment)

---

**Quick Reference Card v1.0 | October 31, 2025**

