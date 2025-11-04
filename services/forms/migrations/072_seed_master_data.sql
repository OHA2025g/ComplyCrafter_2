-- Seed sample data for Directors, Shareholders, Share Certificates, and Debenture Holders
-- Linked to companies in user_companies table

-- Get company IDs for reference
-- Company 1: PRIYA EXPRESS PRIVATE LIMITED (U60200MH2019PTC234567)
-- Company 4: Tech Innovations Private Limited (U72900MH2015PTC123456)
-- Company 5: Global Solutions India Pvt Ltd (U74999DL2018PTC234567)

-- ==================== SEED DIRECTORS ====================
INSERT INTO directors (company_id, company_cin, din, director_name, designation, appointment_date, status, nationality, pan, email, phone)
VALUES
-- For PRIYA EXPRESS PRIVATE LIMITED (company_id = 1)
(1, 'U60200MH2019PTC234567', '00123456', 'Rajesh Kumar Sharma', 'Managing Director', '2019-05-15', 'Active', 'Indian', 'ABCPS1234A', 'rajesh@priyaexpress.com', '+91-9876543210'),
(1, 'U60200MH2019PTC234567', '00234567', 'Priya Mehta', 'Director', '2019-05-15', 'Active', 'Indian', 'ABCPM5678B', 'priya@priyaexpress.com', '+91-9876543211'),
(1, 'U60200MH2019PTC234567', '00345678', 'Amit Patel', 'Chief Financial Officer', '2020-01-10', 'Active', 'Indian', 'ABCPA9012C', 'amit.patel@priyaexpress.com', '+91-9876543212'),

-- For Tech Innovations Private Limited (company_id = 4)
(4, 'U72900MH2015PTC123456', '01234567', 'Vikram Singh', 'Chairman & MD', '2015-03-20', 'Active', 'Indian', 'ABCPV3456D', 'vikram@techinnovations.com', '+91-9876543220'),
(4, 'U72900MH2015PTC123456', '01345678', 'Sunita Reddy', 'Executive Director', '2015-03-20', 'Active', 'Indian', 'ABCPS7890E', 'sunita@techinnovations.com', '+91-9876543221'),

-- For Global Solutions India Pvt Ltd (company_id = 5)
(5, 'U74999DL2018PTC234567', '02345678', 'Arjun Malhotra', 'Managing Director', '2018-07-10', 'Active', 'Indian', 'ABCPA1234F', 'arjun@globalsolutions.com', '+91-9876543230'),
(5, 'U74999DL2018PTC234567', '02456789', 'Kavita Kapoor', 'Director', '2018-07-10', 'Active', 'Indian', 'ABCPK5678G', 'kavita@globalsolutions.com', '+91-9876543231'),
(5, 'U74999DL2018PTC234567', '02567890', 'Rahul Verma', 'Chief Technology Officer', '2019-01-15', 'Active', 'Indian', 'ABCPR9012H', 'rahul@globalsolutions.com', '+91-9876543232');


-- ==================== SEED SHAREHOLDERS ====================
INSERT INTO shareholders (company_id, company_cin, shareholder_name, folio_no, category, sub_category, under_sub_category, shares_held, pan, status)
VALUES
-- For PRIYA EXPRESS PRIVATE LIMITED
(1, 'U60200MH2019PTC234567', 'Rajesh Kumar Sharma', 'FOL001', 'Promoter', 'Indian', 'Individual', 500000, 'ABCPS1234A', 'Active'),
(1, 'U60200MH2019PTC234567', 'Priya Mehta', 'FOL002', 'Promoter', 'Indian', 'Individual', 300000, 'ABCPM5678B', 'Active'),
(1, 'U60200MH2019PTC234567', 'Tech Ventures LLP', 'FOL003', 'Non-Promoter', 'Indian', 'LLP', 150000, 'AAATT1234C', 'Active'),
(1, 'U60200MH2019PTC234567', 'Mumbai Investment Fund', 'FOL004', 'Non-Promoter', 'Indian', 'Institutions', 50000, 'AAAMI5678D', 'Active'),

-- For Tech Innovations Private Limited
(4, 'U72900MH2015PTC123456', 'Vikram Singh', 'TI001', 'Promoter', 'Indian', 'Individual', 600000, 'ABCPV3456D', 'Active'),
(4, 'U72900MH2015PTC123456', 'Sunita Reddy', 'TI002', 'Promoter', 'Indian', 'Individual', 400000, 'ABCPS7890E', 'Active'),
(4, 'U72900MH2015PTC123456', 'Innovation Capital Pvt Ltd', 'TI003', 'Non-Promoter', 'Indian', 'Corporate Body', 200000, 'AAAIC9012F', 'Active'),

-- For Global Solutions India Pvt Ltd
(5, 'U74999DL2018PTC234567', 'Arjun Malhotra', 'GS001', 'Promoter', 'Indian', 'Individual', 450000, 'ABCPA1234F', 'Active'),
(5, 'U74999DL2018PTC234567', 'Kavita Kapoor', 'GS002', 'Promoter', 'Indian', 'Individual', 350000, 'ABCPK5678G', 'Active'),
(5, 'U74999DL2018PTC234567', 'Delhi Growth Fund', 'GS003', 'Non-Promoter', 'Indian', 'Institutions', 200000, 'AAADG3456H', 'Active');


