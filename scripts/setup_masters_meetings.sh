#!/bin/bash

# Script to setup Masters and Meetings database tables and seed data
# Usage: ./setup_masters_meetings.sh

set -e

echo "═══════════════════════════════════════════════════════════════════"
echo "  Masters & Meetings Database Setup"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

# Change to ops directory
cd "$(dirname "$0")/../ops"

echo "✅ Step 1: Running database migrations..."
echo "─────────────────────────────────────────────────────────────────"

# Run all 4 migrations
echo "📊 Creating agendas table..."
docker compose exec -T db psql -U comply -d comply < ../services/forms/migrations/066_create_agendas.sql

echo "📊 Creating shareholder_transactions table..."
docker compose exec -T db psql -U comply -d comply < ../services/forms/migrations/067_create_shareholder_transactions.sql

echo "📊 Creating capital structure tables..."
docker compose exec -T db psql -U comply -d comply < ../services/forms/migrations/068_create_capital_structure.sql

echo "📊 Creating meetings tables..."
docker compose exec -T db psql -U comply -d comply < ../services/forms/migrations/069_create_meetings.sql

echo ""
echo "✅ Step 2: Seeding sample data..."
echo "─────────────────────────────────────────────────────────────────"

# Seed data
cat <<'EOF' | docker compose exec -T db psql -U comply -d comply

-- Seed Agendas
INSERT INTO agendas (company_id, agenda_title, description, meeting_type, status, created_date) VALUES
(1, 'Approve Annual Financial Statements', 'Review and approve financial statements for FY 2024-25', 'Board Meeting', 'Active', CURRENT_DATE),
(1, 'Appointment of Auditors', 'Discuss and approve statutory auditors', 'AGM', 'Active', CURRENT_DATE),
(1, 'Dividend Declaration', 'Propose final dividend for shareholders', 'Board Meeting', 'Completed', CURRENT_DATE - 30);

-- Seed Shareholder Transactions
INSERT INTO shareholder_transactions (company_id, shareholder_name, folio_no, transaction_type, shares, transaction_date, status) VALUES
(1, 'John Smith', 'FOL001', 'Transfer', 1000, '2024-10-15', 'Completed'),
(1, 'Mary Johnson', 'FOL002', 'Purchase', 500, '2024-11-01', 'Pending'),
(1, 'Robert Williams', 'FOL003', 'Sale', 250, '2024-10-20', 'Completed');

-- Seed Authorized Capital
INSERT INTO authorized_capital (company_id, share_class, authorized_shares, face_value, total_amount, amendment_date) VALUES
(1, 'Equity Shares', 1000000, 10.00, 10000000.00, '2024-01-01'),
(1, 'Preference Shares', 200000, 100.00, 20000000.00, '2024-01-01');

-- Seed Paid-up Capital
INSERT INTO paid_up_capital (company_id, share_class, paid_up_shares, face_value, total_amount, subscription_date) VALUES
(1, 'Equity Shares', 750000, 10.00, 7500000.00, '2024-01-15'),
(1, 'Preference Shares', 100000, 100.00, 10000000.00, '2024-01-15');

-- Seed Share Capital
INSERT INTO share_capital (company_id, share_class, authorized_shares, paid_up_shares, face_value, status) VALUES
(1, 'Equity Shares', 1000000, 750000, 10.00, 'Active'),
(1, 'Preference Shares', 200000, 100000, 100.00, 'Active');

-- Seed Board Meetings
INSERT INTO board_meetings (company_id, meeting_no, meeting_date, venue, attendees, status, agenda_items) VALUES
(1, 'BM-2024-01', '2024-11-15', 'Corporate Office, Mumbai', 8, 'Scheduled', 'Financial Review, Q3 Results'),
(1, 'BM-2024-02', '2024-10-10', 'Virtual Meeting', 8, 'Completed', 'Audit Committee Report'),
(1, 'BM-2024-03', '2024-12-20', 'Corporate Office, Mumbai', 8, 'Scheduled', 'Budget 2025, Strategic Planning');

