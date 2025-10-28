-- Phase 3: AOC4CFS table
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
