import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

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

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) throw new Error("Unauthorized");

    const { to, cc, bcc, subject, body, leadId, customerId, accountId } = await req.json();

    if (!to || !subject || !body) {
      throw new Error("Missing required fields: to, subject, body");
    }

    if (!accountId) {
      throw new Error("Account ID is required");
    }

    console.log("Fetching email account:", accountId);

    // Obtener configuración de la cuenta de correo
    const { data: account, error: accountError } = await supabase
      .from("email_accounts")
      .select("*")
      .eq("id", accountId)
      .eq("is_active", true)
      .single();

    if (accountError || !account) {
      throw new Error("Email account not found or inactive");
    }

    console.log("Connecting to SMTP server:", account.smtp_host);

    // Generate a unique message ID for tracking
    const messageId = `${crypto.randomUUID()}@${account.email.split('@')[1]}`;
    console.log("Generated Message-ID:", messageId);

    const client = new SMTPClient({
      connection: {
        hostname: account.smtp_host,
        port: account.smtp_port,
        tls: true,
        auth: {
          username: account.email,
          password: account.password_encrypted, // En producción debe estar encriptado
        },
      },
    });

    // Convert line breaks to HTML <br> tags for proper formatting
    const htmlBody = body.replace(/\n/g, '<br>');

    await client.send({
      from: account.email,
      to: Array.isArray(to) ? to : [to],
      cc: cc ? (Array.isArray(cc) ? cc : [cc]) : undefined,
      bcc: bcc ? (Array.isArray(bcc) ? bcc : [bcc]) : undefined,
      subject: subject,
      content: body,
      html: htmlBody,
      headers: {
        "Message-ID": `<${messageId}>`,
      },
    });

    await client.close();

    console.log("Email sent successfully");

    // Store email in database
    const { data: emailData, error: emailError } = await supabase
      .from("emails")
      .insert([
        {
          message_id: messageId,
          from_email: account.email,
          to_email: Array.isArray(to) ? to : [to],
          cc_email: cc ? (Array.isArray(cc) ? cc : [cc]) : null,
          bcc_email: bcc ? (Array.isArray(bcc) ? bcc : [bcc]) : null,
          subject: subject,
          body_html: htmlBody,
          body_text: body,
          is_sent: true,
          folder: "sent",
          lead_id: leadId || null,
          customer_id: customerId || null,
          user_id: user.id,
          account_id: accountId,
          sent_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (emailError) {
      console.error("Error storing email:", emailError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email sent successfully",
        emailId: emailData?.id 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
