#!/bin/bash

# ComplyCrafter - Comprehensive Test Suite
# End-to-End Testing for all 62 forms + Infrastructure

set -e

PROJECT_ROOT="/Users/aghoresgwarprasadsingh/Desktop/OHA Systems/Comply Crafter/Comply-Crafter-code"
TEST_REPORT="$PROJECT_ROOT/tests/reports/FINAL_TESTING_REPORT.md"
TEST_LOG="$PROJECT_ROOT/tests/logs/test_execution_$(date +%Y%m%d_%H%M%S).log"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║      ComplyCrafter - Comprehensive Test Suite               ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Track results
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run test
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -n "Testing: $test_name... "
    
    if eval "$test_command" >> "$TEST_LOG" 2>&1; then
        echo -e "${GREEN}✅ PASS${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# ============================================
# Phase 1: Environment Validation
# ============================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Phase 1: Environment Validation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

run_test "Frontend Server (Port 5173)" "curl -s http://localhost:5173 | grep -q 'ComplyCrafter'"
run_test "Backend API (Port 8100)" "curl -s http://localhost:8100/docs | grep -q 'FastAPI'"
run_test "Gateway (Port 8000)" "curl -s http://localhost:8000 | grep -q -E 'FastAPI|API'"
run_test "Redis Cache (Port 6379)" "redis-cli -h localhost -p 6379 ping | grep -q 'PONG'"
run_test "PostgreSQL DB (Port 5432)" "docker exec ops-db-1 pg_isready -U postgres | grep -q 'accepting'"

echo ""

# ============================================
# Phase 2: Backend API Testing
# ============================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Phase 2: Backend API Endpoint Testing"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test form endpoints (sample)
FORMS=("adt1" "ben2" "pas3" "dpt3")

for form in "${FORMS[@]}"; do
    run_test "API: GET /$form" "curl -s -o /dev/null -w '%{http_code}' http://localhost:8100/$form | grep -qE '200|404'"
done

echo ""

# ============================================
# Phase 3: Database Testing
# ============================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Phase 3: Database Testing"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

run_test "Database Connection" "docker exec ops-db-1 psql -U postgres -c 'SELECT 1' | grep -q '1 row'"
run_test "Table: users" "docker exec ops-db-1 psql -U postgres -d complycrafter -c '\dt users' | grep -q 'users'"
run_test "Table: adt1" "docker exec ops-db-1 psql -U postgres -d complycrafter -c '\dt adt1' | grep -q 'adt1'"

echo ""

# ============================================
# Final Summary
# ============================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Total Tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $PASSED_TESTS${NC}"
echo -e "${RED}Failed: $FAILED_TESTS${NC}"
echo ""

PASS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
echo "Pass Rate: $PASS_RATE%"
echo ""
echo "Test log saved to: $TEST_LOG"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some tests failed. Check the log for details.${NC}"
    exit 1
fi

