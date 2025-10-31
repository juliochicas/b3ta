import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;

    const { meetingId } = await req.json();

    if (!meetingId) {
      return new Response(
        JSON.stringify({ error: "Meeting ID is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = new Resend(resendApiKey);

    // Get meeting details with related data and attendees
    const { data: meeting, error: meetingError } = await supabase
      .from("meetings")
      .select(`
        *,
        leads_b3ta!fk_meetings_lead (name, email),
        customers!fk_meetings_customer (name, email)
      `)
      .eq("id", meetingId)
      .single();

    if (meetingError) throw meetingError;
    if (!meeting) {
      return new Response(
        JSON.stringify({ error: "Meeting not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get all attendees
    const { data: attendees, error: attendeesError } = await supabase
      .from("meeting_attendees")
      .select(`
        *,
        leads_b3ta (name, email),
        customers (name, email)
      `)
      .eq("meeting_id", meetingId);

    if (attendeesError) {
      console.error("Error fetching attendees:", attendeesError);
    }

    // Build list of recipients
    const recipients: { name: string; email: string }[] = [];
    
    // Add main lead/customer if exists
    if (meeting.leads_b3ta?.email) {
      recipients.push({
        name: meeting.leads_b3ta.name,
        email: meeting.leads_b3ta.email
      });
    }
    if (meeting.customers?.email) {
      recipients.push({
        name: meeting.customers.name,
        email: meeting.customers.email
      });
    }
    
    // Add all attendees
    if (attendees) {
      for (const att of attendees) {
        if (att.attendee_type === 'lead' && att.leads_b3ta?.email) {
          recipients.push({
            name: att.leads_b3ta.name,
            email: att.leads_b3ta.email
          });
        } else if (att.attendee_type === 'customer' && att.customers?.email) {
          recipients.push({
            name: att.customers.name,
            email: att.customers.email
          });
        } else if (att.attendee_type === 'external' && att.external_email) {
          recipients.push({
            name: att.external_name || 'Invitado',
            email: att.external_email
          });
        }
      }
    }

    if (recipients.length === 0) {
      return new Response(
        JSON.stringify({ error: "No recipients found" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Sending confirmation to ${recipients.length} recipients`);

    // Send emails to all recipients
    const emailPromises = recipients.map(recipient => {
      const confirmationText = `¡Hola ${recipient.name}! Tu reunión ha sido confirmada exitosamente. Nos vemos pronto.`;

      return resend.emails.send({
        from: "B3TA Consulting <onboarding@resend.dev>",
        to: [recipient.email],
        subject: "Confirmación de Reunión Agendada",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">✅ Reunión Confirmada</h2>
            <p>Hola ${recipient.name},</p>
            <p>${confirmationText}</p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 8px 0;"><strong>📅 Fecha:</strong> ${new Date(
                meeting.scheduled_at
              ).toLocaleDateString("es-MX", {
                dateStyle: "long",
                timeZone: meeting.timezone,
              })}</p>
              <p style="margin: 8px 0;"><strong>🕐 Hora:</strong> ${new Date(
                meeting.scheduled_at
              ).toLocaleTimeString("es-MX", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: meeting.timezone,
              })}</p>
              <p style="margin: 8px 0;"><strong>⏱️ Duración:</strong> ${
                meeting.duration_minutes
              } minutos</p>
              <p style="margin: 8px 0;"><strong>🌍 Zona Horaria:</strong> ${
                meeting.timezone
              }</p>
              ${
                meeting.notes
                  ? `<p style="margin: 8px 0;"><strong>📝 Notas:</strong> ${meeting.notes}</p>`
                  : ""
              }
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">Recibirás un recordatorio 15 minutos antes de la reunión.</p>
            <p>¡Nos vemos pronto!</p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
            <p style="color: #9ca3af; font-size: 12px;">B3TA Consulting - Transformando tu negocio con tecnología</p>
          </div>
        `,
      });
    });

    // Wait for all emails to be sent
    const results = await Promise.allSettled(emailPromises);
    const successCount = results.filter(r => r.status === 'fulfilled').length;
    const failCount = results.filter(r => r.status === 'rejected').length;

    console.log(`Email results: ${successCount} sent, ${failCount} failed`);

    if (failCount > 0) {
      console.error("Some emails failed:", results.filter(r => r.status === 'rejected'));
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Confirmation emails sent to ${successCount} recipient(s)`,
        sent: successCount,
        failed: failCount
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-meeting-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
