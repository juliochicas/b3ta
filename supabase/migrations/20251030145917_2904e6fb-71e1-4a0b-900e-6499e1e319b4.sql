-- Agregar columna para slug público único
ALTER TABLE public.consultation_reports 
ADD COLUMN public_slug TEXT UNIQUE;

-- Crear índice para búsquedas rápidas por slug
CREATE INDEX idx_consultation_reports_public_slug 
ON public.consultation_reports(public_slug);

-- Función para generar slug único
CREATE OR REPLACE FUNCTION public.generate_report_slug()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_slug TEXT;
  slug_exists BOOLEAN;
BEGIN
  LOOP
    -- Generar slug aleatorio de 12 caracteres
    new_slug := encode(gen_random_bytes(9), 'base64');
    new_slug := replace(replace(replace(new_slug, '/', ''), '+', ''), '=', '');
    new_slug := lower(substring(new_slug, 1, 12));
    
    -- Verificar si ya existe
    SELECT EXISTS(
      SELECT 1 FROM public.consultation_reports 
      WHERE public_slug = new_slug
    ) INTO slug_exists;
    
    EXIT WHEN NOT slug_exists;
  END LOOP;
  
  RETURN new_slug;
END;
$$;

-- Hacer público el bucket de consultation-reports
UPDATE storage.buckets 
SET public = true 
WHERE id = 'consultation-reports';

-- Política RLS para permitir lectura pública de informes con slug
CREATE POLICY "Anyone can view reports with public slug"
ON public.consultation_reports
FOR SELECT
USING (public_slug IS NOT NULL);

-- Política RLS para permitir lectura pública de media de informes públicos
CREATE POLICY "Anyone can view media of public reports"
ON public.report_media
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.consultation_reports
    WHERE id = report_media.report_id
    AND public_slug IS NOT NULL
  )
);