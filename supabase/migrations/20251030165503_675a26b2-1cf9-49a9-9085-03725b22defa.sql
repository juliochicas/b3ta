-- Arreglar la función generate_report_slug para usar gen_random_uuid en lugar de gen_random_bytes
CREATE OR REPLACE FUNCTION public.generate_report_slug()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_slug TEXT;
  slug_exists BOOLEAN;
BEGIN
  LOOP
    -- Generar slug aleatorio usando gen_random_uuid que siempre está disponible
    new_slug := encode(decode(replace(gen_random_uuid()::text, '-', ''), 'hex'), 'base64');
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