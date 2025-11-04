-- Create master tables for Directors, Shareholders, Share Certificates, and Debenture Holders
-- These are linked to companies in user_companies table

-- ==================== DIRECTORS TABLE ====================
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

COMMENT ON TABLE directors IS 'Directors and Key Managerial Personnel';
COMMENT ON COLUMN directors.din IS 'Director Identification Number';


-- ==================== SHAREHOLDERS TABLE ====================
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

COMMENT ON TABLE shareholders IS 'Shareholders of companies';


-- ==================== SHARE CERTIFICATES TABLE ====================
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
CREATE INDEX IF NOT EXISTS idx_share_certificates_status ON share_certificates(status);

COMMENT ON TABLE share_certificates IS 'Physical and Demat share certificates';
COMMENT ON COLUMN share_certificates.certificate_type IS 'Physical or Demat';


-- ==================== DEBENTURE HOLDERS TABLE ====================
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

COMMENT ON TABLE debenture_holders IS 'Debenture holders of companies';

-- Show summary
SELECT 'Tables created successfully!' as message;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('directors', 'shareholders', 'share_certificates', 'debenture_holders');

