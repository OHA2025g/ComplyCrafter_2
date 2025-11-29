-- Migration: Add OTP, CCPIN, and Phone Number support to user accounts
-- Date: 2024

-- Add new columns to user_accounts table
ALTER TABLE user_accounts
ADD COLUMN IF NOT EXISTS first_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS last_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20),
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS ccpin_hash VARCHAR(255);

-- Create index on phone_number for faster lookups
CREATE INDEX IF NOT EXISTS ix_user_accounts_phone_number ON user_accounts (phone_number);

-- Create OTP verifications table
CREATE TABLE IF NOT EXISTS otp_verifications (
    id SERIAL PRIMARY KEY,
    phone_number VARCHAR(20) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITHOUT TIME ZONE NULL
);

-- Create indexes for OTP table
CREATE INDEX IF NOT EXISTS ix_otp_verifications_phone_number ON otp_verifications (phone_number);
CREATE INDEX IF NOT EXISTS ix_otp_verifications_phone_otp ON otp_verifications (phone_number, otp_code);
CREATE INDEX IF NOT EXISTS ix_otp_verifications_expires_at ON otp_verifications (expires_at);

-- Clean up expired OTPs (optional: can be done via scheduled job)
-- DELETE FROM otp_verifications WHERE expires_at < NOW() - INTERVAL '1 day';

