-- Fix quotation number generation substring index
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
  
  -- The sequence starts at index 10 in the string 'Q-YYYYMM-XXXX'
  SELECT COALESCE(MAX(CAST(SUBSTRING(quotation_number FROM 10) AS INTEGER)), 0) + 1
  INTO sequence_num
  FROM public.quotations
  WHERE quotation_number LIKE 'Q-' || year_month || '%';
  
  new_number := 'Q-' || year_month || '-' || LPAD(sequence_num::TEXT, 4, '0');
  
  RETURN new_number;
END;
$$;
