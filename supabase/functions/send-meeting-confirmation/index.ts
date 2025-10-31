import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const ALLOWED_ORIGINS = [
  'https://sap.b3ta.us',
  'https://b3ta.us',
  'http://localhost:8080',
];

const getCorsHeaders = (origin: string | null) => {
  const isAllowed = origin && ALLOWED_ORIGINS.includes(origin);
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };
};

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

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

    // Get meeting details with related data
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

    const recipientEmail = meeting.leads_b3ta?.email || meeting.customers?.email;
    const recipientName = meeting.leads_b3ta?.name || meeting.customers?.name || "Cliente";

    if (!recipientEmail) {
      return new Response(
        JSON.stringify({ error: "No email found for recipient" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Send confirmation email directly (simplified for speed)
    const confirmationText = `¡Hola ${recipientName}! Tu reunión ha sido confirmada exitosamente. Nos vemos pronto.`;

    const { error: emailError } = await resend.emails.send({
      from: "B3TA Consulting <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: "Confirmación de Reunión Agendada",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">✅ Reunión Confirmada</h2>
          <p>Hola ${recipientName},</p>
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

    if (emailError) {
      console.error("Error sending confirmation email:", emailError);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: emailError }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Confirmation email sent successfully to:", recipientEmail);
    return new Response(
      JSON.stringify({
        success: true,
        message: "Confirmation email sent successfully",
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
