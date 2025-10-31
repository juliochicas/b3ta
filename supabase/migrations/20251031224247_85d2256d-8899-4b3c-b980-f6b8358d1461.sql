-- Agregar foreign keys para asegurar integridad referencial
-- Esto asegura que no se puedan eliminar clientes si tienen informes, cotizaciones o facturas asociadas

-- Foreign key para consultation_reports
ALTER TABLE consultation_reports
ADD CONSTRAINT fk_consultation_reports_customer
FOREIGN KEY (customer_id) 
REFERENCES customers(id)
ON DELETE RESTRICT;

-- Foreign key para quotations  
ALTER TABLE quotations
ADD CONSTRAINT fk_quotations_customer
FOREIGN KEY (customer_id)
REFERENCES customers(id)
ON DELETE RESTRICT;

-- Foreign key para invoices
ALTER TABLE invoices
ADD CONSTRAINT fk_invoices_customer
FOREIGN KEY (customer_id)
REFERENCES customers(id)
ON DELETE RESTRICT;

-- Crear índices para mejorar performance en las consultas con JOIN
CREATE INDEX IF NOT EXISTS idx_consultation_reports_customer_id 
ON consultation_reports(customer_id);

CREATE INDEX IF NOT EXISTS idx_quotations_customer_id 
ON quotations(customer_id);

CREATE INDEX IF NOT EXISTS idx_invoices_customer_id 
ON invoices(customer_id);