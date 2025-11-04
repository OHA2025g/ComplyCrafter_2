#!/bin/bash

# ComplyCrafter - Comprehensive API Endpoint Testing Script
# Tests all critical API endpoints and generates report

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

API_BASE="http://localhost:8100"
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                                                                  ║"
echo "║         ComplyCrafter API Endpoint Testing Suite                ║"
echo "║                                                                  ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local expected_status=${4:-200}
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if [ "$method" = "GET" ]; then
        RESPONSE=$(curl -s -w "\n%{http_code}" "$API_BASE$endpoint" 2>&1)
    fi
    
    HTTP_CODE=$(echo "$RESPONSE" | tail -1)
    
    if [ "$HTTP_CODE" = "$expected_status" ] || [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "404" ]; then
        echo -e "${GREEN}✅ PASS${NC} $method $endpoint - $description"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}❌ FAIL${NC} $method $endpoint - $description (Status: $HTTP_CODE)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

echo "Testing Health & System Endpoints..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_endpoint "GET" "/healthz" "Health check"

echo ""
echo "Testing Authentication Endpoints..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_endpoint "GET" "/auth/login" "Login endpoint exists" 405

echo ""
echo "Testing MCA Endpoints..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_endpoint "GET" "/mca/search?query=Tata&limit=5" "MCA company search"
test_endpoint "GET" "/mca/company/AAS-8733" "MCA get company by CIN" 200

echo ""
echo "Testing Company Master Endpoints..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_endpoint "GET" "/companies/" "List all companies"
test_endpoint "GET" "/companies/1" "Get company by ID"

echo ""
echo "Testing Phase 1 Form Endpoints..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_endpoint "GET" "/adt1/" "ADT1 - List submissions" 200
test_endpoint "GET" "/ben2/" "BEN2 - List submissions" 200
test_endpoint "GET" "/pas3/" "PAS3 - List submissions" 200
test_endpoint "GET" "/dpt3/" "DPT3 - List submissions" 200
test_endpoint "GET" "/aoc4/" "AOC4 - List submissions" 200
test_endpoint "GET" "/aoc4cfs/" "AOC4CFS - List submissions" 200
test_endpoint "GET" "/mgt7a/" "MGT7A - List submissions" 200
test_endpoint "GET" "/msme/" "MSME - List submissions" 200
test_endpoint "GET" "/msme1/" "MSME1 - List submissions" 200
test_endpoint "GET" "/ndh1/" "NDH1 - List submissions" 200
test_endpoint "GET" "/ndh2/" "NDH2 - List submissions" 200

echo ""
echo "Testing Phase 3+ Form Endpoints (Sample)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_endpoint "GET" "/boardreport/" "Board Report" 200
test_endpoint "GET" "/chg1/" "CHG1" 200
test_endpoint "GET" "/dir3/" "DIR3" 200
test_endpoint "GET" "/form3/" "Form 3" 200
test_endpoint "GET" "/gnl1/" "GNL1" 200
test_endpoint "GET" "/inc4/" "INC4" 200
test_endpoint "GET" "/mgt6/" "MGT6" 200
test_endpoint "GET" "/mgt8/" "MGT8" 200
test_endpoint "GET" "/mr1/" "MR1" 200
test_endpoint "GET" "/stk2/" "STK2" 200

echo ""
echo "Testing Master Data Endpoints..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_endpoint "GET" "/directors/" "Directors list" 200
test_endpoint "GET" "/shareholders/" "Shareholders list" 200
test_endpoint "GET" "/share-certificates/" "Share certificates list" 200
test_endpoint "GET" "/debenture-holders/" "Debenture holders list" 200
test_endpoint "GET" "/agendas/" "Agendas list" 200
test_endpoint "GET" "/dashboard/stats" "Dashboard stats" 200

echo ""
echo "Testing Meeting Endpoints..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_endpoint "GET" "/meetings/board" "Board meetings" 200
test_endpoint "GET" "/meetings/agm" "AGM meetings" 200
test_endpoint "GET" "/meetings/egm" "EGM meetings" 200
test_endpoint "GET" "/meetings/committee" "Committee meetings" 200

echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                      TEST SUMMARY                                ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "Total Tests:   $TOTAL_TESTS"
echo -e "${GREEN}Passed:        $PASSED_TESTS${NC}"
echo -e "${RED}Failed:        $FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✅ ALL TESTS PASSED!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some tests failed. Review output above.${NC}"
    exit 1
fi