-- Seed AGM Meetings
INSERT INTO agm_meetings (company_id, financial_year, meeting_date, venue, shareholders, status, notice_sent_date) VALUES
(1, '2023-24', '2024-09-30', 'Convention Center, Mumbai', 150, 'Completed', '2024-09-01'),
(1, '2024-25', '2025-09-30', 'Convention Center, Mumbai', 0, 'Scheduled', NULL);

-- Seed EGM Meetings
INSERT INTO egm_meetings (company_id, meeting_no, meeting_date, purpose, venue, status) VALUES
(1, 'EGM-2024-01', '2024-11-25', 'Approve merger proposal', 'Corporate Office, Mumbai', 'Scheduled'),
(1, 'EGM-2024-02', '2024-08-15', 'Increase in authorized capital', 'Virtual Meeting', 'Completed');

-- Seed Committee Meetings
INSERT INTO committee_meetings (company_id, meeting_no, committee_type, meeting_date, venue, members, status) VALUES
(1, 'AC-2024-01', 'Audit Committee', '2024-11-10', 'Corporate Office', 4, 'Scheduled'),
(1, 'NC-2024-01', 'Nomination Committee', '2024-10-05', 'Virtual Meeting', 3, 'Completed'),
(1, 'SC-2024-01', 'Stakeholders Committee', '2024-11-20', 'Corporate Office', 3, 'Scheduled');

EOF

echo ""
echo "✅ Step 3: Verifying data..."
echo "─────────────────────────────────────────────────────────────────"

# Verify data
docker compose exec -T db psql -U comply -d comply <<'EOF'
SELECT 'Agendas: ' || COUNT(*) FROM agendas;
SELECT 'Shareholder Transactions: ' || COUNT(*) FROM shareholder_transactions;
SELECT 'Authorized Capital: ' || COUNT(*) FROM authorized_capital;
SELECT 'Paid-up Capital: ' || COUNT(*) FROM paid_up_capital;
SELECT 'Share Capital: ' || COUNT(*) FROM share_capital;
SELECT 'Board Meetings: ' || COUNT(*) FROM board_meetings;
SELECT 'AGM Meetings: ' || COUNT(*) FROM agm_meetings;
SELECT 'EGM Meetings: ' || COUNT(*) FROM egm_meetings;
SELECT 'Committee Meetings: ' || COUNT(*) FROM committee_meetings;
EOF

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "  ✅ Setup Complete!"
echo "═══════════════════════════════════════════════════════════════════"
echo ""
echo "📊 Database Tables Created:"
echo "  • agendas"
echo "  • shareholder_transactions"
echo "  • authorized_capital"
echo "  • paid_up_capital"
echo "  • share_capital"
echo "  • board_meetings"
echo "  • agm_meetings"
echo "  • egm_meetings"
echo "  • committee_meetings"
echo ""
echo "🌱 Sample Data Seeded:"
echo "  • 3 Agenda items"
echo "  • 3 Shareholder transactions"
echo "  • 2 Authorized capital entries"
echo "  • 2 Paid-up capital entries"
echo "  • 2 Share capital entries"
echo "  • 3 Board meetings"
echo "  • 2 AGM meetings"
echo "  • 2 EGM meetings"
echo "  • 3 Committee meetings"
echo ""
echo "🚀 API Endpoints Available:"
echo "  • GET /agendas"
echo "  • GET /shareholder-management"
echo "  • GET /capital/authorized"
echo "  • GET /capital/paid-up"
echo "  • GET /capital/share"
echo "  • GET /meetings/board"
echo "  • GET /meetings/agm"
echo "  • GET /meetings/egm"
echo "  • GET /meetings/committee"
echo ""
echo "🔧 Next Steps:"
echo "  1. Restart the forms service: docker compose restart forms"
echo "  2. Test endpoints: curl http://localhost:8100/agendas"
echo "  3. Frontend will auto-connect to these endpoints"
echo ""

