-- Agregar foreign keys faltantes para meetings
-- Esto permite hacer JOIN con leads y customers

ALTER TABLE meetings
ADD CONSTRAINT fk_meetings_lead
FOREIGN KEY (lead_id) 
REFERENCES leads_b3ta(id)
ON DELETE SET NULL;

ALTER TABLE meetings
ADD CONSTRAINT fk_meetings_customer
FOREIGN KEY (customer_id)
REFERENCES customers(id)
ON DELETE SET NULL;

-- Crear índices para performance
CREATE INDEX IF NOT EXISTS idx_meetings_lead_id 
ON meetings(lead_id);

CREATE INDEX IF NOT EXISTS idx_meetings_customer_id 
ON meetings(customer_id);

CREATE INDEX IF NOT EXISTS idx_meetings_scheduled_at 
ON meetings(scheduled_at);