#!/bin/bash

# Script to seed sample companies
set -e

echo "═══════════════════════════════════════════════════════════════"
echo "  Seeding Sample Companies"
echo "═══════════════════════════════════════════════════════════════"

cd "$(dirname "$0")/../ops"

echo "📊 Adding sample companies to user_companies table..."

docker compose exec -T db psql -U comply -d comply <<'EOF'

-- Clear existing data (optional)
-- DELETE FROM user_companies;

-- Insert sample companies
INSERT INTO user_companies (user_id, cin, company_name, company_status, company_class, added_at, is_active)
VALUES
  (1, 'U72900MH2015PTC123456', 'Tech Innovations Private Limited', 'Active', 'Private Limited', NOW() - INTERVAL '30 days', true),
  (1, 'U74999DL2018PTC234567', 'Global Solutions India Pvt Ltd', 'Active', 'Private Limited', NOW() - INTERVAL '25 days', true),
  (1, 'U51909MH2020PTC345678', 'Mumbai Trading Corporation', 'Active', 'Private Limited', NOW() - INTERVAL '20 days', true),
  (1, 'U65992KA2019PTC456789', 'Bangalore Finance Services Ltd', 'Active', 'Private Limited', NOW() - INTERVAL '15 days', true),
  (1, 'U74140TN2021PTC567890', 'Chennai Consulting Group', 'Inactive', 'Private Limited', NOW() - INTERVAL '10 days', false),
  (1, 'U85320GJ2022PTC678901', 'Gujarat Education Services', 'Active', 'Private Limited', NOW() - INTERVAL '5 days', true)
ON CONFLICT (user_id, cin) DO NOTHING;

-- Show count
SELECT COUNT(*) as "Total Companies Seeded" FROM user_companies WHERE user_id = 1;

-- Show all companies
SELECT id, cin, company_name, company_status, is_active FROM user_companies WHERE user_id = 1 ORDER BY added_at DESC;

EOF

echo ""
echo "✅ Sample companies seeded successfully!"
echo ""
echo "🔧 Now restart the forms service:"
echo "   cd ops && docker compose restart forms"
echo ""
echo "🧪 Test the API:"
echo "   curl http://localhost:8100/companies/"
echo ""

