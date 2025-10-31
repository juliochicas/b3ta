import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Webhook para recibir correos de Hostinger
    const emailData = await req.json();
    
    console.log("Received email webhook:", emailData);

    // Parsear el correo entrante
    const {
      from,
      to,
      cc,
      bcc,
      subject,
      body_text,
      body_html,
      message_id,
      thread_id,
      in_reply_to,
      references,
      has_attachments,
      received_at,
    } = emailData;

    // Buscar si el correo está vinculado a un lead o customer
    let leadId = null;
    let customerId = null;

    // Intentar encontrar un lead por email
    const { data: lead } = await supabase
      .from("leads_b3ta")
      .select("id")
      .eq("email", from)
      .single();

    if (lead) {
      leadId = lead.id;
    }

    // Intentar encontrar un customer por email
    const { data: customer } = await supabase
      .from("customers")
      .select("id")
      .eq("email", from)
      .single();

    if (customer) {
      customerId = customer.id;
    }

    // Guardar el correo en la base de datos
    const { data: savedEmail, error } = await supabase
      .from("emails")
      .insert([
        {
          message_id,
          from_email: from,
          to_email: Array.isArray(to) ? to : [to],
          cc_email: cc || null,
          bcc_email: bcc || null,
          subject: subject || "(Sin asunto)",
          body_text: body_text || "",
          body_html: body_html || body_text || "",
          thread_id,
          in_reply_to,
          email_references: references || null,
          has_attachments: has_attachments || false,
          is_read: false,
          folder: "inbox",
          lead_id: leadId,
          customer_id: customerId,
          received_at: received_at || new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error saving email:", error);
      throw error;
    }

    console.log("Email saved successfully:", savedEmail.id);

    return new Response(
      JSON.stringify({
        success: true,
        emailId: savedEmail.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in receive-email-webhook:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