-- ==================== SEED SHARE CERTIFICATES (PHYSICAL) ====================
INSERT INTO share_certificates (company_id, company_cin, certificate_no, certificate_type, folio_no, shareholder_name, distinctive_no_from, distinctive_no_to, shares, face_value, issue_date, status)
VALUES
-- For PRIYA EXPRESS PRIVATE LIMITED (Physical)
(1, 'U60200MH2019PTC234567', 'PC0001', 'Physical', 'FOL001', 'Rajesh Kumar Sharma', '1', '500000', 500000, 10.00, '2019-05-20', 'Active'),
(1, 'U60200MH2019PTC234567', 'PC0002', 'Physical', 'FOL002', 'Priya Mehta', '500001', '800000', 300000, 10.00, '2019-05-20', 'Active'),
(1, 'U60200MH2019PTC234567', 'PC0003', 'Physical', 'FOL003', 'Tech Ventures LLP', '800001', '950000', 150000, 10.00, '2019-06-01', 'Active'),

-- For Tech Innovations (Physical)
(4, 'U72900MH2015PTC123456', 'TIC001', 'Physical', 'TI001', 'Vikram Singh', '1', '600000', 600000, 10.00, '2015-03-25', 'Active'),
(4, 'U72900MH2015PTC123456', 'TIC002', 'Physical', 'TI002', 'Sunita Reddy', '600001', '1000000', 400000, 10.00, '2015-03-25', 'Active');


-- ==================== SEED SHARE CERTIFICATES (DEMAT) ====================
INSERT INTO share_certificates (company_id, company_cin, certificate_no, certificate_type, folio_no, shareholder_name, distinctive_no_from, distinctive_no_to, shares, face_value, issue_date, status)
VALUES
-- For PRIYA EXPRESS (Demat)
(1, 'U60200MH2019PTC234567', 'DM0001', 'Demat', 'FOL004', 'Mumbai Investment Fund', '950001', '1000000', 50000, 10.00, '2020-01-15', 'Active'),

-- For Tech Innovations (Demat)
(4, 'U72900MH2015PTC123456', 'TIDM001', 'Demat', 'TI003', 'Innovation Capital Pvt Ltd', '1000001', '1200000', 200000, 10.00, '2016-05-10', 'Active'),

-- For Global Solutions (Demat)
(5, 'U74999DL2018PTC234567', 'GSDM001', 'Demat', 'GS001', 'Arjun Malhotra', '1', '450000', 450000, 10.00, '2018-07-15', 'Active'),
(5, 'U74999DL2018PTC234567', 'GSDM002', 'Demat', 'GS002', 'Kavita Kapoor', '450001', '800000', 350000, 10.00, '2018-07-15', 'Active'),
(5, 'U74999DL2018PTC234567', 'GSDM003', 'Demat', 'GS003', 'Delhi Growth Fund', '800001', '1000000', 200000, 10.00, '2018-08-01', 'Active');


-- ==================== SEED DEBENTURE HOLDERS ====================
INSERT INTO debenture_holders (company_id, company_cin, holder_name, debenture_no, debenture_type, units, face_value, issue_date, maturity_date, interest_rate, status, pan)
VALUES
-- For Tech Innovations Private Limited
(4, 'U72900MH2015PTC123456', 'ICICI Bank Ltd', 'DEB001', 'Secured Non-Convertible', 1000, 1000000.00, '2020-01-01', '2025-01-01', 9.50, 'Active', 'AAAAI1234I'),
(4, 'U72900MH2015PTC123456', 'HDFC Bank Ltd', 'DEB002', 'Secured Non-Convertible', 500, 1000000.00, '2020-01-01', '2025-01-01', 9.50, 'Active', 'AAAAH5678J'),

-- For Global Solutions India Pvt Ltd
(5, 'U74999DL2018PTC234567', 'State Bank of India', 'GSDB001', 'Secured Convertible', 750, 1000000.00, '2021-06-01', '2026-06-01', 8.75, 'Active', 'AAAAS9012K'),
(5, 'U74999DL2018PTC234567', 'Axis Bank Ltd', 'GSDB002', 'Secured Non-Convertible', 250, 1000000.00, '2021-06-01', '2026-06-01', 9.00, 'Active', 'AAAAA3456L'),

-- For Mumbai Trading Corporation
(6, 'U51909MH2020PTC345678', 'Kotak Mahindra Bank', 'MTDB001', 'Unsecured Non-Convertible', 300, 500000.00, '2022-03-15', '2025-03-15', 10.50, 'Active', 'AAAAK7890M');


-- Show counts
SELECT 
    'Directors: ' || COUNT(*) as summary FROM directors
UNION ALL
SELECT 
    'Shareholders: ' || COUNT(*) FROM shareholders
UNION ALL
SELECT 
    'Share Certificates: ' || COUNT(*) FROM share_certificates
UNION ALL
SELECT 
    'Debenture Holders: ' || COUNT(*) FROM debenture_holders;

