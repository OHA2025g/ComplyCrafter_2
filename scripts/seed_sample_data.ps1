# PowerShell script to seed sample data into the database
$ErrorActionPreference = "Continue"

Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Seeding Sample Data into Database" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Step 1: Seed Companies
Write-Host "Step 1: Seeding sample companies..." -ForegroundColor Yellow

$seedCompaniesSQL = @"
-- Insert sample companies
INSERT INTO user_companies (user_id, cin, company_name, company_status, company_class, added_at, is_active)
VALUES
  (1, 'U72900MH2015PTC123456', 'Tech Innovations Private Limited', 'Active', 'Private Limited', NOW() - INTERVAL '30 days', true),
  (1, 'U74999DL2018PTC234567', 'Global Solutions India Pvt Ltd', 'Active', 'Private Limited', NOW() - INTERVAL '25 days', true),
  (1, 'U51909MH2020PTC345678', 'Mumbai Trading Corporation', 'Active', 'Private Limited', NOW() - INTERVAL '20 days', true),
  (1, 'U65992KA2019PTC456789', 'Bangalore Finance Services Ltd', 'Active', 'Private Limited', NOW() - INTERVAL '15 days', true),
  (1, 'U74140TN2021PTC567890', 'Chennai Consulting Group', 'Inactive', 'Private Limited', NOW() - INTERVAL '10 days', false),
  (1, 'U85320GJ2022PTC678901', 'Gujarat Education Services', 'Active', 'Private Limited', NOW() - INTERVAL '5 days', true),
  (1, 'U60200MH2019PTC234567', 'PRIYA EXPRESS PRIVATE LIMITED', 'Active', 'Private Limited', NOW() - INTERVAL '40 days', true)
ON CONFLICT (user_id, cin) DO NOTHING;

SELECT COUNT(*) as "Companies Seeded" FROM user_companies WHERE user_id = 1;
"@

$seedCompaniesSQL | docker compose -f ops/docker-compose.yml exec -T db psql -U comply -d comply 2>&1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Companies seeded" -ForegroundColor Green
} else {
    Write-Host "  ⊘ Companies may already exist" -ForegroundColor Gray
}

Write-Host ""

# Step 2: Seed Masters Data (Directors, Shareholders, etc.)
Write-Host "Step 2: Seeding master data (Directors, Shareholders, Share Certificates, Debenture Holders)..." -ForegroundColor Yellow

Get-Content "services\forms\migrations\072_seed_master_data.sql" | docker compose -f ops/docker-compose.yml exec -T db psql -U comply -d comply 2>&1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Master data seeded" -ForegroundColor Green
} else {
    Write-Host "  ⊘ Master data may already exist" -ForegroundColor Gray
}

Write-Host ""

# Step 3: Seed Agendas and Meetings
Write-Host "Step 3: Seeding agendas and meetings data..." -ForegroundColor Yellow

$seedMeetingsSQL = @"
-- Seed Agendas
INSERT INTO agendas (company_id, agenda_title, description, meeting_type, status, created_date) VALUES
(1, 'Approve Annual Financial Statements', 'Review and approve financial statements for FY 2024-25', 'Board Meeting', 'Active', CURRENT_DATE),
(1, 'Appointment of Auditors', 'Discuss and approve statutory auditors', 'AGM', 'Active', CURRENT_DATE),
(1, 'Dividend Declaration', 'Propose final dividend for shareholders', 'Board Meeting', 'Completed', CURRENT_DATE - 30)
ON CONFLICT DO NOTHING;

-- Seed Shareholder Transactions
INSERT INTO shareholder_transactions (company_id, shareholder_name, folio_no, transaction_type, shares, transaction_date, status) VALUES
(1, 'Rajesh Kumar Sharma', 'FOL001', 'Transfer', 1000, '2024-10-15', 'Completed'),
(1, 'Priya Mehta', 'FOL002', 'Purchase', 500, '2024-11-01', 'Pending'),
(1, 'Tech Ventures LLP', 'FOL003', 'Sale', 250, '2024-10-20', 'Completed')
ON CONFLICT DO NOTHING;

-- Seed Authorized Capital
INSERT INTO authorized_capital (company_id, share_class, authorized_shares, face_value, total_amount, amendment_date) VALUES
(1, 'Equity Shares', 1000000, 10.00, 10000000.00, '2024-01-01'),
(1, 'Preference Shares', 200000, 100.00, 20000000.00, '2024-01-01')
ON CONFLICT DO NOTHING;

