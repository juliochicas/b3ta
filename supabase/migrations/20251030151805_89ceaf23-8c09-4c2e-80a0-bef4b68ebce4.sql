-- FASE 1: CORRECCIONES CRÍTICAS DE SEGURIDAD

-- 1. Agregar foreign keys faltantes
ALTER TABLE consultation_reports
ADD CONSTRAINT fk_consultation_reports_lead 
  FOREIGN KEY (lead_id) REFERENCES leads_b3ta(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_consultation_reports_creator 
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE quotations
ADD CONSTRAINT fk_quotations_lead 
  FOREIGN KEY (lead_id) REFERENCES leads_b3ta(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_quotations_report 
  FOREIGN KEY (report_id) REFERENCES consultation_reports(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_quotations_creator 
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. Hacer created_by NOT NULL con default para nuevas tablas
-- Primero actualizamos los registros existentes sin created_by
UPDATE consultation_reports 
SET created_by = (SELECT user_id FROM user_roles WHERE role = 'admin' LIMIT 1)
WHERE created_by IS NULL;

UPDATE quotations 
SET created_by = (SELECT user_id FROM user_roles WHERE role = 'admin' LIMIT 1)
WHERE created_by IS NULL;

-- Ahora hacemos la columna NOT NULL
ALTER TABLE consultation_reports 
ALTER COLUMN created_by SET NOT NULL,
ALTER COLUMN created_by SET DEFAULT auth.uid();

ALTER TABLE quotations 
ALTER COLUMN created_by SET NOT NULL,
ALTER COLUMN created_by SET DEFAULT auth.uid();

-- 3. Mejorar RLS policy pública (más restrictiva)
DROP POLICY IF EXISTS "Anyone can view reports with public slug" ON consultation_reports;

CREATE POLICY "Public can view published reports only"
ON consultation_reports
FOR SELECT
USING (public_slug IS NOT NULL AND status = 'sent');

-- 4. Agregar índices para performance
CREATE INDEX IF NOT EXISTS idx_consultation_reports_created_by ON consultation_reports(created_by);
CREATE INDEX IF NOT EXISTS idx_consultation_reports_lead_id ON consultation_reports(lead_id);
CREATE INDEX IF NOT EXISTS idx_consultation_reports_status ON consultation_reports(status);
CREATE INDEX IF NOT EXISTS idx_consultation_reports_public_slug ON consultation_reports(public_slug) WHERE public_slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_consultation_reports_created_at ON consultation_reports(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_quotations_created_by ON quotations(created_by);
CREATE INDEX IF NOT EXISTS idx_quotations_lead_id ON quotations(lead_id);
CREATE INDEX IF NOT EXISTS idx_quotations_report_id ON quotations(report_id);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);
CREATE INDEX IF NOT EXISTS idx_quotations_created_at ON quotations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_leads_b3ta_status ON leads_b3ta(status);
CREATE INDEX IF NOT EXISTS idx_leads_b3ta_assigned_to ON leads_b3ta(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_b3ta_email ON leads_b3ta(email);
CREATE INDEX IF NOT EXISTS idx_leads_b3ta_created_at ON leads_b3ta(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_report_media_report_id ON report_media(report_id);
CREATE INDEX IF NOT EXISTS idx_quotation_items_quotation_id ON quotation_items(quotation_id);
CREATE INDEX IF NOT EXISTS idx_quotation_expenses_quotation_id ON quotation_expenses(quotation_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);

-- 5. Agregar función para contar reportes (para paginación)
CREATE OR REPLACE FUNCTION count_consultation_reports()
RETURNS INTEGER
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER
  FROM consultation_reports
  WHERE has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'sales'::app_role);
$$;