-- Add credit card surcharge fields to quotations table
ALTER TABLE public.quotations ADD COLUMN apply_credit_card_fee BOOLEAN DEFAULT false;
ALTER TABLE public.quotations ADD COLUMN credit_card_fee_amount DECIMAL(10,2) DEFAULT 0;
