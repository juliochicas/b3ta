-- Tabla de facturas
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  quotation_id UUID REFERENCES public.quotations(id) ON DELETE SET NULL,
  
  -- Datos del cliente
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_company TEXT,
  
  -- Datos de pago
  stripe_payment_intent TEXT,
  stripe_charge_id TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  
  -- Montos
  subtotal DECIMAL(10, 2) NOT NULL,
  tax_rate DECIMAL(5, 2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  
  -- Fechas
  invoice_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  payment_date TIMESTAMP WITH TIME ZONE,
  due_date TIMESTAMP WITH TIME ZONE,
  
  -- Notas
  notes TEXT,
  terms_conditions TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE
);

-- Items de factura
CREATE TABLE IF NOT EXISTS public.invoice_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Función para generar número de factura
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  new_number TEXT;
  year_month TEXT;
  sequence_num INTEGER;
BEGIN
  year_month := TO_CHAR(NOW(), 'YYYYMM');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 8) AS INTEGER)), 0) + 1
  INTO sequence_num
  FROM public.invoices
  WHERE invoice_number LIKE 'F-' || year_month || '%';
  
  new_number := 'F-' || year_month || '-' || LPAD(sequence_num::TEXT, 4, '0');
  
  RETURN new_number;
END;
$$;

-- Trigger para actualizar updated_at
CREATE TRIGGER update_invoices_updated_at
BEFORE UPDATE ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- Políticas para invoices
CREATE POLICY "Users can view their own invoices"
ON public.invoices
FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role IN ('admin', 'sales')
  )
);

CREATE POLICY "Admin and sales can create invoices"
ON public.invoices
FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role IN ('admin', 'sales')
  )
);

CREATE POLICY "Admin and sales can update invoices"
ON public.invoices
FOR UPDATE
USING (
  auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role IN ('admin', 'sales')
  )
);

-- Políticas para invoice_items
CREATE POLICY "Users can view invoice items"
ON public.invoice_items
FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role IN ('admin', 'sales')
  )
);

CREATE POLICY "Admin and sales can manage invoice items"
ON public.invoice_items
FOR ALL
USING (
  auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role IN ('admin', 'sales')
  )
);

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_invoices_quotation_id ON public.invoices(quotation_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_email ON public.invoices(customer_email);
CREATE INDEX IF NOT EXISTS idx_invoices_payment_status ON public.invoices(payment_status);
CREATE INDEX IF NOT EXISTS idx_invoices_stripe_payment_intent ON public.invoices(stripe_payment_intent);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON public.invoice_items(invoice_id);