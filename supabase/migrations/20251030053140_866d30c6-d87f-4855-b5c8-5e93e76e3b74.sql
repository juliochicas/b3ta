-- Create expense categories table
CREATE TABLE public.expense_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(name)
);

-- Enable RLS
ALTER TABLE public.expense_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Everyone can view active categories"
ON public.expense_categories
FOR SELECT
USING (is_active = true OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage categories"
ON public.expense_categories
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_expense_categories_updated_at
BEFORE UPDATE ON public.expense_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default categories
INSERT INTO public.expense_categories (name, description) VALUES
('Materiales', 'Materiales y suministros'),
('Mano de Obra', 'Costos de personal y mano de obra'),
('Equipo/Herramientas', 'Equipos y herramientas'),
('Transporte', 'Gastos de transporte y logística'),
('Subcontratistas', 'Servicios de subcontratistas'),
('Permisos/Licencias', 'Permisos y licencias requeridas'),
('Software/Servicios', 'Software y servicios digitales'),
('Marketing/Publicidad', 'Gastos de marketing y publicidad'),
('Administrativos', 'Gastos administrativos generales'),
('Otros', 'Otros gastos');

-- Update quotation_expenses to reference categories table
ALTER TABLE public.quotation_expenses 
DROP COLUMN category;

ALTER TABLE public.quotation_expenses 
ADD COLUMN category_id UUID REFERENCES public.expense_categories(id);

-- Create index for better performance
CREATE INDEX idx_quotation_expenses_category_id ON public.quotation_expenses(category_id);