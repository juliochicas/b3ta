-- Create emails table
CREATE TABLE IF NOT EXISTS public.emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id TEXT,
  from_email TEXT NOT NULL,
  to_email TEXT[] NOT NULL,
  cc_email TEXT[],
  bcc_email TEXT[],
  subject TEXT NOT NULL,
  body_text TEXT,
  body_html TEXT,
  thread_id TEXT,
  in_reply_to TEXT,
  email_references TEXT[],
  has_attachments BOOLEAN DEFAULT FALSE,
  is_read BOOLEAN DEFAULT FALSE,
  is_starred BOOLEAN DEFAULT FALSE,
  is_draft BOOLEAN DEFAULT FALSE,
  is_sent BOOLEAN DEFAULT FALSE,
  folder TEXT NOT NULL DEFAULT 'inbox',
  lead_id UUID REFERENCES public.leads_b3ta(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  received_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create email attachments table
CREATE TABLE IF NOT EXISTS public.email_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email_id UUID REFERENCES public.emails(id) ON DELETE CASCADE NOT NULL,
  filename TEXT NOT NULL,
  content_type TEXT,
  size_bytes BIGINT,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_attachments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for emails
CREATE POLICY "Admins and sales can view all emails"
  ON public.emails FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'sales'::app_role));

CREATE POLICY "Admins and sales can create emails"
  ON public.emails FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'sales'::app_role));

CREATE POLICY "Admins and sales can update emails"
  ON public.emails FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'sales'::app_role));

CREATE POLICY "Admins can delete emails"
  ON public.emails FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for email_attachments
CREATE POLICY "Admins and sales can view attachments"
  ON public.email_attachments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.emails
      WHERE emails.id = email_attachments.email_id
      AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'sales'::app_role))
    )
  );

CREATE POLICY "Admins and sales can create attachments"
  ON public.email_attachments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.emails
      WHERE emails.id = email_attachments.email_id
      AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'sales'::app_role))
    )
  );

-- Create indexes
CREATE INDEX idx_emails_message_id ON public.emails(message_id);
CREATE INDEX idx_emails_thread_id ON public.emails(thread_id);
CREATE INDEX idx_emails_folder ON public.emails(folder);
CREATE INDEX idx_emails_is_read ON public.emails(is_read);
CREATE INDEX idx_emails_lead_id ON public.emails(lead_id);
CREATE INDEX idx_emails_customer_id ON public.emails(customer_id);
CREATE INDEX idx_emails_user_id ON public.emails(user_id);
CREATE INDEX idx_email_attachments_email_id ON public.email_attachments(email_id);

-- Trigger to update updated_at
CREATE TRIGGER update_emails_updated_at
  BEFORE UPDATE ON public.emails
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();