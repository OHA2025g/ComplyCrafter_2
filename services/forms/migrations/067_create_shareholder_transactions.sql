-- Create shareholder_transactions table for shareholder management
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

COMMENT ON TABLE shareholder_transactions IS 'Stores shareholder transactions (transfer, purchase, sale)';

