import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

// Función para eliminar correos del servidor IMAP
async function deleteEmailFromIMAP(account: any, imapUid: string) {
  try {
    console.log(`Connecting to IMAP: ${account.imap_host}:${account.imap_port}`);
    
    const conn = await Deno.connectTls({
      hostname: account.imap_host,
      port: account.imap_port,
    });

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

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

    // Marcar correo como eliminado
    console.log(`Marking email ${imapUid} for deletion...`);
    await sendCommand(`a003 STORE ${imapUid} +FLAGS (\\Deleted)`);

    // Expunge (eliminar permanentemente)
    console.log("Expunging deleted emails...");
    await sendCommand("a004 EXPUNGE");

    // Logout
    await sendCommand("a999 LOGOUT");
    conn.close();

    console.log(`Email ${imapUid} deleted successfully from IMAP server`);
    return true;
  } catch (error) {
    console.error("IMAP Delete Error:", error);
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

    const { emailId } = await req.json();

    if (!emailId) {
      throw new Error("Email ID is required");
    }

    console.log("Fetching email:", emailId);

    // Obtener el correo con su cuenta y UID de IMAP
    const { data: email, error: emailError } = await supabase
      .from("emails")
      .select("*, account_id, imap_uid")
      .eq("id", emailId)
      .single();

    if (emailError || !email) {
      throw new Error("Email not found");
    }

    // Si tiene imap_uid y account_id, eliminarlo del servidor
    if (email.imap_uid && email.account_id) {
      const { data: account, error: accountError } = await supabase
        .from("email_accounts")
        .select("*")
        .eq("id", email.account_id)
        .eq("is_active", true)
        .single();

      if (account && !accountError) {
        try {
          await deleteEmailFromIMAP(account, email.imap_uid);
          console.log("Email deleted from IMAP server");
        } catch (error) {
          console.error("Failed to delete from IMAP, will only delete from DB:", error);
          // Continuar aunque falle la eliminación del servidor
        }
      }
    }

    // Eliminar de la base de datos
    const { error: deleteError } = await supabase
      .from("emails")
      .delete()
      .eq("id", emailId);

    if (deleteError) {
      throw deleteError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email deleted successfully from server and database"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in delete-email-imap:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Error al eliminar el correo del servidor"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
