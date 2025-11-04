#!/bin/bash

# Script to update existing company data with incorporation dates
set -e

echo "═══════════════════════════════════════════════════════════════"
echo "  Updating Company Data with Incorporation Dates"
echo "═══════════════════════════════════════════════════════════════"

cd "$(dirname "$0")/../ops"

echo "📊 Updating existing companies..."

docker compose exec -T db psql -U comply -d comply <<'EOF'

-- Update existing companies with realistic incorporation dates
UPDATE user_companies SET incorporation_date = '2019-05-15' WHERE cin = 'U60200MH2019PTC234567';
UPDATE user_companies SET incorporation_date = '2015-03-20' WHERE cin = 'U72900MH2015PTC123456';
UPDATE user_companies SET incorporation_date = '2018-07-10' WHERE cin = 'U74999DL2018PTC234567';
UPDATE user_companies SET incorporation_date = '2020-01-25' WHERE cin = 'U51909MH2020PTC345678';
UPDATE user_companies SET incorporation_date = '2019-11-30' WHERE cin = 'U65992KA2019PTC456789';
UPDATE user_companies SET incorporation_date = '2021-06-18' WHERE cin = 'U74140TN2021PTC567890';
UPDATE user_companies SET incorporation_date = '2022-09-05' WHERE cin = 'U85320GJ2022PTC678901';

-- Show updated data
SELECT 
    cin, 
    company_name, 
    entity_type,
    incorporation_date,
    company_status 
FROM user_companies 
WHERE user_id = 1
ORDER BY added_at DESC;

-- Show count
SELECT COUNT(*) as "Total Entities" FROM user_companies WHERE user_id = 1 AND is_active = true;

EOF

echo ""
echo "✅ Company data updated successfully!"
echo ""

