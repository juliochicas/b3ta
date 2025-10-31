-- Eliminar foreign keys duplicadas para resolver ambigüedad
-- Mantenemos solo las foreign keys con nombres explícitos que creamos

-- Para consultation_reports: eliminar la FK antigua, mantener fk_consultation_reports_customer
ALTER TABLE consultation_reports 
DROP CONSTRAINT IF EXISTS consultation_reports_customer_id_fkey;

-- Para quotations: eliminar la FK antigua, mantener fk_quotations_customer
ALTER TABLE quotations 
DROP CONSTRAINT IF EXISTS quotations_customer_id_fkey;

-- Para invoices: eliminar la FK antigua, mantener fk_invoices_customer
ALTER TABLE invoices 
DROP CONSTRAINT IF EXISTS invoices_customer_id_fkey;

-- Verificar que los índices existen (ya fueron creados anteriormente)
-- Si no existen, los creamos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'consultation_reports' 
    AND indexname = 'idx_consultation_reports_customer_id'
  ) THEN
    CREATE INDEX idx_consultation_reports_customer_id 
    ON consultation_reports(customer_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'quotations' 
    AND indexname = 'idx_quotations_customer_id'
  ) THEN
    CREATE INDEX idx_quotations_customer_id 
    ON quotations(customer_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'invoices' 
    AND indexname = 'idx_invoices_customer_id'
  ) THEN
    CREATE INDEX idx_invoices_customer_id 
    ON invoices(customer_id);
  END IF;
END $$;