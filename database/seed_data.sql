-- ============================================================================
-- ComplyCrafter Database Seed Data Script
-- This script populates the database with sample data for testing
-- ============================================================================

-- ============================================================================
-- USER ACCOUNTS
-- ============================================================================

-- Insert sample users (password_hash is bcrypt hash of "password123")
-- Note: trial_ends_at is set to 14 days from creation, subscription_expires_at is set for active subscriptions
INSERT INTO user_accounts (username, email, password_hash, first_name, last_name, profession, firm_name, phone_number, phone_verified, is_active, subscription_status, subscription_plan, trial_ends_at, subscription_expires_at)
VALUES
    ('admin', 'admin@complycrafter.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5Y5u', 'Admin', 'User', 'Company Secretary', 'ComplyCrafter Solutions', '+91-9876543210', TRUE, TRUE, 'active', 'enterprise', NOW() + INTERVAL '14 days', NOW() + INTERVAL '1 year'),
    ('john.doe', 'john.doe@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5Y5u', 'John', 'Doe', 'Chartered Accountant', 'Doe & Associates', '+91-9876543211', TRUE, TRUE, 'active', 'professional', NOW() + INTERVAL '14 days', NOW() + INTERVAL '6 months'),
    ('jane.smith', 'jane.smith@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5Y5u', 'Jane', 'Smith', 'Company Secretary', 'Smith Legal Services', '+91-9876543212', FALSE, TRUE, 'trial', NULL, NOW() + INTERVAL '14 days', NULL),
    ('robert.wilson', 'robert.wilson@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5Y5u', 'Robert', 'Wilson', 'Corporate Lawyer', 'Wilson & Partners', '+91-9876543213', TRUE, TRUE, 'trial', NULL, NOW() + INTERVAL '10 days', NULL)
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- USER COMPANIES
-- ============================================================================

-- Insert sample companies
INSERT INTO user_companies (user_id, cin, company_name, company_status, entity_type, incorporation_date, is_active)
VALUES
    (1, 'U60200MH2019PTC234567', 'PRIYA EXPRESS PRIVATE LIMITED', 'Active', 'Private Limited', '2019-05-15', TRUE),
    (1, 'U72900MH2015PTC123456', 'Tech Innovations Private Limited', 'Active', 'Private Limited', '2015-03-20', TRUE),
    (1, 'U74999DL2018PTC234567', 'Global Solutions India Pvt Ltd', 'Active', 'Private Limited', '2018-07-10', TRUE),
    (2, 'U51909MH2020PTC345678', 'Mumbai Trading Corporation', 'Active', 'Private Limited', '2020-01-10', TRUE),
    (2, 'U12345MH2021PTC345678', 'Test Company Private Limited', 'Active', 'Private Limited', '2021-05-10', TRUE),
    (3, 'U74999DL2020PTC123456', 'ILLUMINATI INNOVATION PRIVATE LIMITED', 'Active', 'Private Limited', '2020-01-01', TRUE)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- MCA COMPANIES CACHE
-- ============================================================================

INSERT INTO mca_companies_cache (
    company_name, cin, company_status, company_class, registration_date, 
    authorized_capital, paid_up_capital, email, registered_address
) VALUES
    ('ILLUMINATI INNOVATION PRIVATE LIMITED', 'U74999DL2020PTC123456', 'Active', 'Private', '01/01/2020', '100000', '100000', 'info@illuminati.com', '123 Innovation Street, New Delhi'),
    ('PRIYA EXPRESS PRIVATE LIMITED', 'U60200MH2019PTC234567', 'Active', 'Private', '15/03/2019', '500000', '300000', 'info@priyaexpress.com', '456 Express Road, Mumbai'),
    ('Tech Innovations Private Limited', 'U72900MH2015PTC123456', 'Active', 'Private', '20/03/2015', '1000000', '500000', 'info@techinnovations.com', '789 Tech Park, Mumbai'),
    ('Global Solutions India Pvt Ltd', 'U74999DL2018PTC234567', 'Active', 'Private', '10/07/2018', '2000000', '1000000', 'info@globalsolutions.com', '321 Global Avenue, New Delhi'),
    ('Mumbai Trading Corporation', 'U51909MH2020PTC345678', 'Active', 'Private', '10/01/2020', '500000', '250000', 'info@mumbaitrading.com', '654 Trading Street, Mumbai'),
    ('Test Company Private Limited', 'U12345MH2021PTC345678', 'Active', 'Private', '10/05/2021', '1000000', '500000', 'info@testcompany.com', '987 Test Road, Mumbai')
