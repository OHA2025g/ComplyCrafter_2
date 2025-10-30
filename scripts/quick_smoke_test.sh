#!/bin/bash
#
# Quick Smoke Test - Verify all services are running
#

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo -e "${YELLOW}🔥 QUICK SMOKE TEST${NC}"
echo ""

# Test Database
echo -n "Database (PostgreSQL)... "
if docker exec ops-db-1 psql -U comply -d comply -c "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ RUNNING${NC}"
else
    echo -e "${RED}❌ DOWN${NC}"
fi

# Test Backend
echo -n "Backend (FastAPI)... "
if curl -s http://localhost:8100/healthz | grep -q "ok"; then
    echo -e "${GREEN}✅ RUNNING${NC}"
else
    echo -e "${RED}❌ DOWN${NC}"
fi

# Test Gateway
echo -n "Gateway... "
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/healthz 2>/dev/null | grep -q "200\|404"; then
    echo -e "${GREEN}✅ RUNNING${NC}"
else
    echo -e "${RED}❌ DOWN${NC}"
fi

# Test Frontend
echo -n "Frontend (Angular)... "
if curl -s -o /dev/null -w "%{http_code}" http://localhost:4200 2>/dev/null | grep -q "200\|304"; then
    echo -e "${GREEN}✅ RUNNING${NC}"
else
    echo -e "${RED}❌ DOWN${NC}"
fi

# Count tables
echo ""
echo -n "Database tables... "
table_count=$(docker exec ops-db-1 psql -U comply -d comply -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';" 2>/dev/null | tr -d '[:space:]')
echo -e "${GREEN}$table_count tables${NC}"

# Test sample form endpoints
echo ""
echo "Sample form endpoints:"
for form in adt1 ben2 dir3 chg1; do
    echo -n "  $form... "
    http_code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8100/forms/$form" 2>/dev/null)
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✅ HTTP $http_code${NC}"
    else
        echo -e "${YELLOW}⚠ HTTP $http_code${NC}"
    fi
done

echo ""
echo -e "${GREEN}✅ SMOKE TEST COMPLETE${NC}"
echo ""

