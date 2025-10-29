import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    console.log("[SEND-INVOICE] Function started");

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user) throw new Error("User not authenticated");

    const { invoice_id } = await req.json();
    if (!invoice_id) throw new Error("invoice_id is required");

    console.log("[SEND-INVOICE] Processing invoice:", invoice_id);

    // Get invoice details with items
    const { data: invoice, error: invoiceError } = await supabaseClient
      .from('invoices')
      .select('*, invoice_items(*)')
      .eq('id', invoice_id)
      .single();

    if (invoiceError) throw invoiceError;
    if (!invoice) throw new Error("Invoice not found");

    console.log("[SEND-INVOICE] Invoice found:", invoice.invoice_number);

    // Build HTML email
    const itemsHtml = invoice.invoice_items
      .map(
        (item: any) => `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 12px 8px;">${item.item_name}</td>
          <td style="padding: 12px 8px; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px 8px; text-align: right;">$${Number(item.unit_price).toFixed(2)}</td>
          <td style="padding: 12px 8px; text-align: right; font-weight: bold;">$${Number(item.total).toFixed(2)}</td>
        </tr>
      `
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #6366f1; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">B3TA</h1>
          <p style="margin: 10px 0 0 0; font-size: 14px;">Factura ${invoice.invoice_number}</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #6366f1; margin-top: 0;">Estimado/a ${invoice.customer_name},</h2>
            <p>Adjuntamos la factura ${invoice.invoice_number} correspondiente a su compra.</p>
            
            ${invoice.payment_status === "paid" 
              ? '<p style="color: #10b981; font-weight: bold;">✓ Su pago ha sido procesado exitosamente</p>' 
              : '<p style="color: #f59e0b; font-weight: bold;">⚠ Pago pendiente</p>'
            }
          </div>

          <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #6366f1; margin-top: 0; border-bottom: 2px solid #6366f1; padding-bottom: 10px;">Detalles de la Factura</h3>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background: #f8f9fa; border-bottom: 2px solid #6366f1;">
                  <th style="padding: 12px 8px; text-align: left;">Producto/Servicio</th>
                  <th style="padding: 12px 8px; text-align: center;">Cant.</th>
                  <th style="padding: 12px 8px; text-align: right;">P. Unit.</th>
                  <th style="padding: 12px 8px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="text-align: right; margin-top: 20px; padding-top: 20px; border-top: 2px solid #eee;">
              <p style="margin: 5px 0;">Subtotal: <strong>$${Number(invoice.subtotal).toFixed(2)}</strong></p>
              <p style="margin: 5px 0; color: #666;">IVA (${invoice.tax_rate}%): <strong>$${Number(invoice.tax_amount).toFixed(2)}</strong></p>
              <p style="margin: 15px 0 0 0; font-size: 20px; color: #6366f1;">
                <strong>Total: $${Number(invoice.total).toFixed(2)} ${invoice.currency}</strong>
              </p>
            </div>
          </div>

          ${invoice.payment_status !== "paid" 
            ? `<div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0; color: #f59e0b;"><strong>Fecha de vencimiento:</strong> ${new Date(invoice.due_date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>` 
            : ''
          }

          ${invoice.notes 
            ? `<div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #6366f1; margin-top: 0;">Notas:</h3>
                <p style="margin: 0; white-space: pre-wrap;">${invoice.notes}</p>
              </div>` 
            : ''
          }

          <div style="background: white; padding: 25px; border-radius: 8px; text-align: center;">
            <p style="margin: 0; color: #666;">¿Tiene alguna pregunta?</p>
            <p style="margin: 10px 0 0 0;">
              <a href="mailto:hi@b3ta.us" style="color: #6366f1; text-decoration: none; font-weight: bold;">hi@b3ta.us</a>
            </p>
          </div>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
          <p style="margin: 5px 0;"><strong>B3TA</strong></p>
          <p style="margin: 5px 0;">hi@b3ta.us | consulting@b3ta.us | b3ta.us | +1 435 534 8065</p>
          <p style="margin: 5px 0;">Consultoría en infraestructura, automatización y soluciones digitales</p>
        </div>
      </body>
      </html>
    `;

    // Send email
    const emailResponse = await resend.emails.send({
      from: "B3TA <onboarding@resend.dev>",
      to: [invoice.customer_email],
      subject: `Factura ${invoice.invoice_number} - B3TA`,
      html: html,
    });

    console.log("[SEND-INVOICE] Email sent:", emailResponse);

    // Update sent_at timestamp
    await supabaseClient
      .from('invoices')
      .update({ sent_at: new Date().toISOString() })
      .eq('id', invoice_id);

    return new Response(
      JSON.stringify({ success: true, message: "Invoice sent successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("[SEND-INVOICE] Error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
