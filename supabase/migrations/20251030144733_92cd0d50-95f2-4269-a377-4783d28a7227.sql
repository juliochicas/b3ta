-- Crear tabla de informes de consultoría
CREATE TABLE public.consultation_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_number TEXT NOT NULL UNIQUE,
  lead_id UUID REFERENCES public.leads_b3ta(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_company TEXT,
  customer_phone TEXT,
  sections_config JSONB NOT NULL DEFAULT '{"current_situation": true, "findings": true, "multimedia": true, "recommendations": true, "conclusions": true}'::jsonb,
  current_situation TEXT,
  findings TEXT,
  recommendations TEXT,
  conclusions TEXT,
  consultant_name TEXT NOT NULL,
  consultant_signature TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de multimedia asociada a informes
CREATE TABLE public.report_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID NOT NULL REFERENCES public.consultation_reports(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('photo', 'video')),
  url TEXT NOT NULL,
  is_external BOOLEAN NOT NULL DEFAULT false,
  caption TEXT,
  file_size BIGINT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Agregar columna report_id a tabla quotations para vincular informe
ALTER TABLE public.quotations 
ADD COLUMN report_id UUID REFERENCES public.consultation_reports(id) ON DELETE SET NULL;

-- Crear función para generar número de informe
CREATE OR REPLACE FUNCTION public.generate_report_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_number TEXT;
  year_month TEXT;
  sequence_num INTEGER;
BEGIN
  year_month := TO_CHAR(NOW(), 'YYYYMM');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(report_number FROM 8) AS INTEGER)), 0) + 1
  INTO sequence_num
  FROM public.consultation_reports
  WHERE report_number LIKE 'R-' || year_month || '%';
  
  new_number := 'R-' || year_month || '-' || LPAD(sequence_num::TEXT, 4, '0');
  
  RETURN new_number;
END;
$$;

-- Trigger para actualizar updated_at
CREATE TRIGGER update_consultation_reports_updated_at
BEFORE UPDATE ON public.consultation_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar RLS en ambas tablas
ALTER TABLE public.consultation_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_media ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para consultation_reports
CREATE POLICY "Admins and sales can view reports"
ON public.consultation_reports
FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'sales'::app_role)
);

CREATE POLICY "Admins and sales can create reports"
ON public.consultation_reports
FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'sales'::app_role)
);

CREATE POLICY "Admins and sales can update reports"
ON public.consultation_reports
FOR UPDATE
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'sales'::app_role)
);

CREATE POLICY "Admins can delete reports"
ON public.consultation_reports
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Políticas RLS para report_media
CREATE POLICY "Admins and sales can view media"
ON public.report_media
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.consultation_reports
    WHERE id = report_media.report_id
    AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'sales'::app_role))
  )
);

CREATE POLICY "Admins and sales can manage media"
ON public.report_media
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.consultation_reports
    WHERE id = report_media.report_id
    AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'sales'::app_role))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.consultation_reports
    WHERE id = report_media.report_id
    AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'sales'::app_role))
  )
);

-- Crear bucket de storage para archivos multimedia de informes
INSERT INTO storage.buckets (id, name, public) 
VALUES ('consultation-reports', 'consultation-reports', false)
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage para consultation-reports bucket
CREATE POLICY "Admins and sales can view files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'consultation-reports' AND
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'sales'::app_role))
);

CREATE POLICY "Admins and sales can upload files"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'consultation-reports' AND
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'sales'::app_role))
);

CREATE POLICY "Admins and sales can update files"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'consultation-reports' AND
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'sales'::app_role))
);

CREATE POLICY "Admins can delete files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'consultation-reports' AND
  has_role(auth.uid(), 'admin'::app_role)
);