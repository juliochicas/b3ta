
ALTER TABLE public.customers ADD COLUMN customer_number SERIAL;

-- Create unique index for fast lookup
CREATE UNIQUE INDEX idx_customers_number ON public.customers (customer_number);