ON CONFLICT (cin) DO NOTHING;

-- ============================================================================
-- DIRECTORS
-- ============================================================================

INSERT INTO directors (company_id, company_cin, din, director_name, designation, appointment_date, status, nationality, pan, email, phone)
VALUES
-- For PRIYA EXPRESS PRIVATE LIMITED (company_id = 1)
(1, 'U60200MH2019PTC234567', '00123456', 'Rajesh Kumar Sharma', 'Managing Director', '2019-05-15', 'Active', 'Indian', 'ABCPS1234A', 'rajesh@priyaexpress.com', '+91-9876543210'),
(1, 'U60200MH2019PTC234567', '00234567', 'Priya Mehta', 'Director', '2019-05-15', 'Active', 'Indian', 'ABCPM5678B', 'priya@priyaexpress.com', '+91-9876543211'),
(1, 'U60200MH2019PTC234567', '00345678', 'Amit Patel', 'Chief Financial Officer', '2020-01-10', 'Active', 'Indian', 'ABCPA9012C', 'amit.patel@priyaexpress.com', '+91-9876543212'),

-- For Tech Innovations Private Limited (company_id = 2)
(2, 'U72900MH2015PTC123456', '01234567', 'Vikram Singh', 'Chairman & MD', '2015-03-20', 'Active', 'Indian', 'ABCPV3456D', 'vikram@techinnovations.com', '+91-9876543220'),
(2, 'U72900MH2015PTC123456', '01345678', 'Sunita Reddy', 'Executive Director', '2015-03-20', 'Active', 'Indian', 'ABCPS7890E', 'sunita@techinnovations.com', '+91-9876543221'),

-- For Global Solutions India Pvt Ltd (company_id = 3)
(3, 'U74999DL2018PTC234567', '02345678', 'Arjun Malhotra', 'Managing Director', '2018-07-10', 'Active', 'Indian', 'ABCPA1234F', 'arjun@globalsolutions.com', '+91-9876543230'),
(3, 'U74999DL2018PTC234567', '02456789', 'Kavita Kapoor', 'Director', '2018-07-10', 'Active', 'Indian', 'ABCPK5678G', 'kavita@globalsolutions.com', '+91-9876543231'),
(3, 'U74999DL2018PTC234567', '02567890', 'Rahul Verma', 'Chief Technology Officer', '2019-01-15', 'Active', 'Indian', 'ABCPR9012H', 'rahul@globalsolutions.com', '+91-9876543232'),

-- For Mumbai Trading Corporation (company_id = 4)
(4, 'U51909MH2020PTC345678', '03456789', 'Suresh Kumar', 'Managing Director', '2020-01-10', 'Active', 'Indian', 'ABCPS3456I', 'suresh@mumbaitrading.com', '+91-9876543240'),
(4, 'U51909MH2020PTC345678', '03567890', 'Meera Shah', 'Director', '2020-01-10', 'Active', 'Indian', 'ABCPM7890J', 'meera@mumbaitrading.com', '+91-9876543241')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SHAREHOLDERS
-- ============================================================================

INSERT INTO shareholders (company_id, company_cin, shareholder_name, folio_no, category, sub_category, under_sub_category, shares_held, pan, status)
VALUES
-- For PRIYA EXPRESS PRIVATE LIMITED
(1, 'U60200MH2019PTC234567', 'Rajesh Kumar Sharma', 'FOL001', 'Promoter', 'Indian', 'Individual', 500000, 'ABCPS1234A', 'Active'),
(1, 'U60200MH2019PTC234567', 'Priya Mehta', 'FOL002', 'Promoter', 'Indian', 'Individual', 300000, 'ABCPM5678B', 'Active'),
(1, 'U60200MH2019PTC234567', 'Tech Ventures LLP', 'FOL003', 'Non-Promoter', 'Indian', 'LLP', 150000, 'AAATT1234C', 'Active'),
(1, 'U60200MH2019PTC234567', 'Mumbai Investment Fund', 'FOL004', 'Non-Promoter', 'Indian', 'Institutions', 50000, 'AAAMI5678D', 'Active'),