-- Seed Paid-up Capital
INSERT INTO paid_up_capital (company_id, share_class, paid_up_shares, face_value, total_amount, subscription_date) VALUES
(1, 'Equity Shares', 750000, 10.00, 7500000.00, '2024-01-15'),
(1, 'Preference Shares', 100000, 100.00, 10000000.00, '2024-01-15')
ON CONFLICT DO NOTHING;

-- Seed Share Capital
INSERT INTO share_capital (company_id, share_class, authorized_shares, paid_up_shares, face_value, status) VALUES
(1, 'Equity Shares', 1000000, 750000, 10.00, 'Active'),
(1, 'Preference Shares', 200000, 100000, 100.00, 'Active')
ON CONFLICT DO NOTHING;

-- Seed Board Meetings
INSERT INTO board_meetings (company_id, meeting_no, meeting_date, venue, attendees, status, agenda_items) VALUES
(1, 'BM-2024-01', '2024-11-15', 'Corporate Office, Mumbai', 8, 'Scheduled', 'Financial Review, Q3 Results'),
(1, 'BM-2024-02', '2024-10-10', 'Virtual Meeting', 8, 'Completed', 'Audit Committee Report'),
(1, 'BM-2024-03', '2024-12-20', 'Corporate Office, Mumbai', 8, 'Scheduled', 'Budget 2025, Strategic Planning')
ON CONFLICT DO NOTHING;

-- Seed AGM Meetings
INSERT INTO agm_meetings (company_id, financial_year, meeting_date, venue, shareholders, status, notice_sent_date) VALUES
(1, '2023-24', '2024-09-30', 'Convention Center, Mumbai', 150, 'Completed', '2024-09-01'),
(1, '2024-25', '2025-09-30', 'Convention Center, Mumbai', 0, 'Scheduled', NULL)
ON CONFLICT DO NOTHING;

-- Seed EGM Meetings
INSERT INTO egm_meetings (company_id, meeting_no, meeting_date, purpose, venue, status) VALUES
(1, 'EGM-2024-01', '2024-11-25', 'Approve merger proposal', 'Corporate Office, Mumbai', 'Scheduled'),
(1, 'EGM-2024-02', '2024-08-15', 'Increase in authorized capital', 'Virtual Meeting', 'Completed')
ON CONFLICT DO NOTHING;

-- Seed Committee Meetings
INSERT INTO committee_meetings (company_id, meeting_no, committee_type, meeting_date, venue, members, status) VALUES
(1, 'AC-2024-01', 'Audit Committee', '2024-11-10', 'Corporate Office', 4, 'Scheduled'),
(1, 'NC-2024-01', 'Nomination Committee', '2024-10-05', 'Virtual Meeting', 3, 'Completed'),
(1, 'SC-2024-01', 'Stakeholders Committee', '2024-11-20', 'Corporate Office', 3, 'Scheduled')
ON CONFLICT DO NOTHING;

SELECT 'Sample data seeding completed!' as message;
"@

$seedMeetingsSQL | docker compose -f ops/docker-compose.yml exec -T db psql -U comply -d comply 2>&1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Agendas and meetings seeded" -ForegroundColor Green
} else {
    Write-Host "  ⊘ Data may already exist" -ForegroundColor Gray
}

Write-Host ""

# Step 4: Verify data
Write-Host "Step 4: Verifying seeded data..." -ForegroundColor Yellow

$verifySQL = @"
SELECT 'Companies: ' || COUNT(*) FROM user_companies;
SELECT 'Directors: ' || COUNT(*) FROM directors;
SELECT 'Shareholders: ' || COUNT(*) FROM shareholders;
SELECT 'Share Certificates: ' || COUNT(*) FROM share_certificates;
SELECT 'Debenture Holders: ' || COUNT(*) FROM debenture_holders;
SELECT 'Agendas: ' || COUNT(*) FROM agendas;
SELECT 'Shareholder Transactions: ' || COUNT(*) FROM shareholder_transactions;
SELECT 'Board Meetings: ' || COUNT(*) FROM board_meetings;
SELECT 'AGM Meetings: ' || COUNT(*) FROM agm_meetings;
SELECT 'EGM Meetings: ' || COUNT(*) FROM egm_meetings;
SELECT 'Committee Meetings: ' || COUNT(*) FROM committee_meetings;
"@

Write-Host ""
$verifySQL | docker compose -f ops/docker-compose.yml exec -T db psql -U comply -d comply

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  ✓ Sample Data Seeding Complete!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""


