"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { format, addDays, startOfMonth, endOfMonth, isSameDay, parseISO, isBefore, startOfDay, getDay } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Calendar as CalendarIcon, Clock, User, Mail, FileText, CheckCircle2, ChevronLeft } from "lucide-react";
import { MainHeader } from "@/components/MainHeader";
import { Footer } from "@/components/Footer";

export default function PublicBooking() {
  const { username } = useParams<{ username: string }>(); // Using username as userId for now
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [availability, setAvailability] = useState<any[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<any | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    notes: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (username) {
      loadUserData(username);
    }
  }, [username]);

  const loadUserData = async (userId: string) => {
    setLoading(true);
    try {
      // Fetch Profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
        
      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch Availability
      const { data: availData, error: availError } = await supabase
        .from("user_availability")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true);
        
      if (availError) throw availError;
      setAvailability(availData || []);

      // Fetch Meetings for the next 60 days to block out booked slots
      const today = new Date();
      const next60Days = addDays(today, 60);
      
      const { data: meetingsData, error: meetingsError } = await supabase
        .from("meetings")
        .select("scheduled_at, duration_minutes")
        .eq("created_by", userId)
        .gte("scheduled_at", today.toISOString())
        .lte("scheduled_at", next60Days.toISOString());
        
      if (meetingsError) throw meetingsError;
      setMeetings(meetingsData || []);

    } catch (err: any) {
      console.error("Error loading user data:", err);
      toast.error("No se pudo cargar la información del calendario.");
    } finally {
      setLoading(false);
    }
  };

  const getAvailableSlotsForDate = (date: Date) => {
    const dayOfWeek = getDay(date);
    // Find all availability rules for this day of week
    const rules = availability.filter(a => a.day_of_week === dayOfWeek);
    
    if (rules.length === 0) return [];

    const slots: any[] = [];
    
    // For each rule, generate 30-min slots
    rules.forEach(rule => {
      const [startHour, startMin] = rule.start_time.split(":").map(Number);
      const [endHour, endMin] = rule.end_time.split(":").map(Number);
      
      let currentHour = startHour;
      let currentMin = startMin;
      
      while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
        const slotTimeStr = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
        
        // Create full date object for this slot to check against meetings
        const slotDate = new Date(date);
        slotDate.setHours(currentHour, currentMin, 0, 0);
        
        // Skip slots in the past
        if (isBefore(slotDate, new Date())) {
          // move to next 30 min
          currentMin += 30;
          if (currentMin >= 60) {
            currentHour += 1;
            currentMin -= 60;
          }
          continue;
        }

        // Check if this slot conflicts with an existing meeting
        const isConflict = meetings.some(meeting => {
          const meetingStart = new Date(meeting.scheduled_at);
          const meetingEnd = new Date(meetingStart.getTime() + (meeting.duration_minutes * 60000));
          
          return (slotDate >= meetingStart && slotDate < meetingEnd);
        });

        if (!isConflict) {
          slots.push({
            time: slotTimeStr,
            date: slotDate,
            timezone: rule.timezone
          });
        }

        // Advance 30 minutes
        currentMin += 30;
        if (currentMin >= 60) {
          currentHour += 1;
          currentMin -= 60;
        }
      }
    });

    return slots.sort((a, b) => a.time.localeCompare(b.time));
  };

  const isDayAvailable = (date: Date) => {
    // Only allow future dates
    if (isBefore(date, startOfDay(new Date()))) return false;
    
    // Check if there's any availability rule for this day of week
    const dayOfWeek = getDay(date);
    return availability.some(a => a.day_of_week === dayOfWeek);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !username) return;

    setSubmitting(true);
    try {
      // 1. Create a lead/customer record or find existing
      let customerId = null;
      let leadId = null;

      // In a real app, we'd check if customer exists by email.
      // For this implementation, we'll create a lead to be safe.
      const { data: leadData, error: leadError } = await supabase
        .from('leads_b3ta')
        .insert({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          phone: formData.phone,
          message: formData.notes,
          source: "Calendar Link",
          status: "new"
        })
        .select()
        .single();
        
      if (!leadError && leadData) {
        leadId = leadData.id;
      }

      // 2. Create the meeting
      const { error: meetingError } = await supabase
        .from('meetings')
        .insert({
          created_by: username,
          lead_id: leadId,
          scheduled_at: selectedSlot.date.toISOString(),
          duration_minutes: 30, // Standard 30 min duration
          meeting_type: "consultation",
          status: "scheduled",
          timezone: selectedSlot.timezone,
          notes: formData.notes
        });

      if (meetingError) throw meetingError;

      setSuccess(true);
      toast.success("¡Reunión agendada exitosamente!");

    } catch (err: any) {
      console.error("Error booking meeting:", err);
      toast.error("Ocurrió un error al agendar. Por favor intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Enlace Inválido</h2>
            <p className="text-muted-foreground">Este calendario no existe o ha sido desactivado.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <MainHeader />
        <main className="flex-1 flex items-center justify-center p-4 pt-24">
          <Card className="max-w-md w-full text-center">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">¡Reunión Confirmada!</h2>
              <p className="text-muted-foreground mb-6">
                Hemos agendado tu reunión con {profile.full_name || profile.email}. Te enviaremos los detalles pronto.
              </p>
              <div className="bg-muted p-4 rounded-lg text-left mb-6">
                <p className="font-medium flex items-center gap-2 mb-2">
                  <CalendarIcon className="w-4 h-4 text-primary" />
                  {selectedSlot && format(selectedSlot.date, "EEEE, d 'de' MMMM, yyyy", { locale: es })}
                </p>
                <p className="font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  {selectedSlot && format(selectedSlot.date, "hh:mm a")} ({selectedSlot?.timezone})
                </p>
              </div>
              <Button onClick={() => window.location.href = '/'} className="w-full">
                Volver al inicio
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const availableSlots = selectedDate ? getAvailableSlotsForDate(selectedDate) : [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <MainHeader />
      
      <main className="flex-1 container mx-auto px-4 py-24 max-w-5xl">
        <Card className="shadow-lg border-0 overflow-hidden">
          <div className="grid md:grid-cols-[1fr_2fr] min-h-[600px]">
            
            {/* Left Sidebar - Profile & Details */}
            <div className="bg-slate-50 p-8 border-r border-slate-100">
              <div className="mb-8">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 overflow-hidden">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold">{profile.full_name?.charAt(0) || profile.email?.charAt(0)}</span>
                  )}
                </div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Reunión con</p>
                <h1 className="text-2xl font-bold text-slate-900">{profile.full_name || "Consultor B3TA"}</h1>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-800">Videollamada de Consultoría</h2>
                
                <div className="flex items-center gap-3 text-slate-600">
                  <Clock className="w-5 h-5 text-slate-400" />
                  <span>30 minutos</span>
                </div>
                
                {selectedSlot && (
                  <div className="flex items-start gap-3 text-primary font-medium bg-primary/5 p-3 rounded-lg">
                    <CalendarIcon className="w-5 h-5 mt-0.5" />
                    <div>
                      <p>{format(selectedSlot.date, "EEEE, d 'de' MMMM, yyyy", { locale: es })}</p>
                      <p>{format(selectedSlot.date, "hh:mm a")} ({selectedSlot.timezone})</p>
                    </div>
                  </div>
                )}
                
                <p className="text-slate-600 mt-4 leading-relaxed">
                  Agenda una reunión para hablar sobre tu proyecto. Elegiremos la mejor solución para tus necesidades tecnológicas.
                </p>
              </div>
            </div>

            {/* Right Side - Calendar or Form */}
            <div className="p-8 bg-white">
              {!selectedSlot ? (
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Selecciona Fecha y Hora</h3>
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => !isDayAvailable(date)}
                        className="rounded-md border shadow-sm p-3"
                        locale={es}
                      />
                    </div>
                    
                    <div>
                      {selectedDate ? (
                        <div>
                          <p className="font-medium text-slate-900 mb-4 pb-2 border-b">
                            {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
                          </p>
                          
                          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                            {availableSlots.length > 0 ? (
                              availableSlots.map((slot, i) => (
                                <Button
                                  key={i}
                                  variant="outline"
                                  className="w-full justify-center border-primary/20 hover:border-primary hover:bg-primary/5 text-primary font-medium"
                                  onClick={() => setSelectedSlot(slot)}
                                >
                                  {format(slot.date, "hh:mm a")}
                                </Button>
                              ))
                            ) : (
                              <div className="text-center py-8 text-muted-foreground bg-slate-50 rounded-lg">
                                No hay horarios disponibles para esta fecha.
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center text-slate-400 bg-slate-50 rounded-lg p-8 text-center border border-dashed border-slate-200">
                          Selecciona un día en el calendario para ver los horarios disponibles.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-w-md mx-auto">
                  <div className="flex items-center mb-6">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedSlot(null)} className="mr-2">
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Atrás
                    </Button>
                    <h3 className="text-xl font-bold text-slate-900">Confirma tus Datos</h3>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre completo *</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="company">Empresa (opcional)</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono / WhatsApp (opcional)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Motivo de la reunión</Label>
                      <Textarea
                        id="notes"
                        placeholder="Por favor cuéntame brevemente sobre qué te gustaría conversar..."
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      />
                    </div>

                    <Button type="submit" className="w-full mt-6" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Agendando...
                        </>
                      ) : (
                        "Confirmar Evento"
                      )}
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
