-- User Companies Table
-- Stores companies that users have added to their account

CREATE TABLE IF NOT EXISTS user_companies (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    cin VARCHAR(21) NOT NULL,
    company_name VARCHAR(500) NOT NULL,
    company_status VARCHAR(50),
    company_class VARCHAR(100),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id, cin)
);

CREATE INDEX IF NOT EXISTS idx_user_companies_user_id ON user_companies(user_id);
CREATE INDEX IF NOT EXISTS idx_user_companies_cin ON user_companies(cin);
CREATE INDEX IF NOT EXISTS idx_user_companies_active ON user_companies(user_id, is_active);

COMMENT ON TABLE user_companies IS 'Companies added by users to their account';

