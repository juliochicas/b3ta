import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Función auxiliar para conectar via IMAP
async function fetchEmailsViaIMAP() {
  const imapHost = Deno.env.get("HOSTINGER_IMAP_HOST")!;
  const imapPort = parseInt(Deno.env.get("HOSTINGER_IMAP_PORT") || "993");
  const email = Deno.env.get("HOSTINGER_EMAIL")!;
  const password = Deno.env.get("HOSTINGER_PASSWORD")!;

  try {
    console.log(`Connecting to IMAP: ${imapHost}:${imapPort}`);
    
    // Conectar via socket SSL
    const conn = await Deno.connectTls({
      hostname: imapHost,
      port: imapPort,
    });

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // Función para enviar comandos IMAP
    async function sendCommand(command: string): Promise<string> {
      await conn.write(encoder.encode(command + "\r\n"));
      
      const buffer = new Uint8Array(8192);
      const n = await conn.read(buffer);
      if (n === null) throw new Error("Connection closed");
      
      return decoder.decode(buffer.subarray(0, n));
    }

    // Login
    console.log("Logging in...");
    await sendCommand(`a001 LOGIN ${email} ${password}`);

    // Seleccionar INBOX
    console.log("Selecting INBOX...");
    await sendCommand("a002 SELECT INBOX");

    // Buscar correos no vistos primero, si no hay buscar los últimos 50
    console.log("Searching for unseen emails...");
    let searchResponse = await sendCommand("a003 SEARCH UNSEEN");
    
    // Parsear IDs de correos
    let emailIds = searchResponse
      .match(/\* SEARCH ([\d\s]+)/)?.[1]
      ?.trim()
      .split(" ")
      .filter(id => id) || [];

    console.log(`Found ${emailIds.length} unseen emails`);
    
    // Si no hay correos no vistos, buscar los últimos 50
    if (emailIds.length === 0) {
      console.log("No unseen emails, fetching recent emails...");
      searchResponse = await sendCommand("a003 SEARCH ALL");
      const allIds = searchResponse
        .match(/\* SEARCH ([\d\s]+)/)?.[1]
        ?.trim()
        .split(" ")
        .filter(id => id) || [];
      emailIds = allIds.slice(-50); // Últimos 50
      console.log(`Found ${emailIds.length} total emails in inbox`);
    }

    const emails = [];

    // Procesar todos los correos encontrados (ya sea unseen o los últimos)
    console.log(`Processing ${emailIds.length} emails...`);
    const recentIds = emailIds;
    for (const id of recentIds) {
      try {
        const tag = `a${String(100 + parseInt(id)).padStart(3, '0')}`;
        const fetchResponse = await sendCommand(
          `${tag} FETCH ${id} (BODY[HEADER.FIELDS (FROM TO SUBJECT DATE MESSAGE-ID IN-REPLY-TO REFERENCES)] BODY[TEXT])`
        );
        
        console.log(`Fetching email ${id}...`);
        
        // Parsear headers con mejor manejo de saltos de línea
        const fromMatch = fetchResponse.match(/From:\s*([^\r\n]+(?:\r?\n\s+[^\r\n]+)*)/i);
        const toMatch = fetchResponse.match(/To:\s*([^\r\n]+(?:\r?\n\s+[^\r\n]+)*)/i);
        const subjectMatch = fetchResponse.match(/Subject:\s*([^\r\n]+(?:\r?\n\s+[^\r\n]+)*)/i);
        const dateMatch = fetchResponse.match(/Date:\s*([^\r\n]+)/i);
        const messageIdMatch = fetchResponse.match(/Message-ID:\s*<?([^>\r\n]+)>?/i);
        const inReplyToMatch = fetchResponse.match(/In-Reply-To:\s*<?([^>\r\n]+)>?/i);
        const referencesMatch = fetchResponse.match(/References:\s*([^\r\n]+(?:\r?\n\s+[^\r\n]+)*)/i);

        // Parsear body
        const bodyMatch = fetchResponse.match(/BODY\[TEXT\]\s*(?:\{[\d]+\})?\r?\n([\s\S]+?)(?:\r?\n\)|$)/);
        const bodyText = bodyMatch?.[1]?.trim() || "";
        
        const from = fromMatch?.[1]?.replace(/\s+/g, ' ').trim() || "";
        const subject = subjectMatch?.[1]?.replace(/\s+/g, ' ').trim() || "(Sin asunto)";
        const messageId = messageIdMatch?.[1]?.trim() || null;
        const inReplyTo = inReplyToMatch?.[1]?.trim() || null;
        
        console.log(`Email ${id}: From=${from}, Subject=${subject}, MessageID=${messageId}, InReplyTo=${inReplyTo}`);
        
        emails.push({
          from,
          to: toMatch?.[1]?.split(",").map(e => e.trim()) || [],
          subject,
          body_text: bodyText,
          message_id: messageId,
          in_reply_to: inReplyTo,
          references: referencesMatch?.[1]?.split(/\s+/).map(r => r.replace(/[<>]/g, '').trim()).filter(r => r) || null,
          received_at: dateMatch?.[1] || new Date().toISOString(),
        });

        // NO marcar como leído para permitir sincronizaciones futuras
      } catch (error) {
        console.error(`Error fetching email ${id}:`, error);
      }
    }

    // Logout
    await sendCommand("a999 LOGOUT");
    conn.close();

    return emails;
  } catch (error) {
    console.error("IMAP Error:", error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Starting email polling...");

    // Obtener correos via IMAP
    const emails = await fetchEmailsViaIMAP();
    
    console.log(`Retrieved ${emails.length} emails`);

    const savedEmails = [];

    // Guardar cada correo en la base de datos
    for (const email of emails) {
      // Verificar si ya existe por message_id
      if (email.message_id) {
        const { data: existing } = await supabase
          .from("emails")
          .select("id")
          .eq("message_id", email.message_id)
          .single();

        if (existing) {
          console.log(`Email ${email.message_id} already exists, skipping`);
          continue;
        }
      }

      // Buscar lead o customer por email
      let leadId = null;
      let customerId = null;

      const fromEmail = email.from.match(/<([^>]+)>/)?.[1] || email.from;

      const { data: lead } = await supabase
        .from("leads_b3ta")
        .select("id")
        .ilike("email", fromEmail)
        .single();

      if (lead) leadId = lead.id;

      const { data: customer } = await supabase
        .from("customers")
        .select("id")
        .ilike("email", fromEmail)
        .single();

      if (customer) customerId = customer.id;

      // Determinar thread_id y in_reply_to
      let threadId = null;
      let inReplyTo = null;
      
      if (email.in_reply_to) {
        inReplyTo = email.in_reply_to;
        // Buscar el correo original para obtener o crear thread_id
        const { data: originalEmail } = await supabase
          .from("emails")
          .select("thread_id, id")
          .eq("message_id", email.in_reply_to)
          .single();
        
        if (originalEmail) {
          threadId = originalEmail.thread_id || originalEmail.id;
        }
      }

      // Guardar el correo
      const { data: savedEmail, error } = await supabase
        .from("emails")
        .insert([
          {
            message_id: email.message_id,
            from_email: fromEmail,
            to_email: email.to,
            subject: email.subject,
            body_text: email.body_text,
            body_html: email.body_text,
            thread_id: threadId,
            in_reply_to: inReplyTo,
            email_references: email.references,
            is_read: false,
            folder: "inbox",
            lead_id: leadId,
            customer_id: customerId,
            received_at: email.received_at,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error saving email:", error);
      } else {
        savedEmails.push(savedEmail);
        console.log(`Saved email: ${savedEmail.id}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        retrieved: emails.length,
        saved: savedEmails.length,
        emails: savedEmails,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in poll-emails-imap:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Error al conectar con el servidor IMAP. Verifica las credenciales."
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
