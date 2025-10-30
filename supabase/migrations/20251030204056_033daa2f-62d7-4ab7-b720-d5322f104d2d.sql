-- Agregar política para que admins puedan eliminar correos permanentemente
CREATE POLICY "Admins can permanently delete emails"
ON public.emails
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));