-- For Tech Innovations Private Limited
(2, 'U72900MH2015PTC123456', 'Vikram Singh', 'TI001', 'Promoter', 'Indian', 'Individual', 600000, 'ABCPV3456D', 'Active'),
(2, 'U72900MH2015PTC123456', 'Sunita Reddy', 'TI002', 'Promoter', 'Indian', 'Individual', 400000, 'ABCPS7890E', 'Active'),
(2, 'U72900MH2015PTC123456', 'Innovation Capital Pvt Ltd', 'TI003', 'Non-Promoter', 'Indian', 'Corporate Body', 200000, 'AAAIC9012F', 'Active'),

-- For Global Solutions India Pvt Ltd
(3, 'U74999DL2018PTC234567', 'Arjun Malhotra', 'GS001', 'Promoter', 'Indian', 'Individual', 450000, 'ABCPA1234F', 'Active'),
(3, 'U74999DL2018PTC234567', 'Kavita Kapoor', 'GS002', 'Promoter', 'Indian', 'Individual', 350000, 'ABCPK5678G', 'Active'),
(3, 'U74999DL2018PTC234567', 'Delhi Growth Fund', 'GS003', 'Non-Promoter', 'Indian', 'Institutions', 200000, 'AAADG3456H', 'Active'),

-- For Mumbai Trading Corporation
(4, 'U51909MH2020PTC345678', 'Suresh Kumar', 'MT001', 'Promoter', 'Indian', 'Individual', 400000, 'ABCPS3456I', 'Active'),
(4, 'U51909MH2020PTC345678', 'Meera Shah', 'MT002', 'Promoter', 'Indian', 'Individual', 300000, 'ABCPM7890J', 'Active'),
(4, 'U51909MH2020PTC345678', 'Mumbai Capital Partners', 'MT003', 'Non-Promoter', 'Indian', 'Corporate Body', 300000, 'AAAMC5678K', 'Active')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SHARE CERTIFICATES
-- ============================================================================

-- Physical Share Certificates
INSERT INTO share_certificates (company_id, company_cin, certificate_no, certificate_type, folio_no, shareholder_name, distinctive_no_from, distinctive_no_to, shares, face_value, issue_date, status)
VALUES
-- For PRIYA EXPRESS PRIVATE LIMITED (Physical)
(1, 'U60200MH2019PTC234567', 'PC0001', 'Physical', 'FOL001', 'Rajesh Kumar Sharma', '1', '500000', 500000, 10.00, '2019-05-20', 'Active'),
(1, 'U60200MH2019PTC234567', 'PC0002', 'Physical', 'FOL002', 'Priya Mehta', '500001', '800000', 300000, 10.00, '2019-05-20', 'Active'),
(1, 'U60200MH2019PTC234567', 'PC0003', 'Physical', 'FOL003', 'Tech Ventures LLP', '800001', '950000', 150000, 10.00, '2019-06-01', 'Active'),

-- For Tech Innovations (Physical)
(2, 'U72900MH2015PTC123456', 'TIC001', 'Physical', 'TI001', 'Vikram Singh', '1', '600000', 600000, 10.00, '2015-03-25', 'Active'),
(2, 'U72900MH2015PTC123456', 'TIC002', 'Physical', 'TI002', 'Sunita Reddy', '600001', '1000000', 400000, 10.00, '2015-03-25', 'Active'),

-- Demat Share Certificates
(1, 'U60200MH2019PTC234567', 'DM0001', 'Demat', 'FOL004', 'Mumbai Investment Fund', '950001', '1000000', 50000, 10.00, '2020-01-15', 'Active'),
(2, 'U72900MH2015PTC123456', 'TIDM001', 'Demat', 'TI003', 'Innovation Capital Pvt Ltd', '1000001', '1200000', 200000, 10.00, '2016-05-10', 'Active'),
(3, 'U74999DL2018PTC234567', 'GSDM001', 'Demat', 'GS001', 'Arjun Malhotra', '1', '450000', 450000, 10.00, '2018-07-15', 'Active'),
(3, 'U74999DL2018PTC234567', 'GSDM002', 'Demat', 'GS002', 'Kavita Kapoor', '450001', '800000', 350000, 10.00, '2018-07-15', 'Active'),
(3, 'U74999DL2018PTC234567', 'GSDM003', 'Demat', 'GS003', 'Delhi Growth Fund', '800001', '1000000', 200000, 10.00, '2018-08-01', 'Active')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- DEBENTURE HOLDERS
-- ============================================================================

