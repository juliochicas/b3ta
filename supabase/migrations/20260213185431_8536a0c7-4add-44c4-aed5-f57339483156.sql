
-- Table to store AI-generated quotations (Grand Slam results)
CREATE TABLE public.generated_quotations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT,
  customer_company TEXT,
  currency TEXT NOT NULL DEFAULT 'USD',
  result_json JSONB NOT NULL,
  client_page_id UUID REFERENCES public.client_pages(id) ON DELETE SET NULL,
  created_by UUID NOT NULL DEFAULT auth.uid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.generated_quotations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and sales can manage generated quotations"
  ON public.generated_quotations FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'sales'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'sales'::app_role));

CREATE TRIGGER update_generated_quotations_updated_at
  BEFORE UPDATE ON public.generated_quotations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
