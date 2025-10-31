-- Crear tabla para asistentes a reuniones
CREATE TABLE IF NOT EXISTS public.meeting_attendees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id UUID NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  attendee_type TEXT NOT NULL CHECK (attendee_type IN ('lead', 'customer', 'external')),
  lead_id UUID REFERENCES public.leads_b3ta(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  external_name TEXT,
  external_email TEXT,
  attendance_status TEXT NOT NULL DEFAULT 'pending' CHECK (attendance_status IN ('pending', 'confirmed', 'declined', 'attended', 'no_show')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para mejorar performance
CREATE INDEX idx_meeting_attendees_meeting_id ON public.meeting_attendees(meeting_id);
CREATE INDEX idx_meeting_attendees_lead_id ON public.meeting_attendees(lead_id);
CREATE INDEX idx_meeting_attendees_customer_id ON public.meeting_attendees(customer_id);

-- Trigger para updated_at
CREATE TRIGGER update_meeting_attendees_updated_at
  BEFORE UPDATE ON public.meeting_attendees
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies
ALTER TABLE public.meeting_attendees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view attendees of their meetings"
  ON public.meeting_attendees
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.meetings
      WHERE meetings.id = meeting_attendees.meeting_id
      AND meetings.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can manage attendees of their meetings"
  ON public.meeting_attendees
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.meetings
      WHERE meetings.id = meeting_attendees.meeting_id
      AND meetings.created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.meetings
      WHERE meetings.id = meeting_attendees.meeting_id
      AND meetings.created_by = auth.uid()
    )
  );