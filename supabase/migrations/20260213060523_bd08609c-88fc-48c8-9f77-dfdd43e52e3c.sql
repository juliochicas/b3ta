
-- Table to track uploaded client HTML pages
CREATE TABLE public.client_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  html_storage_path TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL DEFAULT auth.uid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.client_pages ENABLE ROW LEVEL SECURITY;

-- Admins and sales can manage
CREATE POLICY "Admins and sales can manage client pages"
ON public.client_pages FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'sales'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'sales'::app_role));

-- Public can view active pages (for the public route)
CREATE POLICY "Public can view active client pages"
ON public.client_pages FOR SELECT
USING (is_active = true);

-- Trigger for updated_at
CREATE TRIGGER update_client_pages_updated_at
BEFORE UPDATE ON public.client_pages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for HTML files
INSERT INTO storage.buckets (id, name, public) VALUES ('client-pages', 'client-pages', true);

-- Anyone can view files in the bucket (public)
CREATE POLICY "Anyone can view client page files"
ON storage.objects FOR SELECT
USING (bucket_id = 'client-pages');

-- Admins and sales can upload
CREATE POLICY "Admins and sales can upload client page files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'client-pages' AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'sales'::app_role)));

-- Admins and sales can update
CREATE POLICY "Admins and sales can update client page files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'client-pages' AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'sales'::app_role)));

-- Admins can delete
CREATE POLICY "Admins can delete client page files"
ON storage.objects FOR DELETE
USING (bucket_id = 'client-pages' AND has_role(auth.uid(), 'admin'::app_role));
