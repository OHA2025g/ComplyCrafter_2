#!/bin/bash
#
# Frontend Testing Script
# Tests all frontend components and routing
#

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║           FRONTEND COMPONENT TESTING                         ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

FRONTEND_URL="http://localhost:4200"
TOTAL=0
PASSED=0

# Test function
test_route() {
    local name=$1
    local route=$2
    TOTAL=$((TOTAL + 1))
    
    http_code=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL$route" 2>/dev/null)
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "304" ]; then
        echo -e "  ${GREEN}✅${NC} $name: Route accessible (HTTP $http_code)"
        PASSED=$((PASSED + 1))
        return 0
    else
        echo -e "  ${RED}❌${NC} $name: Route failed (HTTP $http_code)"
        return 1
    fi
}

echo "Testing authentication routes..."
test_route "Login" "/forms/login"
test_route "Signup" "/forms/signup"

echo ""
echo "Testing form routes..."
test_route "Forms Directory" "/forms"
test_route "ADT1" "/forms/adt1"
test_route "BEN2" "/forms/ben2"
test_route "PAS3" "/forms/pas3"
test_route "DPT3" "/forms/dpt3"
test_route "DIR3" "/forms/dir3"
test_route "CHG1" "/forms/chg1"
test_route "MGT14" "/forms/mgt14"
test_route "INC4" "/forms/inc4"
test_route "SH7" "/forms/sh7"

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  Total Routes Tested: $TOTAL"
echo -e "  Routes Accessible:   ${GREEN}$PASSED${NC}"
echo -e "  Success Rate:        ${GREEN}$((PASSED * 100 / TOTAL))%${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ $PASSED -eq $TOTAL ]; then
    echo -e "${GREEN}✅ ALL FRONTEND ROUTES WORKING!${NC}"
    exit 0
else
    echo -e "${RED}❌ SOME ROUTES FAILED${NC}"
    exit 1
fi

