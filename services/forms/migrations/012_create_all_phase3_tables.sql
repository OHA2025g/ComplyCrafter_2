-- Create all Phase 3+ form tables

-- BOARDREPORT
CREATE TABLE IF NOT EXISTS tbl_boardreport (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- CHARGE
CREATE TABLE IF NOT EXISTS tbl_charge (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- CHG1
CREATE TABLE IF NOT EXISTS tbl_chg1 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- CHG4
CREATE TABLE IF NOT EXISTS tbl_chg4 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- CHG6
CREATE TABLE IF NOT EXISTS tbl_chg6 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- CHG8
CREATE TABLE IF NOT EXISTS tbl_chg8 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- CHG9
CREATE TABLE IF NOT EXISTS tbl_chg9 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- DIR3
CREATE TABLE IF NOT EXISTS tbl_dir3 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    director_name VARCHAR(255),
    din VARCHAR(50),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- DIR5
CREATE TABLE IF NOT EXISTS tbl_dir5 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    director_name VARCHAR(255),
    din VARCHAR(50),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- DIR6
CREATE TABLE IF NOT EXISTS tbl_dir6 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    director_name VARCHAR(255),
    din VARCHAR(50),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- DIR9
CREATE TABLE IF NOT EXISTS tbl_dir9 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    director_name VARCHAR(255),
    din VARCHAR(50),
    cessation_date TIMESTAMP,
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- DIR11
CREATE TABLE IF NOT EXISTS tbl_dir11 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    director_name VARCHAR(255),
    din VARCHAR(50),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- DIR12
CREATE TABLE IF NOT EXISTS tbl_dir12 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    director_name VARCHAR(255),
    din VARCHAR(50),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- DPT4
CREATE TABLE IF NOT EXISTS tbl_dpt4 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    deposit_amount NUMERIC,
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- FORM3
CREATE TABLE IF NOT EXISTS tbl_form3 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- FORM4
CREATE TABLE IF NOT EXISTS tbl_form4 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- FORM5
CREATE TABLE IF NOT EXISTS tbl_form5 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- FORM11
CREATE TABLE IF NOT EXISTS tbl_form11 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- FORM12
CREATE TABLE IF NOT EXISTS tbl_form12 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- FORM15
CREATE TABLE IF NOT EXISTS tbl_form15 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- FORM22
CREATE TABLE IF NOT EXISTS tbl_form22 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- FORM23
CREATE TABLE IF NOT EXISTS tbl_form23 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- FORM24
CREATE TABLE IF NOT EXISTS tbl_form24 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- FORM28
CREATE TABLE IF NOT EXISTS tbl_form28 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- GNL1
CREATE TABLE IF NOT EXISTS tbl_gnl1 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- GNL2
CREATE TABLE IF NOT EXISTS tbl_gnl2 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- GNL3
CREATE TABLE IF NOT EXISTS tbl_gnl3 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- IEPF2
CREATE TABLE IF NOT EXISTS tbl_iepf2 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- IEPF5
CREATE TABLE IF NOT EXISTS tbl_iepf5 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- INC4
CREATE TABLE IF NOT EXISTS tbl_inc4 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- INC12
CREATE TABLE IF NOT EXISTS tbl_inc12 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- INC20A
CREATE TABLE IF NOT EXISTS tbl_inc20a (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- INC22
CREATE TABLE IF NOT EXISTS tbl_inc22 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- INC23
CREATE TABLE IF NOT EXISTS tbl_inc23 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- INC24
CREATE TABLE IF NOT EXISTS tbl_inc24 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- INC28
CREATE TABLE IF NOT EXISTS tbl_inc28 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- MGT6
CREATE TABLE IF NOT EXISTS tbl_mgt6 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    meeting_type VARCHAR(100),
    meeting_date TIMESTAMP,
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- MGT8
CREATE TABLE IF NOT EXISTS tbl_mgt8 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- MGT9
CREATE TABLE IF NOT EXISTS tbl_mgt9 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- MGT14
CREATE TABLE IF NOT EXISTS tbl_mgt14 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- MR1
CREATE TABLE IF NOT EXISTS tbl_mr1 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- MSC3
CREATE TABLE IF NOT EXISTS tbl_msc3 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- PAS2
CREATE TABLE IF NOT EXISTS tbl_pas2 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- PAS6
CREATE TABLE IF NOT EXISTS tbl_pas6 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- RUN
CREATE TABLE IF NOT EXISTS tbl_run (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- RUNLLP
CREATE TABLE IF NOT EXISTS tbl_runllp (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- SH7
CREATE TABLE IF NOT EXISTS tbl_sh7 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- SH8
CREATE TABLE IF NOT EXISTS tbl_sh8 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- SH9
CREATE TABLE IF NOT EXISTS tbl_sh9 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- SH11
CREATE TABLE IF NOT EXISTS tbl_sh11 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- STK2
CREATE TABLE IF NOT EXISTS tbl_stk2 (
    id SERIAL PRIMARY KEY,
    ref_user INTEGER,
    company_id INTEGER,
    cin VARCHAR(255),
    company_name VARCHAR(500),
    company_address TEXT,
    company_email VARCHAR(255),
    created_by INTEGER NOT NULL,
    created_on TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER,
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

