-- Update user_companies table to match Name of Entities format
-- Add incorporation_date column and rename company_class to entity_type

-- Add incorporation_date column if it doesn't exist
ALTER TABLE user_companies 
ADD COLUMN IF NOT EXISTS incorporation_date DATE;

-- Rename company_class to entity_type (more appropriate name)
-- Note: PostgreSQL doesn't have a direct RENAME COLUMN IF EXISTS
DO $$ 
BEGIN
    IF EXISTS(SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'user_companies' AND column_name = 'company_class') THEN
        ALTER TABLE user_companies RENAME COLUMN company_class TO entity_type;
    END IF;
END $$;

-- Add index for incorporation_date for better query performance
CREATE INDEX IF NOT EXISTS idx_user_companies_incorporation_date 
ON user_companies(incorporation_date);

-- Update existing records with sample incorporation dates
UPDATE user_companies 
SET incorporation_date = added_at::date 
WHERE incorporation_date IS NULL;

COMMENT ON COLUMN user_companies.incorporation_date IS 'Date of incorporation of the entity';
COMMENT ON COLUMN user_companies.entity_type IS 'Type of entity (Private Limited, Public Limited, LLP, etc.)';

-- Show updated structure
SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_companies' 
ORDER BY ordinal_position;

