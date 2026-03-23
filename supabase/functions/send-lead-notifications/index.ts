import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const resend = new Resend(resendApiKey);

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, message } = await req.json();

    if (!email || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const senderEmail = Deno.env.get("RESEND_FROM") ?? "onboarding@resend.dev";
    
    // 1. Email al Cliente (Agradecimiento)
    const leadEmailPromise = resend.emails.send({
      from: `B3TA Consulting <${senderEmail}>`,
      to: email,
      subject: "¡Hemos recibido tu solicitud! - B3TA",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #6366f1;">¡Hola, ${name || 'futuro partner'}!</h2>
          <p>Muchísimas gracias por escribirnos y contarnos un poco sobre tu cuello de botella operativo.</p>
          <p>Hemos recibido correctamente tu información: <i>"${message}"</i></p>
          <p>Un ingeniero de B3TA revisará tu caso y se pondrá en contacto contigo muy pronto para analizar cómo automatizar al 100% ese proceso.</p>
          <br/>
          <p>Saludos,<br/><b>El equipo de B3TA</b></p>
        </div>
      `,
    });

    // 2. Email de Notificación a los Administradores
    const adminEmails = ["jchicas@syst.com.gt", "hi@b3ta.us"];
    const adminEmailPromise = resend.emails.send({
      from: `B3TA Leads <${senderEmail}>`,
      to: adminEmails,
      subject: "🔥 NUEVO LEAD - Diagnóstico B3TA",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2 style="color: #ec4899;">¡Un nuevo lead ha llenado el formulario en b3ta.us!</h2>
          <ul>
            <li><b>Email de Contacto:</b> ${email}</li>
            <li><b>Nombre Autogenerado:</b> ${name}</li>
            <li><b>Problema Operativo Descrito:</b> ${message}</li>
            <li><b>Fecha de Envío:</b> ${new Date().toLocaleString('es-GT', { timeZone: 'America/Guatemala' })}</li>
          </ul>
          <p>Revisa el <a href="https://b3ta.us/crm">CRM de B3TA</a> para ver más detalles y realizar el seguimiento e IA scoring.</p>
        </div>
      `,
    });

    await Promise.all([leadEmailPromise, adminEmailPromise]);

    return new Response(
      JSON.stringify({ success: true, message: "Emails autoresponder enviados." }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-lead-notifications:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Error procesando emails" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
