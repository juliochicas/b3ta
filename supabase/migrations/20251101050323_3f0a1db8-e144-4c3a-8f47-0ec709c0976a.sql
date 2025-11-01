-- Fix meetings table: created_by should NOT be nullable
-- since it's required for RLS policies and represents the organizer

-- First, set any null values to a default (shouldn't exist but safety first)
UPDATE meetings 
SET created_by = (SELECT id FROM auth.users LIMIT 1)
WHERE created_by IS NULL;

-- Now make it NOT NULL
ALTER TABLE meetings 
ALTER COLUMN created_by SET NOT NULL;