INSERT INTO debenture_holders (company_id, company_cin, holder_name, debenture_no, debenture_type, units, face_value, issue_date, maturity_date, interest_rate, status, pan)
VALUES
-- For Tech Innovations Private Limited
(2, 'U72900MH2015PTC123456', 'ICICI Bank Ltd', 'DEB001', 'Secured Non-Convertible', 1000, 1000000.00, '2020-01-01', '2025-01-01', 9.50, 'Active', 'AAAAI1234I'),
(2, 'U72900MH2015PTC123456', 'HDFC Bank Ltd', 'DEB002', 'Secured Non-Convertible', 500, 1000000.00, '2020-01-01', '2025-01-01', 9.50, 'Active', 'AAAAH5678J'),

-- For Global Solutions India Pvt Ltd
(3, 'U74999DL2018PTC234567', 'State Bank of India', 'GSDB001', 'Secured Convertible', 750, 1000000.00, '2021-06-01', '2026-06-01', 8.75, 'Active', 'AAAAS9012K'),
(3, 'U74999DL2018PTC234567', 'Axis Bank Ltd', 'GSDB002', 'Secured Non-Convertible', 250, 1000000.00, '2021-06-01', '2026-06-01', 9.00, 'Active', 'AAAAA3456L'),

-- For Mumbai Trading Corporation
(4, 'U51909MH2020PTC345678', 'Kotak Mahindra Bank', 'MTDB001', 'Unsecured Non-Convertible', 300, 500000.00, '2022-03-15', '2025-03-15', 10.50, 'Active', 'AAAAK7890M')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- CAPITAL STRUCTURE
-- ============================================================================

-- Authorized Capital
INSERT INTO authorized_capital (company_id, share_class, authorized_shares, face_value, total_amount, amendment_date, created_by)
VALUES
(1, 'Equity', 1000000, 10.00, 10000000.00, '2019-05-15', 1),
(2, 'Equity', 2000000, 10.00, 20000000.00, '2015-03-20', 1),
(3, 'Equity', 2000000, 10.00, 20000000.00, '2018-07-10', 1),
(4, 'Equity', 1000000, 10.00, 10000000.00, '2020-01-10', 2)
ON CONFLICT DO NOTHING;

-- Paid Up Capital
INSERT INTO paid_up_capital (company_id, share_class, paid_up_shares, face_value, total_amount, subscription_date, created_by)
VALUES
(1, 'Equity', 1000000, 10.00, 10000000.00, '2019-05-20', 1),
(2, 'Equity', 1200000, 10.00, 12000000.00, '2015-03-25', 1),
(3, 'Equity', 1000000, 10.00, 10000000.00, '2018-07-15', 1),
(4, 'Equity', 1000000, 10.00, 10000000.00, '2020-01-15', 2)
ON CONFLICT DO NOTHING;

-- Share Capital
INSERT INTO share_capital (company_id, share_class, authorized_shares, paid_up_shares, face_value, status, created_by)
VALUES
(1, 'Equity', 1000000, 1000000, 10.00, 'Active', 1),
(2, 'Equity', 2000000, 1200000, 10.00, 'Active', 1),
(3, 'Equity', 2000000, 1000000, 10.00, 'Active', 1),
(4, 'Equity', 1000000, 1000000, 10.00, 'Active', 2)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SHAREHOLDER TRANSACTIONS
-- ============================================================================

