import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

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
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = new Resend(resendApiKey);

    // Get meetings scheduled for the next 15 minutes that haven't been reminded
    const now = new Date();
    const fifteenMinutesFromNow = new Date(now.getTime() + 15 * 60000);

    const { data: meetings, error: meetingsError } = await supabase
      .from("meetings")
      .select(`
        *,
        leads_b3ta (name, email),
        customers (name, email)
      `)
      .eq("status", "scheduled")
      .eq("reminder_sent", false)
      .gte("scheduled_at", now.toISOString())
      .lte("scheduled_at", fifteenMinutesFromNow.toISOString());

    if (meetingsError) throw meetingsError;

    if (!meetings || meetings.length === 0) {
      return new Response(
        JSON.stringify({ message: "No meetings to remind" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const results = [];

    for (const meeting of meetings) {
      const recipientEmail =
        meeting.leads_b3ta?.email || meeting.customers?.email;
      const recipientName =
        meeting.leads_b3ta?.name || meeting.customers?.name || "Cliente";

      if (!recipientEmail) {
        console.log(`Skipping meeting ${meeting.id}: no email found`);
        continue;
      }

      // Generate personalized reminder using AI
      const aiResponse = await fetch(
        "https://ai.gateway.lovable.dev/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${lovableApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              {
                role: "system",
                content:
                  "Eres un asistente que genera recordatorios de reuniones profesionales y amigables en español.",
              },
              {
                role: "user",
                content: `Genera un recordatorio de reunión para ${recipientName}. La reunión es en 15 minutos, a las ${new Date(
                  meeting.scheduled_at
                ).toLocaleTimeString("es-MX", {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: meeting.timezone,
                })}. Duración: ${
                  meeting.duration_minutes
                } minutos. ${meeting.notes ? `Notas: ${meeting.notes}` : ""} Genera un mensaje breve y profesional.`,
              },
            ],
          }),
        }
      );

      const aiData = await aiResponse.json();
      const reminderText =
        aiData.choices?.[0]?.message?.content ||
        "Recordatorio: Tienes una reunión programada en 15 minutos.";

      // Send email
      const { error: emailError } = await resend.emails.send({
        from: "B3TA Consulting <onboarding@resend.dev>",
        to: [recipientEmail],
        subject: "Recordatorio: Reunión en 15 minutos",
        html: `
          <h2>Recordatorio de Reunión</h2>
          <p>Hola ${recipientName},</p>
          <p>${reminderText}</p>
          <p><strong>Fecha y hora:</strong> ${new Date(
            meeting.scheduled_at
          ).toLocaleString("es-MX", {
            dateStyle: "long",
            timeStyle: "short",
            timeZone: meeting.timezone,
          })}</p>
          <p><strong>Duración:</strong> ${meeting.duration_minutes} minutos</p>
          ${meeting.notes ? `<p><strong>Notas:</strong> ${meeting.notes}</p>` : ""}
          <p>¡Te esperamos!</p>
        `,
      });

      if (emailError) {
        console.error(`Error sending email for meeting ${meeting.id}:`, emailError);
        results.push({ meetingId: meeting.id, success: false, error: emailError });
        continue;
      }

      // Mark reminder as sent
      const { error: updateError } = await supabase
        .from("meetings")
        .update({ reminder_sent: true })
        .eq("id", meeting.id);

      if (updateError) {
        console.error(`Error updating meeting ${meeting.id}:`, updateError);
      }

      results.push({ meetingId: meeting.id, success: true });
    }

    return new Response(
      JSON.stringify({
        message: `Processed ${results.length} meetings`,
        results,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-meeting-reminder function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
