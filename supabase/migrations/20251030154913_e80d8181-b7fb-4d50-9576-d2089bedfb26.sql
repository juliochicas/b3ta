-- Crear tabla centralizada de customers
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  tax_id TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  CONSTRAINT unique_customer_email UNIQUE(email)
);

-- Enable RLS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for customers
CREATE POLICY "Admins and sales can view customers"
ON public.customers FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'sales'::app_role));

CREATE POLICY "Admins and sales can create customers"
ON public.customers FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'sales'::app_role));

CREATE POLICY "Admins and sales can update customers"
ON public.customers FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'sales'::app_role));

CREATE POLICY "Admins can delete customers"
ON public.customers FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add indexes for performance
CREATE INDEX idx_customers_email ON public.customers(email);
CREATE INDEX idx_customers_created_by ON public.customers(created_by);
CREATE INDEX idx_customers_name ON public.customers(name);

-- Add customer_id to consultation_reports
ALTER TABLE public.consultation_reports 
ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id);

-- Add customer_id to quotations
ALTER TABLE public.quotations 
ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id);

-- Add customer_id to invoices
ALTER TABLE public.invoices 
ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id);

-- Trigger to auto-update updated_at
CREATE TRIGGER update_customers_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to migrate existing customer data
CREATE OR REPLACE FUNCTION public.migrate_customer_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Migrate from consultation_reports
  INSERT INTO public.customers (name, email, company, phone, created_by, created_at)
  SELECT DISTINCT 
    customer_name,
    customer_email,
    customer_company,
    customer_phone,
    created_by,
    MIN(created_at)
  FROM public.consultation_reports
  WHERE customer_email IS NOT NULL
  GROUP BY customer_name, customer_email, customer_company, customer_phone, created_by
  ON CONFLICT (email) DO NOTHING;

  -- Update consultation_reports with customer_id
  UPDATE public.consultation_reports cr
  SET customer_id = c.id
  FROM public.customers c
  WHERE cr.customer_email = c.email;

  -- Migrate from quotations
  INSERT INTO public.customers (name, email, company, created_by, created_at)
  SELECT DISTINCT 
    customer_name,
    customer_email,
    customer_company,
    created_by,
    MIN(created_at)
  FROM public.quotations
  WHERE customer_email IS NOT NULL
    AND customer_email NOT IN (SELECT email FROM public.customers)
  GROUP BY customer_name, customer_email, customer_company, created_by
  ON CONFLICT (email) DO NOTHING;

  -- Update quotations with customer_id
  UPDATE public.quotations q
  SET customer_id = c.id
  FROM public.customers c
  WHERE q.customer_email = c.email;

  -- Migrate from invoices
  INSERT INTO public.customers (name, email, company, created_by, created_at)
  SELECT DISTINCT 
    customer_name,
    customer_email,
    customer_company,
    (SELECT id FROM auth.users LIMIT 1),
    MIN(created_at)
  FROM public.invoices
  WHERE customer_email IS NOT NULL
    AND customer_email NOT IN (SELECT email FROM public.customers)
  GROUP BY customer_name, customer_email, customer_company
  ON CONFLICT (email) DO NOTHING;

  -- Update invoices with customer_id
  UPDATE public.invoices i
  SET customer_id = c.id
  FROM public.customers c
  WHERE i.customer_email = c.email;
END;
$$;

-- Execute migration
SELECT public.migrate_customer_data();