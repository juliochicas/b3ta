import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

// Función para parsear fecha RFC 2822 a ISO
function parseEmailDate(dateStr: string | null): string {
  if (!dateStr) return new Date().toISOString();
  
  try {
    // Limpiar formato (UTC) y otros sufijos problemáticos
    const cleanDate = dateStr
      .replace(/\s*\([^)]*\)/g, '') // Quitar (UTC), (GMT), etc.
      .trim();
    
    const date = new Date(cleanDate);
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date format: ${dateStr}, using current date`);
      return new Date().toISOString();
    }
    return date.toISOString();
  } catch (error) {
    console.warn(`Error parsing date: ${dateStr}, using current date`);
    return new Date().toISOString();
  }
}

// Función para decodificar headers MIME encoded-word (=?charset?encoding?text?=)
function decodeMimeHeader(text: string): string {
  if (!text) return text;
  
  // Decodificar =?UTF-8?B?...?= y =?UTF-8?Q?...?=
  return text.replace(/=\?([^?]+)\?([BQ])\?([^?]+)\?=/gi, (match: string, charset: string, encoding: string, encoded: string) => {
    try {
      if (encoding.toUpperCase() === 'B') {
        // Base64
        return atob(encoded);
      } else if (encoding.toUpperCase() === 'Q') {
        // Quoted-printable
        return encoded
          .replace(/_/g, ' ')
          .replace(/=([0-9A-F]{2})/gi, (_: string, hex: string) => String.fromCharCode(parseInt(hex, 16)));
      }
    } catch (e) {
      console.warn(`Failed to decode MIME header: ${match}`);
    }
    return match;
  });
}

// Función auxiliar para conectar via IMAP
async function fetchEmailsViaIMAP(account: any) {
  try {
    console.log(`Connecting to IMAP: ${account.imap_host}:${account.imap_port}`);
    
    // Conectar via socket SSL
    const conn = await Deno.connectTls({
      hostname: account.imap_host,
      port: account.imap_port,
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
    await sendCommand(`a001 LOGIN ${account.email} ${account.password_encrypted}`);

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
        
        const rawFrom = fromMatch?.[1]?.replace(/\s+/g, ' ').trim() || "";
        const rawSubject = subjectMatch?.[1]?.replace(/\s+/g, ' ').trim() || "(Sin asunto)";
        const rawDate = dateMatch?.[1]?.trim() || null;
        
        // Decodificar headers MIME
        const from = decodeMimeHeader(rawFrom);
        const subject = decodeMimeHeader(rawSubject);
        const messageId = messageIdMatch?.[1]?.trim() || `${id}@${account.imap_host}`;
        const inReplyTo = inReplyToMatch?.[1]?.trim() || null;
        
        // Parsear fecha correctamente
        const received_at = parseEmailDate(rawDate);
        
        console.log(`Email ${id}: From=${from}, Subject=${subject}, MessageID=${messageId}, InReplyTo=${inReplyTo}`);
        
        emails.push({
          from,
          to: toMatch?.[1]?.split(",").map(e => decodeMimeHeader(e.trim())) || [account.email],
          subject,
          body_text: bodyText,
          message_id: messageId,
          in_reply_to: inReplyTo,
          references: referencesMatch?.[1]?.split(/\s+/).map(r => r.replace(/[<>]/g, '').trim()).filter(r => r) || null,
          received_at,
          imap_uid: id, // Guardar el UID del IMAP para poder eliminarlo después
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

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) throw new Error("Unauthorized");

    const { accountId } = await req.json();

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

    console.log("Starting email polling for:", account.email);

    // Obtener correos via IMAP
    const emails = await fetchEmailsViaIMAP(account);
    
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
            account_id: accountId,
            received_at: email.received_at,
            imap_uid: email.imap_uid,
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
