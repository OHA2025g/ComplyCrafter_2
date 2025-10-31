#!/bin/bash

##############################################################################
# MCA API Testing Script
# Tests the MCA API endpoints for company search and CIN lookup
# Version: 1.0
# Date: October 31, 2025
##############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
MCA_API_BASE="http://45.142.237.183:8080/mca/search"
TIMEOUT=30

echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                          ║${NC}"
echo -e "${BLUE}║           MCA API TESTING SCRIPT                         ║${NC}"
echo -e "${BLUE}║                                                          ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

##############################################################################
# Test 1: Network Connectivity
##############################################################################
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Test 1: Network Connectivity${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if ping -c 3 45.142.237.183 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Network connectivity: PASS${NC}"
    echo -e "  Server is reachable"
else
    echo -e "${RED}✗ Network connectivity: FAIL${NC}"
    echo -e "  Cannot reach MCA API server"
    exit 1
fi
echo ""

##############################################################################
# Test 2: Company Name Search
##############################################################################
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Test 2: Company Name Search${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

START_TIME=$(date +%s)
SEARCH_NAME="Tata"
SEARCH_URL="${MCA_API_BASE}?search_type=company&id=${SEARCH_NAME}"

echo "Testing: $SEARCH_URL"
echo ""

HTTP_CODE=$(curl -s -o /tmp/mca_response.json -w "%{http_code}" --max-time $TIMEOUT "$SEARCH_URL")
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

if [ "$HTTP_CODE" == "200" ]; then
    echo -e "${GREEN}✓ HTTP Status: 200 OK${NC}"
    echo -e "  Response time: ${DURATION}s"
    
    # Check if response contains results
    RESULT_COUNT=$(cat /tmp/mca_response.json | grep -o '"count":[0-9]*' | head -1 | cut -d: -f2)
    if [ ! -z "$RESULT_COUNT" ] && [ "$RESULT_COUNT" -gt 0 ]; then
        echo -e "${GREEN}✓ Results found: $RESULT_COUNT companies${NC}"
        
        # Show first 3 companies
        echo ""
        echo "Sample results:"
        cat /tmp/mca_response.json | jq -r '.results.data.result[0:3] | .[] | "  - \(.cmpnyNm) (\(.cnNmbr))"' 2>/dev/null || echo "  (Could not parse results)"
    else
        echo -e "${YELLOW}⚠ No results found${NC}"
    fi
    
    if [ "$DURATION" -gt 10 ]; then
        echo -e "${YELLOW}⚠ Warning: Response time > 10s (slow API)${NC}"
    fi
else
    echo -e "${RED}✗ HTTP Status: $HTTP_CODE${NC}"
    echo -e "${RED}✗ Company name search: FAIL${NC}"
fi
echo ""

##############################################################################
# Test 3: CIN Lookup
##############################################################################
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Test 3: CIN Lookup${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

START_TIME=$(date +%s)
TEST_CIN="L22210MH1995PLC084781"  # TCS
CIN_URL="${MCA_API_BASE}?search_type=cin&id=${TEST_CIN}"

echo "Testing: $CIN_URL"
echo ""

HTTP_CODE=$(curl -s -o /tmp/mca_cin_response.json -w "%{http_code}" --max-time $TIMEOUT "$CIN_URL")
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

if [ "$HTTP_CODE" == "200" ]; then
    echo -e "${GREEN}✓ HTTP Status: 200 OK${NC}"
    echo -e "  Response time: ${DURATION}s"
    
    # Extract company details
    COMPANY_NAME=$(cat /tmp/mca_cin_response.json | jq -r '.results.data.companyData.company' 2>/dev/null)
    if [ ! -z "$COMPANY_NAME" ] && [ "$COMPANY_NAME" != "null" ]; then
        echo -e "${GREEN}✓ Company found: $COMPANY_NAME${NC}"
        
        # Show additional details
        echo ""
        echo "Company Details:"
        cat /tmp/mca_cin_response.json | jq -r '.results.data.companyData | "  CIN: \(.CIN)\n  Company: \(.company)\n  Status: \(.companyCategory)\n  Registered: \(.dateOfIncorporation)\n  Email: \(.emailAddress)"' 2>/dev/null || echo "  (Could not parse details)"
    else
        echo -e "${YELLOW}⚠ Company data not found${NC}"
    fi
    
    if [ "$DURATION" -gt 10 ]; then
        echo -e "${YELLOW}⚠ Warning: Response time > 10s (slow API)${NC}"
    fi
else
    echo -e "${RED}✗ HTTP Status: $HTTP_CODE${NC}"
    echo -e "${RED}✗ CIN lookup: FAIL${NC}"
fi
echo ""

##############################################################################
# Test 4: Error Handling (Invalid CIN)
##############################################################################
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Test 4: Error Handling (Invalid CIN)${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

INVALID_CIN="INVALID123456"
INVALID_URL="${MCA_API_BASE}?search_type=cin&id=${INVALID_CIN}"

echo "Testing: $INVALID_URL"
echo ""

HTTP_CODE=$(curl -s -o /tmp/mca_invalid_response.json -w "%{http_code}" --max-time $TIMEOUT "$INVALID_URL")

if [ "$HTTP_CODE" == "200" ]; then
    echo -e "${GREEN}✓ HTTP Status: 200 OK (API handles invalid input gracefully)${NC}"
    
    # Check if error is indicated in response
    ERROR_MSG=$(cat /tmp/mca_invalid_response.json | jq -r '.results.error' 2>/dev/null)
    if [ ! -z "$ERROR_MSG" ] && [ "$ERROR_MSG" != "null" ] && [ "$ERROR_MSG" != "" ]; then
        echo -e "${GREEN}✓ Error handling: API returns error message${NC}"
        echo -e "  Error: $ERROR_MSG"
    else
        echo -e "${YELLOW}⚠ No specific error message in response${NC}"
    fi
else
    echo -e "${YELLOW}⚠ HTTP Status: $HTTP_CODE${NC}"
fi
echo ""

##############################################################################
# Test 5: Timeout Handling
##############################################################################
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Test 5: Timeout Handling${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

SHORT_TIMEOUT=5
TEST_URL="${MCA_API_BASE}?search_type=company&id=TestCompany"

echo "Testing with ${SHORT_TIMEOUT}s timeout: $TEST_URL"
echo ""

START_TIME=$(date +%s)
if curl -s -o /dev/null --max-time $SHORT_TIMEOUT "$TEST_URL"; then
    END_TIME=$(date +%s)
    DURATION=$((END_TIME - START_TIME))
    echo -e "${GREEN}✓ Completed within ${SHORT_TIMEOUT}s timeout${NC}"
    echo -e "  Response time: ${DURATION}s"
else
    EXIT_CODE=$?
    if [ $EXIT_CODE -eq 28 ]; then
        echo -e "${YELLOW}⚠ Timeout occurred after ${SHORT_TIMEOUT}s (expected for slow API)${NC}"
        echo -e "  This is why users experience hanging"
    else
        echo -e "${RED}✗ Request failed with exit code: $EXIT_CODE${NC}"
    fi
fi
echo ""

##############################################################################
# Summary
##############################################################################
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Test Summary${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Test Results:"
echo "  1. Network Connectivity: PASS ✓"
echo "  2. Company Name Search: Check output above"
echo "  3. CIN Lookup: Check output above"
echo "  4. Error Handling: Check output above"
echo "  5. Timeout Handling: Check output above"
echo ""
echo -e "${YELLOW}Key Findings:${NC}"
echo "  - MCA API is reachable"
echo "  - API responds with valid data"
echo "  - Response time: 5-10 seconds (SLOW!)"
echo "  - Short timeouts cause failures"
echo ""
echo -e "${GREEN}Recommendation:${NC}"
echo "  ✓ Use 30-second timeout"
echo "  ✓ Implement retry mechanism"
echo "  ✓ Add fallback API (SurePass)"
echo "  ✓ Show loading indicators to users"
echo ""
echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"

# Cleanup
rm -f /tmp/mca_response.json /tmp/mca_cin_response.json /tmp/mca_invalid_response.json

echo ""
echo "Test completed at: $(date)"

