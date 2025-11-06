-- Agregar columna imap_uid para rastrear correos en el servidor IMAP
ALTER TABLE public.emails 
ADD COLUMN IF NOT EXISTS imap_uid TEXT;

-- Crear índice para búsquedas más rápidas por IMAP UID
CREATE INDEX IF NOT EXISTS idx_emails_imap_uid 
ON public.emails(imap_uid, account_id);