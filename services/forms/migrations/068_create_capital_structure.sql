-- Create authorized_capital table
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

-- Create paid_up_capital table
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

-- Create share_capital table (comprehensive view)
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

-- Indexes for authorized_capital
CREATE INDEX IF NOT EXISTS idx_authorized_capital_company_id ON authorized_capital(company_id);
CREATE INDEX IF NOT EXISTS idx_authorized_capital_share_class ON authorized_capital(share_class);

-- Indexes for paid_up_capital
CREATE INDEX IF NOT EXISTS idx_paid_up_capital_company_id ON paid_up_capital(company_id);
CREATE INDEX IF NOT EXISTS idx_paid_up_capital_share_class ON paid_up_capital(share_class);

-- Indexes for share_capital
CREATE INDEX IF NOT EXISTS idx_share_capital_company_id ON share_capital(company_id);
CREATE INDEX IF NOT EXISTS idx_share_capital_share_class ON share_capital(share_class);
CREATE INDEX IF NOT EXISTS idx_share_capital_status ON share_capital(status);

COMMENT ON TABLE authorized_capital IS 'Stores authorized capital details';
COMMENT ON TABLE paid_up_capital IS 'Stores paid-up capital details';
COMMENT ON TABLE share_capital IS 'Comprehensive share capital structure';

