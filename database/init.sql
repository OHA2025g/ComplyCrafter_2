-- ============================================================================
-- ComplyCrafter Database Initialization Script
-- This script creates all required tables for the ComplyCrafter application
-- ============================================================================

-- ============================================================================
-- USER ACCOUNTS AND AUTHENTICATION
-- ============================================================================

-- User Accounts Table
CREATE TABLE IF NOT EXISTS user_accounts (
    id SERIAL PRIMARY KEY,
    username VARCHAR(150) UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    profession VARCHAR(100),
    firm_name VARCHAR(200),
    phone_number VARCHAR(20),
    phone_verified BOOLEAN DEFAULT FALSE,
    ccpin_hash VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    -- Subscription fields
    subscription_status VARCHAR(50) DEFAULT 'trial',
    subscription_plan VARCHAR(50),
    trial_ends_at TIMESTAMP WITHOUT TIME ZONE,
    subscription_expires_at TIMESTAMP WITHOUT TIME ZONE,
    subscription_started_at TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL
);

CREATE INDEX IF NOT EXISTS ix_user_accounts_username ON user_accounts (username);
CREATE INDEX IF NOT EXISTS ix_user_accounts_email ON user_accounts (email);
CREATE INDEX IF NOT EXISTS ix_user_accounts_phone_number ON user_accounts (phone_number);
CREATE INDEX IF NOT EXISTS ix_user_accounts_profession ON user_accounts (profession);
CREATE INDEX IF NOT EXISTS ix_user_accounts_firm_name ON user_accounts (firm_name);
CREATE INDEX IF NOT EXISTS ix_user_accounts_subscription_status ON user_accounts (subscription_status);
CREATE INDEX IF NOT EXISTS ix_user_accounts_subscription_plan ON user_accounts (subscription_plan);
CREATE INDEX IF NOT EXISTS ix_user_accounts_trial_ends_at ON user_accounts (trial_ends_at);
CREATE INDEX IF NOT EXISTS ix_user_accounts_subscription_expires_at ON user_accounts (subscription_expires_at);
CREATE INDEX IF NOT EXISTS ix_user_accounts_subscription_started_at ON user_accounts (subscription_started_at);

-- OTP Verifications Table
CREATE TABLE IF NOT EXISTS otp_verifications (
    id SERIAL PRIMARY KEY,
    phone_number VARCHAR(20) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITHOUT TIME ZONE NULL
);

CREATE INDEX IF NOT EXISTS ix_otp_verifications_phone_number ON otp_verifications (phone_number);
CREATE INDEX IF NOT EXISTS ix_otp_verifications_phone_otp ON otp_verifications (phone_number, otp_code);
CREATE INDEX IF NOT EXISTS ix_otp_verifications_expires_at ON otp_verifications (expires_at);

-- Password Reset Tokens Table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP WITHOUT TIME ZONE NULL,
    FOREIGN KEY (user_id) REFERENCES user_accounts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS ix_password_reset_tokens_token ON password_reset_tokens (token);
CREATE INDEX IF NOT EXISTS ix_password_reset_tokens_user_id ON password_reset_tokens (user_id);

-- ============================================================================
-- COMPANY MANAGEMENT
-- ============================================================================

-- User Companies Table
CREATE TABLE IF NOT EXISTS user_companies (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    cin VARCHAR(21) NOT NULL,
    company_name VARCHAR(500) NOT NULL,
    company_status VARCHAR(50),
    entity_type VARCHAR(100),
    incorporation_date DATE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id, cin)
);

