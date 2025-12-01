-- Migration: Add profession and firm_name fields, remove username requirement
-- Date: 2024-11-28

-- Add new columns to user_accounts table
ALTER TABLE user_accounts
ADD COLUMN IF NOT EXISTS profession VARCHAR(100),
ADD COLUMN IF NOT EXISTS firm_name VARCHAR(200);

-- Make username nullable (existing users may have username, new users won't)
ALTER TABLE user_accounts
ALTER COLUMN username DROP NOT NULL;

-- Create indexes for new fields if needed
CREATE INDEX IF NOT EXISTS ix_user_accounts_profession ON user_accounts (profession);
CREATE INDEX IF NOT EXISTS ix_user_accounts_firm_name ON user_accounts (firm_name);




