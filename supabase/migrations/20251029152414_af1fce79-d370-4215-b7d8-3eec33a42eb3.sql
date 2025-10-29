-- Add tracking_number field to quotations table
ALTER TABLE public.quotations 
ADD COLUMN tracking_number TEXT;