-- Permitir a los administradores borrar leads
CREATE POLICY "Admins can delete leads"
ON leads_b3ta FOR DELETE
USING (has_role(auth.uid(), 'admin'));