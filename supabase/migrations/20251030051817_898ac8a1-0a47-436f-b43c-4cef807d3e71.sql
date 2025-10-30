-- Create expenses table for quotations
CREATE TABLE public.quotation_expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quotation_id UUID NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quotation_expenses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for expenses
CREATE POLICY "Admins and sales can view expenses"
ON public.quotation_expenses
FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'sales'::app_role)
);

CREATE POLICY "Admins and sales can create expenses"
ON public.quotation_expenses
FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'sales'::app_role)
);

CREATE POLICY "Admins and sales can update expenses"
ON public.quotation_expenses
FOR UPDATE
USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'sales'::app_role)
);

CREATE POLICY "Admins can delete expenses"
ON public.quotation_expenses
FOR DELETE
USING (
  has_role(auth.uid(), 'admin'::app_role)
);

-- Add trigger for updated_at
CREATE TRIGGER update_quotation_expenses_updated_at
BEFORE UPDATE ON public.quotation_expenses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_quotation_expenses_quotation_id ON public.quotation_expenses(quotation_id);
CREATE INDEX idx_quotation_expenses_category ON public.quotation_expenses(category);
CREATE INDEX idx_quotation_expenses_expense_date ON public.quotation_expenses(expense_date);