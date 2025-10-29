-- Corregir función de generación de números de cotización
CREATE OR REPLACE FUNCTION public.generate_quotation_number()
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
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(quotation_number FROM 8) AS INTEGER)), 0) + 1
  INTO sequence_num
  FROM public.quotations
  WHERE quotation_number LIKE 'Q-' || year_month || '%';
  
  new_number := 'Q-' || year_month || '-' || LPAD(sequence_num::TEXT, 4, '0');
  
  RETURN new_number;
END;
$$;