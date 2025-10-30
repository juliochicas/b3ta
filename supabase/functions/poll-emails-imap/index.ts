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

    // Buscar correos no leídos
    console.log("Searching for unseen emails...");
    const searchResponse = await sendCommand("a003 SEARCH UNSEEN");
    
    // Parsear IDs de correos
    const emailIds = searchResponse
      .match(/\* SEARCH ([\d\s]+)/)?.[1]
      ?.trim()
      .split(" ")
      .filter(id => id) || [];

    console.log(`Found ${emailIds.length} unseen emails`);

    const emails = [];

    // Obtener detalles de cada correo
    for (const id of emailIds.slice(0, 10)) { // Limitar a 10 correos por ejecución
      try {
        const fetchResponse = await sendCommand(
          `a00${4 + parseInt(id)} FETCH ${id} (BODY[HEADER] BODY[TEXT])`
        );
        
        // Parsear headers básicos
        const fromMatch = fetchResponse.match(/From: ([^\r\n]+)/i);
        const toMatch = fetchResponse.match(/To: ([^\r\n]+)/i);
        const subjectMatch = fetchResponse.match(/Subject: ([^\r\n]+)/i);
        const dateMatch = fetchResponse.match(/Date: ([^\r\n]+)/i);
        const messageIdMatch = fetchResponse.match(/Message-ID: <([^>]+)>/i);

        // Parsear body (simplificado)
        const bodyMatch = fetchResponse.match(/BODY\[TEXT\]\s+\{[\d]+\}\r\n([\s\S]+?)\)/);
        
        emails.push({
          from: fromMatch?.[1] || "",
          to: toMatch?.[1]?.split(",").map(e => e.trim()) || [],
          subject: subjectMatch?.[1] || "(Sin asunto)",
          body_text: bodyMatch?.[1]?.trim() || "",
          message_id: messageIdMatch?.[1] || null,
          received_at: dateMatch?.[1] || new Date().toISOString(),
        });

        // Marcar como leído
        await sendCommand(`a00${5 + parseInt(id)} STORE ${id} +FLAGS (\\Seen)`);
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
