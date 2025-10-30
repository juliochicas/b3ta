-- Crear tabla para múltiples cuentas de correo
CREATE TABLE public.email_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  smtp_host TEXT NOT NULL,
  smtp_port INTEGER NOT NULL DEFAULT 465,
  imap_host TEXT NOT NULL,
  imap_port INTEGER NOT NULL DEFAULT 993,
  password_encrypted TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices
CREATE INDEX idx_email_accounts_email ON public.email_accounts(email);
CREATE INDEX idx_email_accounts_is_active ON public.email_accounts(is_active);
CREATE INDEX idx_email_accounts_is_default ON public.email_accounts(is_default);

-- RLS
ALTER TABLE public.email_accounts ENABLE ROW LEVEL SECURITY;

-- Políticas: Admin y sales pueden ver todas las cuentas activas
CREATE POLICY "Admins and sales can view active email accounts"
ON public.email_accounts
FOR SELECT
USING (
  is_active = true AND 
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'sales'::app_role))
);

-- Solo admins pueden crear/editar cuentas
CREATE POLICY "Admins can manage email accounts"
ON public.email_accounts
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para updated_at
CREATE TRIGGER update_email_accounts_updated_at
BEFORE UPDATE ON public.email_accounts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Función para asegurar solo una cuenta default
CREATE OR REPLACE FUNCTION public.ensure_single_default_email_account()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = true THEN
    UPDATE public.email_accounts 
    SET is_default = false 
    WHERE id != NEW.id AND is_default = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER ensure_single_default_email_account_trigger
BEFORE INSERT OR UPDATE ON public.email_accounts
FOR EACH ROW
WHEN (NEW.is_default = true)
EXECUTE FUNCTION public.ensure_single_default_email_account();

-- Agregar columna account_id a la tabla emails
ALTER TABLE public.emails 
ADD COLUMN account_id UUID REFERENCES public.email_accounts(id) ON DELETE SET NULL;

CREATE INDEX idx_emails_account_id ON public.emails(account_id);

-- Agregar columna assigned_to para asignar correos a usuarios específicos
ALTER TABLE public.emails 
ADD COLUMN assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX idx_emails_assigned_to ON public.emails(assigned_to);

COMMENT ON TABLE public.email_accounts IS 'Almacena múltiples cuentas de correo para la organización';
COMMENT ON COLUMN public.email_accounts.password_encrypted IS 'Contraseña encriptada (se debe usar encriptación en la aplicación)';
COMMENT ON COLUMN public.emails.account_id IS 'Cuenta de correo asociada a este email';
COMMENT ON COLUMN public.emails.assigned_to IS 'Usuario asignado para dar seguimiento a este correo';