INSERT INTO shareholder_transactions (company_id, shareholder_id, shareholder_name, folio_no, transaction_type, shares, transaction_date, status, remarks, created_by)
VALUES
(1, 1, 'Rajesh Kumar Sharma', 'FOL001', 'Purchase', 100000, '2020-06-01', 'Completed', 'Additional shares purchased', 1),
(1, 2, 'Priya Mehta', 'FOL002', 'Transfer', 50000, '2020-07-15', 'Completed', 'Shares transferred from FOL001', 1),
(2, 5, 'Vikram Singh', 'TI001', 'Purchase', 100000, '2016-01-10', 'Completed', 'Additional capital infusion', 1),
(3, 8, 'Arjun Malhotra', 'GS001', 'Purchase', 50000, '2019-03-20', 'Completed', 'ESOP exercise', 1)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- MEETINGS AND AGENDAS
-- ============================================================================

-- Agendas
INSERT INTO agendas (company_id, agenda_title, description, meeting_type, status, created_date, created_by)
VALUES
(1, 'Approval of Annual Financial Statements', 'Discussion and approval of annual financial statements for FY 2023-24', 'AGM', 'Active', '2024-01-15', 1),
(1, 'Appointment of Auditor', 'Appointment of statutory auditor for FY 2024-25', 'Board', 'Active', '2024-02-01', 1),
(2, 'Dividend Declaration', 'Declaration of interim dividend for shareholders', 'Board', 'Active', '2024-03-10', 1),
(3, 'Capital Increase', 'Proposal to increase authorized capital', 'EGM', 'Active', '2024-04-05', 1)
ON CONFLICT DO NOTHING;

-- Board Meetings
INSERT INTO board_meetings (company_id, meeting_no, meeting_date, venue, attendees, status, agenda_items, created_by)
VALUES
(1, 'BM-2024-001', '2024-01-20', 'Company Office, Mumbai', 5, 'Completed', 'Financial review, Auditor appointment', 1),
(1, 'BM-2024-002', '2024-02-15', 'Company Office, Mumbai', 5, 'Scheduled', 'Quarterly review, Strategy discussion', 1),
(2, 'BM-2024-001', '2024-01-25', 'Tech Park, Mumbai', 4, 'Completed', 'Financial results, Dividend proposal', 1),
(3, 'BM-2024-001', '2024-02-10', 'Global Avenue, New Delhi', 6, 'Completed', 'Annual planning, Budget approval', 1)
ON CONFLICT (meeting_no) DO NOTHING;

-- AGM Meetings
INSERT INTO agm_meetings (company_id, financial_year, meeting_date, venue, shareholders, status, notice_sent_date, created_by)
VALUES
(1, '2023-24', '2024-09-30', 'Company Office, Mumbai', 100, 'Scheduled', '2024-08-15', 1),
(2, '2023-24', '2024-09-25', 'Tech Park Auditorium, Mumbai', 150, 'Scheduled', '2024-08-10', 1),
(3, '2023-24', '2024-10-05', 'Convention Center, New Delhi', 200, 'Scheduled', '2024-08-20', 1)
ON CONFLICT DO NOTHING;

-- EGM Meetings
INSERT INTO egm_meetings (company_id, meeting_no, meeting_date, purpose, venue, status, notice_sent_date, created_by)
VALUES
(1, 'EGM-2024-001', '2024-05-15', 'Approval of capital increase', 'Company Office, Mumbai', 'Completed', '2024-04-15', 1),
(3, 'EGM-2024-001', '2024-06-20', 'Amendment to Articles of Association', 'Convention Center, New Delhi', 'Scheduled', '2024-05-20', 1)
ON CONFLICT (meeting_no) DO NOTHING;

-- Committee Meetings
INSERT INTO committee_meetings (company_id, meeting_no, committee_type, meeting_date, venue, members, status, agenda_items, created_by)
VALUES
(1, 'AC-2024-001', 'Audit Committee', '2024-01-10', 'Company Office, Mumbai', 3, 'Completed', 'Internal audit review, Financial statements', 1),
(2, 'AC-2024-001', 'Audit Committee', '2024-01-15', 'Tech Park, Mumbai', 3, 'Completed', 'Quarterly audit review', 1),
(3, 'NC-2024-001', 'Nomination Committee', '2024-02-05', 'Global Avenue, New Delhi', 3, 'Completed', 'Director appointment review', 1)
ON CONFLICT (meeting_no) DO NOTHING;

-- ============================================================================
-- FORM SUBMISSIONS - Sample Data
-- ============================================================================

