import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { meetingId, oldDate, oldTime } = await req.json();

    if (!meetingId) {
      return new Response(
        JSON.stringify({ error: "meetingId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Fetching meeting ${meetingId} for reschedule notification`);

    // Fetch meeting details with organizer info
    const { data: meeting, error: meetingError } = await supabase
      .from("meetings")
      .select(`
        *,
        leads_b3ta!fk_meetings_lead (name, email),
        customers (name, email)
      `)
      .eq("id", meetingId)
      .single();

    if (meetingError || !meeting) {
      console.error("Meeting fetch error:", meetingError);
      return new Response(
        JSON.stringify({ error: "Meeting not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch organizer (creator) info
    const { data: organizerProfile } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", meeting.created_by)
      .single();

    // Fetch attendees
    const { data: attendees, error: attendeesError } = await supabase
      .from("meeting_attendees")
      .select(`
        *,
        leads_b3ta!fk_meeting_attendees_lead (name, email),
        customers (name, email)
      `)
      .eq("meeting_id", meetingId);

    if (attendeesError) {
      console.error("Attendees fetch error:", attendeesError);
    }

    // Build recipient list
    const recipients: Array<{ name: string; email: string }> = [];

    // Add organizer
    if (organizerProfile?.email) {
      recipients.push({
        name: organizerProfile.full_name || organizerProfile.email,
        email: organizerProfile.email,
      });
    }

    // Add lead if exists
    if (meeting.leads_b3ta && Array.isArray(meeting.leads_b3ta) && meeting.leads_b3ta.length > 0) {
      const lead = meeting.leads_b3ta[0];
      if (lead?.email) {
        recipients.push({
          name: lead.name || lead.email,
          email: lead.email,
        });
      }
    }

    // Add customer if exists
    if (meeting.customers && Array.isArray(meeting.customers) && meeting.customers.length > 0) {
      const customer = meeting.customers[0];
      if (customer?.email) {
        recipients.push({
          name: customer.name || customer.email,
          email: customer.email,
        });
      }
    }

    // Add attendees
    if (attendees && attendees.length > 0) {
      for (const att of attendees) {
        if (att.attendee_type === "lead" && att.leads_b3ta && Array.isArray(att.leads_b3ta) && att.leads_b3ta.length > 0) {
          const lead = att.leads_b3ta[0];
          if (lead?.email) recipients.push({ name: lead.name || lead.email, email: lead.email });
        } else if (att.attendee_type === "customer" && att.customers && Array.isArray(att.customers) && att.customers.length > 0) {
          const customer = att.customers[0];
          if (customer?.email) recipients.push({ name: customer.name || customer.email, email: customer.email });
        } else if (att.attendee_type === "external" && att.external_email) {
          recipients.push({ name: att.external_name || att.external_email, email: att.external_email });
        }
      }
    }

    if (recipients.length === 0) {
      console.log("No recipients found for reschedule notification");
      return new Response(
        JSON.stringify({ message: "No recipients to notify" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Dedupe recipients by email
    const uniqueRecipientsMap = new Map<string, { name: string; email: string }>();
    for (const r of recipients) uniqueRecipientsMap.set(r.email.toLowerCase(), r);
    const finalRecipients = Array.from(uniqueRecipientsMap.values());

    console.log(`Sending reschedule notification to ${finalRecipients.length} recipients`, finalRecipients.map(r => r.email));

    const senderEmail = Deno.env.get("RESEND_FROM") ?? "onboarding@resend.dev";
    const senderName = Deno.env.get("RESEND_FROM_NAME") ?? "B3TA Consulting";

    const newMeetingDate = new Date(meeting.scheduled_at);
    const newFormattedDate = newMeetingDate.toLocaleDateString("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const newFormattedTime = newMeetingDate.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: meeting.timezone,
    });

    let oldDateTimeHtml = '';
    if (oldDate && oldTime) {
      const oldDateTime = new Date(oldDate);
      const oldFormattedDate = oldDateTime.toLocaleDateString("es-MX", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      oldDateTimeHtml = `
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
          <p style="margin: 5px 0;"><strong>Fecha anterior:</strong> ${oldFormattedDate}</p>
          <p style="margin: 5px 0;"><strong>Hora anterior:</strong> ${oldTime}</p>
        </div>
      `;
    }

    // Send emails to all recipients
    const emailPromises = finalRecipients.map(recipient => {
      return resend.emails.send({
        from: `${senderName} <${senderEmail}>`,
        to: [recipient.email],
        subject: "Reunión Reprogramada",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Reunión Reprogramada</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Reunión Reprogramada</h1>
              </div>
              
              <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
                <p style="font-size: 16px; margin-bottom: 20px;">Hola ${recipient.name},</p>
                
                <p style="font-size: 16px; margin-bottom: 20px;">
                  Te informamos que tu reunión ha sido <strong>reprogramada</strong>.
                </p>
                
                ${oldDateTimeHtml}
                
                <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #48bb78; margin-bottom: 20px;">
                  <p style="margin: 0 0 10px 0; color: #48bb78; font-weight: bold;">Nueva fecha y hora:</p>
                  <p style="margin: 5px 0;"><strong>📅 Fecha:</strong> ${newFormattedDate}</p>
                  <p style="margin: 5px 0;"><strong>🕐 Hora:</strong> ${newFormattedTime}</p>
                  <p style="margin: 5px 0;"><strong>⏱️ Duración:</strong> ${meeting.duration_minutes} minutos</p>
                  <p style="margin: 5px 0;"><strong>🌍 Zona horaria:</strong> ${meeting.timezone}</p>
                  ${meeting.notes ? `<p style="margin: 15px 0 5px 0;"><strong>📝 Notas:</strong></p><p style="margin: 5px 0;">${meeting.notes}</p>` : ''}
                </div>
                
                <p style="font-size: 16px; color: #666;">
                  Por favor, confirma tu asistencia o contáctanos si tienes alguna pregunta.
                </p>
                
                <p style="font-size: 16px; margin-top: 30px;">
                  Saludos cordiales,<br>
                  <strong>${senderName}</strong>
                </p>
              </div>
            </body>
          </html>
        `,
      });
    });

    await Promise.all(emailPromises);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Notificación de reprogramación enviada a ${finalRecipients.length} destinatario(s)` 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in send-meeting-reschedule function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
