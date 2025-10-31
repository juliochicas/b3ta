-- ========================================
-- MIGRATION: Eliminar duplicidad de datos de clientes
-- ========================================

-- PASO 1: Asegurar que todos los registros tengan customer_id
-- Crear customer_id para consultation_reports sin relación
UPDATE public.consultation_reports cr
SET customer_id = c.id
FROM public.customers c
WHERE cr.customer_id IS NULL 
  AND cr.customer_email = c.email;

-- Crear clientes faltantes en consultation_reports
INSERT INTO public.customers (email, name, company, phone, created_by)
SELECT DISTINCT 
  cr.customer_email,
  cr.customer_name,
  cr.customer_company,
  cr.customer_phone,
  cr.created_by
FROM public.consultation_reports cr
WHERE cr.customer_id IS NULL
  AND cr.customer_email NOT IN (SELECT email FROM public.customers)
ON CONFLICT (email) DO NOTHING;

-- Actualizar consultation_reports con los nuevos customer_id
UPDATE public.consultation_reports cr
SET customer_id = c.id
FROM public.customers c
WHERE cr.customer_id IS NULL 
  AND cr.customer_email = c.email;

-- PASO 2: Hacer lo mismo para quotations
UPDATE public.quotations q
SET customer_id = c.id
FROM public.customers c
WHERE q.customer_id IS NULL 
  AND q.customer_email = c.email;

INSERT INTO public.customers (email, name, company, created_by)
SELECT DISTINCT 
  q.customer_email,
  q.customer_name,
  q.customer_company,
  q.created_by
FROM public.quotations q
WHERE q.customer_id IS NULL
  AND q.customer_email NOT IN (SELECT email FROM public.customers)
ON CONFLICT (email) DO NOTHING;

UPDATE public.quotations q
SET customer_id = c.id
FROM public.customers c
WHERE q.customer_id IS NULL 
  AND q.customer_email = c.email;

-- PASO 3: Hacer lo mismo para invoices
UPDATE public.invoices i
SET customer_id = c.id
FROM public.customers c
WHERE i.customer_id IS NULL 
  AND i.customer_email = c.email;

INSERT INTO public.customers (email, name, company, created_by)
SELECT DISTINCT 
  i.customer_email,
  i.customer_name,
  i.customer_company,
  (SELECT id FROM auth.users LIMIT 1) as created_by
FROM public.invoices i
WHERE i.customer_id IS NULL
  AND i.customer_email NOT IN (SELECT email FROM public.customers)
ON CONFLICT (email) DO NOTHING;

UPDATE public.invoices i
SET customer_id = c.id
FROM public.customers c
WHERE i.customer_id IS NULL 
  AND i.customer_email = c.email;

-- PASO 4: Hacer customer_id NOT NULL y eliminar columnas duplicadas

-- Consultation Reports
ALTER TABLE public.consultation_reports 
  ALTER COLUMN customer_id SET NOT NULL;

ALTER TABLE public.consultation_reports 
  DROP COLUMN IF EXISTS customer_name,
  DROP COLUMN IF EXISTS customer_email,
  DROP COLUMN IF EXISTS customer_company,
  DROP COLUMN IF EXISTS customer_phone;

-- Quotations  
ALTER TABLE public.quotations 
  ALTER COLUMN customer_id SET NOT NULL;

ALTER TABLE public.quotations 
  DROP COLUMN IF EXISTS customer_name,
  DROP COLUMN IF EXISTS customer_email,
  DROP COLUMN IF EXISTS customer_company;

-- Invoices
ALTER TABLE public.invoices 
  ALTER COLUMN customer_id SET NOT NULL;

ALTER TABLE public.invoices 
  DROP COLUMN IF EXISTS customer_name,
  DROP COLUMN IF EXISTS customer_email,
  DROP COLUMN IF EXISTS customer_company;

-- PASO 5: Agregar índices para mejorar performance de JOINs
CREATE INDEX IF NOT EXISTS idx_consultation_reports_customer_id 
  ON public.consultation_reports(customer_id);

CREATE INDEX IF NOT EXISTS idx_quotations_customer_id 
  ON public.quotations(customer_id);

CREATE INDEX IF NOT EXISTS idx_invoices_customer_id 
  ON public.invoices(customer_id);

-- PASO 6: Agregar foreign keys explícitas si no existen
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'consultation_reports_customer_id_fkey'
  ) THEN
    ALTER TABLE public.consultation_reports 
      ADD CONSTRAINT consultation_reports_customer_id_fkey 
      FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'quotations_customer_id_fkey'
  ) THEN
    ALTER TABLE public.quotations 
      ADD CONSTRAINT quotations_customer_id_fkey 
      FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'invoices_customer_id_fkey'
  ) THEN
    ALTER TABLE public.invoices 
      ADD CONSTRAINT invoices_customer_id_fkey 
      FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE RESTRICT;
  END IF;
END $$;