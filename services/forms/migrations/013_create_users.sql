-- Create users table for signup/auth
CREATE TABLE IF NOT EXISTS user_accounts (
    id SERIAL PRIMARY KEY,
    username VARCHAR(150) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Helpful index for auth lookups
CREATE INDEX IF NOT EXISTS ix_user_accounts_username ON user_accounts (username);
CREATE INDEX IF NOT EXISTS ix_user_accounts_email ON user_accounts (email);


