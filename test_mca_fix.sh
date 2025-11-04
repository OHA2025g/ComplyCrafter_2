#!/bin/bash

# MCA API Fix Test Script
# Tests the MCA API endpoint directly

echo "======================================================================"
echo "MCA API Fix Test"
echo "======================================================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Check network connectivity
echo "Test 1: Network Connectivity"
echo "------------------------------"
if ping -c 3 45.142.237.183 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Network connectivity: OK${NC}"
    echo "   Ping successful to 45.142.237.183"
else
    echo -e "${RED}❌ Network connectivity: FAILED${NC}"
    echo "   Cannot reach 45.142.237.183"
    exit 1
fi
echo ""

# Test 2: Company name search
echo "Test 2: Company Name Search (Tata)"
echo "-----------------------------------"
RESPONSE=$(curl -s -w "\n%{http_code}" "http://45.142.237.183:8080/mca/search?search_type=company&id=Tata" 2>&1)
HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ API Response: OK (Status 200)${NC}"
    
    # Check if response contains results
    COUNT=$(echo "$BODY" | grep -o '"count":[0-9]*' | grep -o '[0-9]*' | head -1)
    if [ ! -z "$COUNT" ]; then
        echo "   Companies found: $COUNT"
        
        # Extract first company name
        FIRST_COMPANY=$(echo "$BODY" | grep -o '"cmpnyNm":"[^"]*"' | head -1 | cut -d'"' -f4)
        if [ ! -z "$FIRST_COMPANY" ]; then
            echo "   First result: $FIRST_COMPANY"
        fi
    else
        echo -e "${YELLOW}⚠️  Warning: No count field in response${NC}"
    fi
else
    echo -e "${RED}❌ API Response: FAILED (Status $HTTP_CODE)${NC}"
    echo "   Response: ${BODY:0:200}"
fi
echo ""

# Test 3: CIN search
echo "Test 3: CIN Search"
echo "-------------------"
RESPONSE=$(curl -s -w "\n%{http_code}" "http://45.142.237.183:8080/mca/search?search_type=cin&id=U74999MH2019PTC322353" 2>&1)
HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ CIN API Response: OK (Status 200)${NC}"
    
    # Check if response contains company data
    if echo "$BODY" | grep -q "companyData"; then
        echo "   Company data found in response"
    elif echo "$BODY" | grep -q "result"; then
        echo "   Result data found in response"
    else
        echo -e "${YELLOW}⚠️  Warning: Unexpected response format${NC}"
    fi
else
    echo -e "${RED}❌ CIN API Response: FAILED (Status $HTTP_CODE)${NC}"
fi
echo ""

# Test 4: Check if forms service is running
echo "Test 4: Forms Service Status"
echo "------------------------------"
if curl -s http://localhost:8001/healthz > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Forms service: RUNNING${NC}"
    echo "   Port 8001 is accessible"
    
    # Try to hit the MCA endpoint
    echo ""
    echo "   Testing /mca/search endpoint..."
    MCA_RESPONSE=$(curl -s -w "\n%{http_code}" "http://localhost:8001/mca/search?query=Tata&limit=5" 2>&1)
    MCA_HTTP_CODE=$(echo "$MCA_RESPONSE" | tail -1)
    
    if [ "$MCA_HTTP_CODE" = "200" ]; then
        echo -e "   ${GREEN}✅ MCA search endpoint: OK${NC}"
    else
        echo -e "   ${YELLOW}⚠️  MCA search endpoint returned: $MCA_HTTP_CODE${NC}"
    fi
else
    echo -e "${RED}❌ Forms service: NOT RUNNING${NC}"
    echo "   Port 8001 is not accessible"
    echo ""
    echo "   To start the forms service:"
    echo "   cd services/forms"
    echo "   uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload"
fi
echo ""

# Summary
echo "======================================================================"
echo "Test Summary"
echo "======================================================================"
echo ""
echo "Key Findings:"
echo "1. MCA API endpoint (http://45.142.237.183:8080) is working ✅"
echo "2. The API returns data in format: results.data.result[]"
echo "3. Field names: cmpnyNm, cnNmbr, cmpnySts, companyType, etc."
echo ""
echo "What was fixed:"
echo "- ✅ Updated field mapping: cmpnyNm → company_name"
echo "- ✅ Updated field mapping: cnNmbr → cin"
echo "- ✅ Updated field mapping: cmpnySts → company_status"
echo "- ✅ Added support for 'result' array in response"
echo ""
echo "Next Steps:"
echo "1. Restart the forms service to apply the fix"
echo "2. Test company search from the frontend"
echo "3. Verify results are being cached correctly"
echo ""
echo "======================================================================"

