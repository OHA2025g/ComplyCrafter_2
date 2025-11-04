-- MCA Companies Cache Table
-- Stores cached company data from MCA API for fast lookups

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

-- Create indexes for fast searching
CREATE INDEX IF NOT EXISTS idx_mca_company_name ON mca_companies_cache USING gin(to_tsvector('english', company_name));
CREATE INDEX IF NOT EXISTS idx_mca_cin ON mca_companies_cache(cin);
CREATE INDEX IF NOT EXISTS idx_mca_company_name_lower ON mca_companies_cache(LOWER(company_name));
CREATE INDEX IF NOT EXISTS idx_mca_cached_at ON mca_companies_cache(cached_at DESC);

-- Add some sample data for testing
INSERT INTO mca_companies_cache (
    company_name, cin, company_status, company_class, registration_date, 
    authorized_capital, paid_up_capital
) VALUES
    ('ILLUMINATI INNOVATION PRIVATE LIMITED', 'U74999DL2020PTC123456', 'Active', 'Private', '01/01/2020', '100000', '100000'),
    ('PRIYA EXPRESS PRIVATE LIMITED', 'U60200MH2019PTC234567', 'Active', 'Private', '15/03/2019', '500000', '300000'),
    ('TEST COMPANY PRIVATE LIMITED', 'U12345MH2021PTC345678', 'Active', 'Private', '10/05/2021', '1000000', '500000')
ON CONFLICT (cin) DO NOTHING;

COMMENT ON TABLE mca_companies_cache IS 'Cached MCA company data for fast search - updated every 30 minutes';

