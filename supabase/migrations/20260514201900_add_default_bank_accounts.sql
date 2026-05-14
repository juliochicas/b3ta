-- Add default_bank_accounts to user_settings table
ALTER TABLE public.user_settings ADD COLUMN default_bank_accounts TEXT;
