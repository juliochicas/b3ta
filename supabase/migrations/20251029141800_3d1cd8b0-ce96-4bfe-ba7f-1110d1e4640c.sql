-- Tabla de productos y servicios
CREATE TABLE public.products_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('product', 'service', 'hourly')),
  unit_price DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla de cotizaciones
CREATE TABLE public.quotations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quotation_number TEXT NOT NULL UNIQUE,
  lead_id UUID REFERENCES public.leads_b3ta(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_company TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')),
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_rate DECIMAL(5,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  valid_until DATE,
  notes TEXT,
  terms_conditions TEXT,
  stripe_payment_link TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  sent_at TIMESTAMP WITH TIME ZONE
);

-- Tabla de items de cotización
CREATE TABLE public.quotation_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quotation_id UUID NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE,
  product_service_id UUID REFERENCES public.products_services(id) ON DELETE SET NULL,
  item_name TEXT NOT NULL,
  description TEXT,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.products_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_items ENABLE ROW LEVEL SECURITY;

-- Políticas para products_services
CREATE POLICY "Admins and sales can view products/services"
ON public.products_services FOR SELECT
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'sales'));

CREATE POLICY "Admins can manage products/services"
ON public.products_services FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Políticas para quotations
CREATE POLICY "Admins and sales can view quotations"
ON public.quotations FOR SELECT
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'sales'));

CREATE POLICY "Admins and sales can create quotations"
ON public.quotations FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'sales'));

CREATE POLICY "Admins and sales can update quotations"
ON public.quotations FOR UPDATE
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'sales'));

CREATE POLICY "Admins can delete quotations"
ON public.quotations FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Políticas para quotation_items
CREATE POLICY "Users can view items of accessible quotations"
ON public.quotation_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.quotations
    WHERE quotations.id = quotation_items.quotation_id
    AND (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'sales'))
  )
);

CREATE POLICY "Users can manage items of accessible quotations"
ON public.quotation_items FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.quotations
    WHERE quotations.id = quotation_items.quotation_id
    AND (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'sales'))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.quotations
    WHERE quotations.id = quotation_items.quotation_id
    AND (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'sales'))
  )
);

-- Trigger para actualizar updated_at
CREATE TRIGGER update_products_services_updated_at
BEFORE UPDATE ON public.products_services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quotations_updated_at
BEFORE UPDATE ON public.quotations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Función para generar número de cotización único
CREATE OR REPLACE FUNCTION public.generate_quotation_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_number TEXT;
  year_month TEXT;
  sequence_num INTEGER;
BEGIN
  year_month := TO_CHAR(NOW(), 'YYYYMM');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(quotation_number FROM 8) AS INTEGER)), 0) + 1
  INTO sequence_num
  FROM public.quotations
  WHERE quotation_number LIKE 'Q-' || year_month || '%';
  
  new_number := 'Q-' || year_month || '-' || LPAD(sequence_num::TEXT, 4, '0');
  
  RETURN new_number;
END;
$$;