-- ADT1 Submission
INSERT INTO adt1_submissions (ref_user_id, company_id, cin, company_name, company_address, company_email, falling_section, appointment_nature, is_auditor_appointed, appointment_date, signed_by, designation, din, ref_user_name)
VALUES
(1, 1, 'U60200MH2019PTC234567', 'PRIYA EXPRESS PRIVATE LIMITED', '456 Express Road, Mumbai', 'info@priyaexpress.com', 'Section 139', 'Regular Appointment', 'Yes', '2024-01-15', 'Rajesh Kumar Sharma', 'Managing Director', '00123456', 'admin')
ON CONFLICT DO NOTHING;

-- BEN2 Submission
INSERT INTO ben2_submissions (ref_user, company_id, cin, company_name, company_address, company_email, reporting_company, declaration_ownership, resolution_date, signitory, designation, ref_user_name)
VALUES
(1, 1, 'U60200MH2019PTC234567', 'PRIYA EXPRESS PRIVATE LIMITED', '456 Express Road, Mumbai', 'info@priyaexpress.com', TRUE, TRUE, '2024-02-01', 'Rajesh Kumar Sharma', 'Managing Director', 'admin')
ON CONFLICT DO NOTHING;

-- PAS3 Submission
INSERT INTO pas3_submissions (ref_user, company_id, cin, company_name, company_address, company_email, number_of_allotments, resolution_date, signatory, designation, ref_user_name)
VALUES
(1, 1, 'U60200MH2019PTC234567', 'PRIYA EXPRESS PRIVATE LIMITED', '456 Express Road, Mumbai', 'info@priyaexpress.com', 100000, '2024-03-01', 'Rajesh Kumar Sharma', 'Managing Director', 'admin')
ON CONFLICT DO NOTHING;

-- DPT3 Submission
INSERT INTO dpt3_submissions (ref_user, company_id, cin, company_name, company_address, company_email, type, form_purpose, return_period, signatory_designation, signatory_id, ref_user_name)
VALUES
(1, 1, 'U60200MH2019PTC234567', 'PRIYA EXPRESS PRIVATE LIMITED', '456 Express Road, Mumbai', 'info@priyaexpress.com', 'Return', 'Annual Return', '2024-03-31', 'Managing Director', '00123456', 'admin')
ON CONFLICT DO NOTHING;

-- Phase 3 Form Submissions (JSONB based)
INSERT INTO aoc4_submissions (company_id, cin, company_name, contact_email, filing_period, submission_data)
VALUES
(1, 'U60200MH2019PTC234567', 'PRIYA EXPRESS PRIVATE LIMITED', 'info@priyaexpress.com', '2023-24', '{"status": "draft", "sections": {"balance_sheet": {}, "profit_loss": {}}}'::jsonb),
(2, 'U72900MH2015PTC123456', 'Tech Innovations Private Limited', 'info@techinnovations.com', '2023-24', '{"status": "submitted", "sections": {"balance_sheet": {}, "profit_loss": {}}}'::jsonb)
ON CONFLICT DO NOTHING;

INSERT INTO mgt7a_submissions (company_id, cin, company_name, contact_email, filing_period, submission_data)
VALUES
(1, 'U60200MH2019PTC234567', 'PRIYA EXPRESS PRIVATE LIMITED', 'info@priyaexpress.com', '2023-24', '{"status": "draft", "annual_return": {}}'::jsonb)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SUMMARY
-- ============================================================================

SELECT 'Database seeded successfully!' as message;
SELECT 
    'Users: ' || COUNT(*) as summary FROM user_accounts
UNION ALL
SELECT 
    'Companies: ' || COUNT(*) FROM user_companies
UNION ALL
SELECT 
    'Directors: ' || COUNT(*) FROM directors
UNION ALL
SELECT 
    'Shareholders: ' || COUNT(*) FROM shareholders
UNION ALL
SELECT 
    'Share Certificates: ' || COUNT(*) FROM share_certificates
UNION ALL
SELECT 
    'Debenture Holders: ' || COUNT(*) FROM debenture_holders
UNION ALL
SELECT 
    'Meetings: ' || COUNT(*) FROM board_meetings;

