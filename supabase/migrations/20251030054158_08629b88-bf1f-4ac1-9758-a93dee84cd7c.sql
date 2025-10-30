-- Add tags column to quotations table
ALTER TABLE public.quotations 
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Add comment to explain the column
COMMENT ON COLUMN public.quotations.tags IS 'Tags or labels for organizing and categorizing quotations';