-- Add discount fields to quotation_items table
ALTER TABLE public.quotation_items 
ADD COLUMN discount_percentage numeric DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100);

-- Add global discount field to quotations table
ALTER TABLE public.quotations 
ADD COLUMN discount_percentage numeric DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
ADD COLUMN discount_amount numeric DEFAULT 0;

-- Update existing records to have 0 discount
UPDATE public.quotation_items SET discount_percentage = 0 WHERE discount_percentage IS NULL;
UPDATE public.quotations SET discount_percentage = 0 WHERE discount_percentage IS NULL;
UPDATE public.quotations SET discount_amount = 0 WHERE discount_amount IS NULL;