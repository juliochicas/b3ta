
-- Add hosting service management fields to client_pages
ALTER TABLE public.client_pages
ADD COLUMN service_type text NOT NULL DEFAULT 'test', -- 'test', 'active', 'expired', 'cancelled'
ADD COLUMN service_start_date date NULL,
ADD COLUMN service_expiration_date date NULL,
ADD COLUMN monthly_fee numeric NULL DEFAULT 0,
ADD COLUMN currency text NOT NULL DEFAULT 'USD',
ADD COLUMN renewal_conditions text NULL,
ADD COLUMN auto_renew boolean NOT NULL DEFAULT false,
ADD COLUMN last_payment_date date NULL,
ADD COLUMN next_payment_date date NULL;