CREATE INDEX IF NOT EXISTS idx_user_companies_user_id ON user_companies(user_id);
CREATE INDEX IF NOT EXISTS idx_user_companies_cin ON user_companies(cin);
CREATE INDEX IF NOT EXISTS idx_user_companies_active ON user_companies(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_user_companies_incorporation_date ON user_companies(incorporation_date);

-- Company Cache Table
CREATE TABLE IF NOT EXISTS company_cache (
    id SERIAL PRIMARY KEY,
    cin VARCHAR(50) UNIQUE NOT NULL,
    company_name VARCHAR(500) NOT NULL,
    company_type VARCHAR(100),
    company_status VARCHAR(100),
    date_of_incorporation DATE,
    email_address VARCHAR(255),
    authorized_capital NUMERIC(20, 2),
    paid_up_capital NUMERIC(20, 2),
    roc_name VARCHAR(255),
    state VARCHAR(100),
    registered_address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    mca_raw_data JSONB,
    cache_created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    cache_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    cache_expires_at TIMESTAMP WITH TIME ZONE,
    fetch_count INTEGER DEFAULT 1,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    search_vector tsvector,
    CONSTRAINT valid_cin CHECK (cin ~ '^[A-Z0-9-]+$')
);

CREATE INDEX IF NOT EXISTS idx_company_cache_cin ON company_cache(cin);
CREATE INDEX IF NOT EXISTS idx_company_cache_name ON company_cache(company_name);
CREATE INDEX IF NOT EXISTS idx_company_cache_status ON company_cache(company_status);
CREATE INDEX IF NOT EXISTS idx_company_cache_expires ON company_cache(cache_expires_at);
CREATE INDEX IF NOT EXISTS idx_company_cache_search ON company_cache USING GIN(search_vector);

-- MCA Companies Cache Table
CREATE TABLE IF NOT EXISTS mca_companies_cache (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(500) NOT NULL,
    cin VARCHAR(21) UNIQUE NOT NULL,
    company_status VARCHAR(50),
    company_class VARCHAR(100),
    company_sub_category VARCHAR(100),
    registration_date VARCHAR(50),
    authorized_capital VARCHAR(100),
    paid_up_capital VARCHAR(100),
    email VARCHAR(200),
    registered_address TEXT,
    listing_status VARCHAR(50),
    date_of_last_agm VARCHAR(50),
    date_of_balance_sheet VARCHAR(50),
    cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_mca_company_name ON mca_companies_cache USING gin(to_tsvector('english', company_name));
CREATE INDEX IF NOT EXISTS idx_mca_cin ON mca_companies_cache(cin);
CREATE INDEX IF NOT EXISTS idx_mca_company_name_lower ON mca_companies_cache(LOWER(company_name));

-- Company Search Cache Table
CREATE TABLE IF NOT EXISTS company_search_cache (
    id SERIAL PRIMARY KEY,
    search_query VARCHAR(500) NOT NULL,
    search_query_normalized VARCHAR(500) NOT NULL,
    results_json JSONB NOT NULL,
    result_count INTEGER DEFAULT 0,
    cache_created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    cache_expires_at TIMESTAMP WITH TIME ZONE,
    fetch_count INTEGER DEFAULT 1,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_search_query UNIQUE(search_query_normalized)
);

CREATE INDEX IF NOT EXISTS idx_search_cache_query ON company_search_cache(search_query_normalized);
CREATE INDEX IF NOT EXISTS idx_search_cache_expires ON company_search_cache(cache_expires_at);

-- Director Cache Table
CREATE TABLE IF NOT EXISTS director_cache (
    id SERIAL PRIMARY KEY,
    company_cache_id INTEGER REFERENCES company_cache(id) ON DELETE CASCADE,
    din VARCHAR(20) NOT NULL,
    first_name VARCHAR(255),
    middle_name VARCHAR(255),
    last_name VARCHAR(255),
    date_of_appointment DATE,
    is_disqualified BOOLEAN DEFAULT FALSE,
    director_data JSONB,
    cache_created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    cache_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_director_cache_company ON director_cache(company_cache_id);
CREATE INDEX IF NOT EXISTS idx_director_cache_din ON director_cache(din);

-- API Performance Metrics Table
CREATE TABLE IF NOT EXISTS api_performance_metrics (
    id SERIAL PRIMARY KEY,
    api_type VARCHAR(50) NOT NULL,
    operation VARCHAR(100) NOT NULL,
    query_params TEXT,
    response_time_ms INTEGER,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    cache_hit BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_metrics_api_type ON api_performance_metrics(api_type);
CREATE INDEX IF NOT EXISTS idx_metrics_operation ON api_performance_metrics(operation);
CREATE INDEX IF NOT EXISTS idx_metrics_created ON api_performance_metrics(created_at);

-- ============================================================================
-- MASTER DATA TABLES
-- ============================================================================

-- Directors Table
CREATE TABLE IF NOT EXISTS directors (
    id SERIAL PRIMARY KEY,
    company_id INTEGER,
    company_cin VARCHAR(21),
    din VARCHAR(20) NOT NULL,
    director_name VARCHAR(500) NOT NULL,
    designation VARCHAR(200),
    appointment_date DATE,
    cessation_date DATE,
    status VARCHAR(50) DEFAULT 'Active',
    nationality VARCHAR(100),
    pan VARCHAR(20),
    email VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES user_companies(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_directors_company_id ON directors(company_id);
CREATE INDEX IF NOT EXISTS idx_directors_company_cin ON directors(company_cin);
CREATE INDEX IF NOT EXISTS idx_directors_din ON directors(din);
CREATE INDEX IF NOT EXISTS idx_directors_status ON directors(status);

-- Shareholders Table
CREATE TABLE IF NOT EXISTS shareholders (
    id SERIAL PRIMARY KEY,
    company_id INTEGER,
    company_cin VARCHAR(21),
    shareholder_name VARCHAR(500) NOT NULL,
    folio_no VARCHAR(100),
    category VARCHAR(200),
    sub_category VARCHAR(200),
    under_sub_category VARCHAR(200),
    shares_held BIGINT DEFAULT 0,
    pan VARCHAR(20),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES user_companies(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_shareholders_company_id ON shareholders(company_id);
CREATE INDEX IF NOT EXISTS idx_shareholders_company_cin ON shareholders(company_cin);
CREATE INDEX IF NOT EXISTS idx_shareholders_folio_no ON shareholders(folio_no);
CREATE INDEX IF NOT EXISTS idx_shareholders_category ON shareholders(category);
CREATE INDEX IF NOT EXISTS idx_shareholders_status ON shareholders(status);

-- Share Certificates Table
CREATE TABLE IF NOT EXISTS share_certificates (
    id SERIAL PRIMARY KEY,
    company_id INTEGER,
    company_cin VARCHAR(21),
    certificate_no VARCHAR(100) NOT NULL,
    certificate_type VARCHAR(50) NOT NULL,
    folio_no VARCHAR(100),
    shareholder_name VARCHAR(500),
    distinctive_no_from VARCHAR(50),
    distinctive_no_to VARCHAR(50),
    shares INTEGER NOT NULL,
    face_value DECIMAL(15, 2),
    issue_date DATE,
    status VARCHAR(50) DEFAULT 'Active',
    transfer_date DATE,
    transferee_name VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES user_companies(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_share_certificates_company_id ON share_certificates(company_id);
CREATE INDEX IF NOT EXISTS idx_share_certificates_company_cin ON share_certificates(company_cin);
CREATE INDEX IF NOT EXISTS idx_share_certificates_certificate_no ON share_certificates(certificate_no);
CREATE INDEX IF NOT EXISTS idx_share_certificates_type ON share_certificates(certificate_type);
CREATE INDEX IF NOT EXISTS idx_share_certificates_folio_no ON share_certificates(folio_no);

-- Debenture Holders Table
CREATE TABLE IF NOT EXISTS debenture_holders (
    id SERIAL PRIMARY KEY,
    company_id INTEGER,
    company_cin VARCHAR(21),
    holder_name VARCHAR(500) NOT NULL,
    debenture_no VARCHAR(100),
    debenture_type VARCHAR(200),
    units BIGINT DEFAULT 0,
    face_value DECIMAL(15, 2),
    issue_date DATE,
    maturity_date DATE,
    interest_rate DECIMAL(5, 2),
    status VARCHAR(50) DEFAULT 'Active',
    pan VARCHAR(20),
    email VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES user_companies(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_debenture_holders_company_id ON debenture_holders(company_id);
CREATE INDEX IF NOT EXISTS idx_debenture_holders_company_cin ON debenture_holders(company_cin);
CREATE INDEX IF NOT EXISTS idx_debenture_holders_debenture_no ON debenture_holders(debenture_no);
CREATE INDEX IF NOT EXISTS idx_debenture_holders_status ON debenture_holders(status);

-- ============================================================================
-- CAPITAL STRUCTURE
-- ============================================================================

-- Authorized Capital Table
CREATE TABLE IF NOT EXISTS authorized_capital (
    id SERIAL PRIMARY KEY,
    company_id INTEGER,
    share_class VARCHAR(200) NOT NULL,
    authorized_shares BIGINT NOT NULL,
    face_value DECIMAL(15, 2) NOT NULL,
    total_amount DECIMAL(20, 2) NOT NULL,
    amendment_date DATE,
    created_by INTEGER,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_authorized_capital_company_id ON authorized_capital(company_id);
CREATE INDEX IF NOT EXISTS idx_authorized_capital_share_class ON authorized_capital(share_class);

-- Paid Up Capital Table
CREATE TABLE IF NOT EXISTS paid_up_capital (
    id SERIAL PRIMARY KEY,
    company_id INTEGER,
    share_class VARCHAR(200) NOT NULL,
    paid_up_shares BIGINT NOT NULL,
    face_value DECIMAL(15, 2) NOT NULL,
    total_amount DECIMAL(20, 2) NOT NULL,
    subscription_date DATE,
    created_by INTEGER,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_paid_up_capital_company_id ON paid_up_capital(company_id);
CREATE INDEX IF NOT EXISTS idx_paid_up_capital_share_class ON paid_up_capital(share_class);

-- Share Capital Table
CREATE TABLE IF NOT EXISTS share_capital (
    id SERIAL PRIMARY KEY,
    company_id INTEGER,
    share_class VARCHAR(200) NOT NULL,
    authorized_shares BIGINT NOT NULL,
    paid_up_shares BIGINT NOT NULL,
    face_value DECIMAL(15, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_by INTEGER,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_share_capital_company_id ON share_capital(company_id);
CREATE INDEX IF NOT EXISTS idx_share_capital_share_class ON share_capital(share_class);
CREATE INDEX IF NOT EXISTS idx_share_capital_status ON share_capital(status);

-- Shareholder Transactions Table
CREATE TABLE IF NOT EXISTS shareholder_transactions (
    id SERIAL PRIMARY KEY,
    company_id INTEGER,
    shareholder_id INTEGER,
    shareholder_name VARCHAR(500) NOT NULL,
    folio_no VARCHAR(100),
    transaction_type VARCHAR(100) NOT NULL,
    shares INTEGER NOT NULL,
    transaction_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    remarks TEXT,
    created_by INTEGER,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_shareholder_trans_company_id ON shareholder_transactions(company_id);
CREATE INDEX IF NOT EXISTS idx_shareholder_trans_shareholder_id ON shareholder_transactions(shareholder_id);
CREATE INDEX IF NOT EXISTS idx_shareholder_trans_folio_no ON shareholder_transactions(folio_no);
CREATE INDEX IF NOT EXISTS idx_shareholder_trans_status ON shareholder_transactions(status);

-- ============================================================================
-- MEETINGS AND AGENDAS
-- ============================================================================

-- Agendas Table
CREATE TABLE IF NOT EXISTS agendas (
    id SERIAL PRIMARY KEY,
    company_id INTEGER,
    agenda_title VARCHAR(500) NOT NULL,
    description TEXT,
    meeting_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Active',
    created_date DATE DEFAULT CURRENT_DATE,
    created_by INTEGER,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_agendas_company_id ON agendas(company_id);
CREATE INDEX IF NOT EXISTS idx_agendas_meeting_type ON agendas(meeting_type);
CREATE INDEX IF NOT EXISTS idx_agendas_status ON agendas(status);

-- Board Meetings Table
CREATE TABLE IF NOT EXISTS board_meetings (
    id SERIAL PRIMARY KEY,
    company_id INTEGER,
    meeting_no VARCHAR(100) NOT NULL UNIQUE,
    meeting_date DATE NOT NULL,
    venue VARCHAR(500),
    attendees INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Scheduled',
    agenda_items TEXT,
    minutes TEXT,
    created_by INTEGER,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_board_meetings_company_id ON board_meetings(company_id);
CREATE INDEX IF NOT EXISTS idx_board_meetings_meeting_date ON board_meetings(meeting_date);
CREATE INDEX IF NOT EXISTS idx_board_meetings_status ON board_meetings(status);

-- AGM Meetings Table
CREATE TABLE IF NOT EXISTS agm_meetings (
    id SERIAL PRIMARY KEY,
    company_id INTEGER,
    financial_year VARCHAR(20) NOT NULL,
    meeting_date DATE NOT NULL,
    venue VARCHAR(500),
    shareholders INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Scheduled',
    notice_sent_date DATE,
    annual_report_url VARCHAR(500),
    created_by INTEGER,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_agm_meetings_company_id ON agm_meetings(company_id);
CREATE INDEX IF NOT EXISTS idx_agm_meetings_financial_year ON agm_meetings(financial_year);
CREATE INDEX IF NOT EXISTS idx_agm_meetings_status ON agm_meetings(status);

-- EGM Meetings Table
CREATE TABLE IF NOT EXISTS egm_meetings (
    id SERIAL PRIMARY KEY,
    company_id INTEGER,
    meeting_no VARCHAR(100) NOT NULL UNIQUE,
    meeting_date DATE NOT NULL,
    purpose TEXT NOT NULL,
    venue VARCHAR(500),
    status VARCHAR(50) DEFAULT 'Scheduled',
    notice_sent_date DATE,
    special_resolutions TEXT,
    created_by INTEGER,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_egm_meetings_company_id ON egm_meetings(company_id);
CREATE INDEX IF NOT EXISTS idx_egm_meetings_meeting_date ON egm_meetings(meeting_date);
CREATE INDEX IF NOT EXISTS idx_egm_meetings_status ON egm_meetings(status);

-- Committee Meetings Table
CREATE TABLE IF NOT EXISTS committee_meetings (
    id SERIAL PRIMARY KEY,
    company_id INTEGER,
    meeting_no VARCHAR(100) NOT NULL UNIQUE,
    committee_type VARCHAR(200) NOT NULL,
    meeting_date DATE NOT NULL,
    venue VARCHAR(500),
    members INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Scheduled',
    agenda_items TEXT,
    minutes TEXT,
    created_by INTEGER,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_committee_meetings_company_id ON committee_meetings(company_id);
CREATE INDEX IF NOT EXISTS idx_committee_meetings_committee_type ON committee_meetings(committee_type);
CREATE INDEX IF NOT EXISTS idx_committee_meetings_status ON committee_meetings(status);

-- ============================================================================
-- FORM SUBMISSIONS - PHASE 1 & 2
-- ============================================================================

-- ADT1 Submissions
CREATE TABLE IF NOT EXISTS adt1_submissions (
    id SERIAL PRIMARY KEY,
    ref_user_id INTEGER,
    company_id INTEGER NOT NULL,
    cin VARCHAR(50) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    company_address VARCHAR(500),
    company_email VARCHAR(255),
    falling_section VARCHAR(255),
    appointment_nature VARCHAR(255),
    is_auditor_appointed VARCHAR(50),
    auditor_number NUMERIC,
    annual_general_meeting VARCHAR(255),
    agm_date TIMESTAMP,
    appointment_date TIMESTAMP,
    is_casual_vacancy VARCHAR(50),
    srn_of_relevant_form VARCHAR(255),
    person_vacated VARCHAR(255),
    vacancy_date TIMESTAMP,
    casual_vacancy_reasons VARCHAR(500),
    membership_number NUMERIC,
    auditor_serial BOOLEAN,
    auditor_member_no VARCHAR(255),
    resolution_number VARCHAR(255),
    resolution_date TIMESTAMP,
    signed_by VARCHAR(255),
    designation VARCHAR(255),
    din VARCHAR(50),
    ref_user_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- BEN2 Submissions
CREATE TABLE IF NOT EXISTS ben2_submissions (
    id SERIAL PRIMARY KEY,
    ref_user Integer NULL,
    company_id Integer NULL,
    cin VARCHAR(255) NULL,
    company_name VARCHAR(255) NULL,
    company_address VARCHAR(255) NULL,
    company_email VARCHAR(255) NULL,
    reporting_company Boolean NULL,
    declaration_ownership Boolean NULL,
    change_ownership Boolean NULL,
    change_exiting Boolean NULL,
    change_reporting_company Boolean NULL,
    cin_holding_company Integer NULL,
    name_holding_company VARCHAR(255) NULL,
    number_of_significant_owners Integer NULL,
    copy_attachment VARCHAR(255) NULL,
    optional_attachment VARCHAR(255) NULL,
    resolution_number Integer NULL,
    resolution_date TIMESTAMP NULL,
    designation VARCHAR(255) NULL,
    signitory VARCHAR(255) NULL,
    din_pan VARCHAR(255) NULL,
    category VARCHAR(255) NULL,
    name_of_pcs VARCHAR(255) NULL,
    associate_or_fellow VARCHAR(255) NULL,
    membership_number Integer NULL,
    ref_user_name VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- PAS3 Submissions
CREATE TABLE IF NOT EXISTS pas3_submissions (
    id SERIAL PRIMARY KEY,
    ref_user Integer NULL,
    company_id Integer NULL,
    cin VARCHAR(255) NULL,
    company_name VARCHAR(255) NULL,
    company_address VARCHAR(255) NULL,
    company_email VARCHAR(255) NULL,
    number_of_allotments Integer NULL,
    no_of_classes_preference Integer NULL,
    no_of_classes_equity Integer NULL,
    no_of_unclassified Integer NULL,
    total_unclassified Integer NULL,
    debentures Integer NULL,
    loan_secured Integer NULL,
    others Integer NULL,
    equity_authorized_capital VARCHAR(255) NULL,
    equity_paidup_capital VARCHAR(255) NULL,
    allottees_list VARCHAR(255) NULL,
    another_attachment VARCHAR(255) NULL,
    optional_attachment VARCHAR(255) NULL,
    resolution_number VARCHAR(255) NULL,
    resolution_date TIMESTAMP NULL,
    designation VARCHAR(255) NULL,
    signatory VARCHAR(255) NULL,
    category VARCHAR(255) NULL,
    name_of_pcs VARCHAR(255) NULL,
    assososiate_or_fellow VARCHAR(255) NULL,
    membership_number Integer NULL,
    equity_share_list VARCHAR(255) NULL,
    preference_share_list VARCHAR(255) NULL,
    ref_user_name VARCHAR(255) NULL,
    parent_id Integer NULL,
    type VARCHAR(255) NULL,
    class_of_shares VARCHAR(255) NULL,
    authorized_capital Float NULL,
    issued_capital Float NULL,
    subscribed_capital Float NULL,
    paid_up_capital Float NULL,
    nominal_amount_per_share Float NULL,
    nominal_amount_per_share_issue Float NULL,
    nominal_amount_per_share_sub Float NULL,
    nominal_amount_per_share_paid Float NULL,
    total_amount_shares Float NULL,
    total_amount_shares_issue Float NULL,
    total_amount_shares_sub Float NULL,
    total_amount_shares_paid Float NULL,
    deleted_on TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- DPT3 Submissions
CREATE TABLE IF NOT EXISTS dpt3_submissions (
    id SERIAL PRIMARY KEY,
    ref_user Integer NULL,
    company_id Integer NULL,
    cin VARCHAR(255) NULL,
    company_name VARCHAR(255) NULL,
    company_address VARCHAR(255) NULL,
    company_email VARCHAR(255) NULL,
    type VARCHAR(255) NULL,
    form_purpose VARCHAR(255) NULL,
    is_gov VARCHAR(255) NULL,
    company_objects VARCHAR(255) NULL,
    deposit_accepted VARCHAR(255) NULL,
    return_period TIMESTAMP NULL,
    date_of_issue TIMESTAMP NULL,
    date_of_expiry TIMESTAMP NULL,
    paid_up_share_capital Float NULL,
    free_reserves Float NULL,
    securities_premium_account Float NULL,
    accumulated_loss Float NULL,
    deferred_revenue_expenditure_balance Float NULL,
    accumulated_unprovided_depreciation Float NULL,
    miscellaneous_expense Float NULL,
    other_intangible_assets Float NULL,
    net_worth Float NULL,
    deposit_max_limit Float NULL,
    total_deposit_holders_start Integer NULL,
    total_deposit_holders_end Integer NULL,
    existing_deposits_start Integer NULL,
    deposits_renewed Integer NULL,
    secured_deposits Integer NULL,
    unsecured_deposits Integer NULL,
    deposits_repaid Integer NULL,
    deposits_outstanding Integer NULL,
    matured_not_claimed Integer NULL,
    matured_claimed_not_paid Integer NULL,
    deposits_maturing_before_march Integer NULL,
    deposits_maturing_following_next_year Integer NULL,
    amount_required_in_liquid_assets Float NULL,
    current_deposits_free_from_charge Float NULL,
    face_value_gov_securities Float NULL,
    market_value_gov_securities Float NULL,
    face_value_trust_securities Float NULL,
    market_value_trust_securities Float NULL,
    credit_rating_agency VARCHAR(255) NULL,
    credit_rating VARCHAR(255) NULL,
    credit_rating_date TIMESTAMP NULL,
    gnl_form_srn VARCHAR(255) NULL,
    auditor_name VARCHAR(255) NULL,
    auditor_designation VARCHAR(255) NULL,
    membership_number VARCHAR(255) NULL,
    resolution_number VARCHAR(255) NULL,
    declaration_date TIMESTAMP NULL,
    signatory_designation VARCHAR(255) NULL,
    signatory_id VARCHAR(255) NULL,
    ref_user_name VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- FORM SUBMISSIONS - PHASE 3 (JSONB based)
-- ============================================================================

-- AOC4 Submissions
CREATE TABLE IF NOT EXISTS aoc4_submissions (
    id SERIAL PRIMARY KEY,
    company_id INTEGER,
    cin VARCHAR(50),
    company_name VARCHAR(255),
    contact_email VARCHAR(255),
    filing_period VARCHAR(255),
    submission_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AOC4CFS Submissions
CREATE TABLE IF NOT EXISTS aoc4cfs_submissions (
    id SERIAL PRIMARY KEY,
    company_id INTEGER,
    cin VARCHAR(50),
    company_name VARCHAR(255),
    contact_email VARCHAR(255),
    filing_period VARCHAR(255),
    submission_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- MGT7A Submissions
CREATE TABLE IF NOT EXISTS mgt7a_submissions (
    id SERIAL PRIMARY KEY,
    company_id INTEGER,
    cin VARCHAR(50),
    company_name VARCHAR(255),
    contact_email VARCHAR(255),
    filing_period VARCHAR(255),
    submission_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- MSME Submissions
CREATE TABLE IF NOT EXISTS msme_submissions (
    id SERIAL PRIMARY KEY,
    company_id INTEGER,
    cin VARCHAR(50),
    company_name VARCHAR(255),
    contact_email VARCHAR(255),
    filing_period VARCHAR(255),
    submission_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- MSME1 Submissions
CREATE TABLE IF NOT EXISTS msme1_submissions (
    id SERIAL PRIMARY KEY,
    company_id INTEGER,
    cin VARCHAR(50),
    company_name VARCHAR(255),
    contact_email VARCHAR(255),
    filing_period VARCHAR(255),
    submission_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- NDH1 Submissions
CREATE TABLE IF NOT EXISTS ndh1_submissions (
    id SERIAL PRIMARY KEY,
    company_id INTEGER,
    cin VARCHAR(50),
    company_name VARCHAR(255),
    contact_email VARCHAR(255),
    filing_period VARCHAR(255),
    submission_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- NDH2 Submissions
CREATE TABLE IF NOT EXISTS ndh2_submissions (
    id SERIAL PRIMARY KEY,
    company_id INTEGER,
    cin VARCHAR(50),
    company_name VARCHAR(255),
    contact_email VARCHAR(255),
    filing_period VARCHAR(255),
    submission_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- FORM SUBMISSIONS - PHASE 3+ (Generic structure)
-- ============================================================================

-- Generic form table creation function
DO $$
DECLARE
    form_tables TEXT[] := ARRAY[
        'tbl_boardreport', 'tbl_charge', 'tbl_chg1', 'tbl_chg4', 'tbl_chg6', 
        'tbl_chg8', 'tbl_chg9', 'tbl_dir3', 'tbl_dir5', 'tbl_dir6', 
        'tbl_dir9', 'tbl_dir11', 'tbl_dir12', 'tbl_dpt4', 'tbl_form3', 
        'tbl_form4', 'tbl_form5', 'tbl_form11', 'tbl_form12', 'tbl_form15', 
        'tbl_form22', 'tbl_form23', 'tbl_form24', 'tbl_form28', 'tbl_gnl1', 
        'tbl_gnl2', 'tbl_gnl3', 'tbl_iepf2', 'tbl_iepf5', 'tbl_inc4', 
        'tbl_inc12', 'tbl_inc20a', 'tbl_inc22', 'tbl_inc23', 'tbl_inc24', 
        'tbl_inc28', 'tbl_mgt6', 'tbl_mgt8', 'tbl_mgt9', 'tbl_mgt14', 
        'tbl_mr1', 'tbl_msc3', 'tbl_pas2', 'tbl_pas6', 'tbl_run', 
        'tbl_runllp', 'tbl_sh7', 'tbl_sh8', 'tbl_sh9', 'tbl_sh11', 'tbl_stk2'
    ];
    tbl_name TEXT;
BEGIN
    FOREACH tbl_name IN ARRAY form_tables
    LOOP
        EXECUTE format('
            CREATE TABLE IF NOT EXISTS %I (
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
            )', tbl_name);
    END LOOP;
END $$;

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function: Update search vector for full-text search
CREATE OR REPLACE FUNCTION update_company_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', COALESCE(NEW.company_name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.cin, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.city, '')), 'C') ||
        setweight(to_tsvector('english', COALESCE(NEW.state, '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for company cache search vector
DROP TRIGGER IF EXISTS trig_update_company_search_vector ON company_cache;
CREATE TRIGGER trig_update_company_search_vector
    BEFORE INSERT OR UPDATE ON company_cache
    FOR EACH ROW
    EXECUTE FUNCTION update_company_search_vector();

-- Function: Update cache timestamp
CREATE OR REPLACE FUNCTION update_cache_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.cache_updated_at := CURRENT_TIMESTAMP;
    NEW.last_accessed_at := CURRENT_TIMESTAMP;
    NEW.fetch_count := OLD.fetch_count + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for company cache timestamp
DROP TRIGGER IF EXISTS trig_update_company_cache_timestamp ON company_cache;
CREATE TRIGGER trig_update_company_cache_timestamp
    BEFORE UPDATE ON company_cache
    FOR EACH ROW
    EXECUTE FUNCTION update_cache_timestamp();

-- ============================================================================
-- GRANTS AND PERMISSIONS
-- ============================================================================

-- Grant permissions (assuming 'comply' user exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_user WHERE usename = 'comply') THEN
        GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO comply;
        GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO comply;
    END IF;
END $$;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE user_accounts IS 'User accounts for authentication';
COMMENT ON COLUMN user_accounts.subscription_status IS 'Subscription status: trial, active, expired, cancelled';
COMMENT ON COLUMN user_accounts.subscription_plan IS 'Subscription plan: starter, professional, enterprise';
COMMENT ON COLUMN user_accounts.trial_ends_at IS 'Date when trial period ends';
COMMENT ON COLUMN user_accounts.subscription_expires_at IS 'Date when subscription expires';
COMMENT ON COLUMN user_accounts.subscription_started_at IS 'Date when subscription was activated';
COMMENT ON TABLE otp_verifications IS 'OTP verification codes for phone number verification';
COMMENT ON TABLE password_reset_tokens IS 'Password reset tokens for user password recovery';
COMMENT ON TABLE user_companies IS 'Companies added by users to their account';
COMMENT ON TABLE company_cache IS 'Caches frequently accessed company data from MCA API';
COMMENT ON TABLE directors IS 'Directors and Key Managerial Personnel';
COMMENT ON TABLE shareholders IS 'Shareholders of companies';
COMMENT ON TABLE share_certificates IS 'Physical and Demat share certificates';
COMMENT ON TABLE debenture_holders IS 'Debenture holders of companies';

