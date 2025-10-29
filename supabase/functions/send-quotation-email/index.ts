import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
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
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user) throw new Error("User not authenticated");

    const { quotation_id } = await req.json();
    if (!quotation_id) throw new Error("quotation_id is required");

    // Get quotation details
    const { data: quotation, error: quotationError } = await supabaseClient
      .from('quotations')
      .select('*, quotation_items(*)')
      .eq('id', quotation_id)
      .single();

    if (quotationError) throw quotationError;
    if (!quotation) throw new Error("Quotation not found");

    // Build items HTML
    const itemsHtml = quotation.quotation_items
      .map((item: any) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">
            <strong>${item.item_name}</strong>
            ${item.description ? `<br/><small style="color: #666;">${item.description}</small>` : ''}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${quotation.currency} $${item.unit_price.toFixed(2)}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;"><strong>${quotation.currency} $${item.total.toFixed(2)}</strong></td>
        </tr>
      `)
      .join('');

    const paymentLinkHtml = quotation.stripe_payment_link 
      ? `<p style="margin: 24px 0;"><a href="${quotation.stripe_payment_link}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">Pagar Ahora</a></p>`
      : '';

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Cotización ${quotation.quotation_number}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
            <h1 style="margin: 0 0 8px 0; color: #1a1a1a;">Cotización ${quotation.quotation_number}</h1>
            <p style="margin: 0; color: #666;">Válida hasta: ${quotation.valid_until ? new Date(quotation.valid_until).toLocaleDateString('es-ES') : 'No especificado'}</p>
          </div>

          <div style="margin-bottom: 24px;">
            <h2 style="font-size: 16px; color: #666; margin: 0 0 8px 0;">Cliente</h2>
            <p style="margin: 0;"><strong>${quotation.customer_name}</strong></p>
            ${quotation.customer_company ? `<p style="margin: 4px 0 0 0;">${quotation.customer_company}</p>` : ''}
            <p style="margin: 4px 0 0 0;">${quotation.customer_email}</p>
            ${quotation.tracking_number ? `<p style="margin: 8px 0 0 0; color: #666;"><strong>Tracking:</strong> ${quotation.tracking_number}</p>` : ''}
          </div>

          <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
            <thead>
              <tr style="background: #f8f9fa;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Producto/Servicio</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">Cantidad</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">Precio Unitario</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="text-align: right; padding: 16px; background: #f8f9fa; border-radius: 8px;">
            <div style="margin-bottom: 8px;">
              <span style="color: #666;">Subtotal:</span>
              <strong style="margin-left: 16px;">${quotation.currency} $${quotation.subtotal.toFixed(2)}</strong>
            </div>
            <div style="margin-bottom: 8px; color: #666;">
              <span>IVA (${quotation.tax_rate}%):</span>
              <span style="margin-left: 16px;">${quotation.currency} $${quotation.tax_amount.toFixed(2)}</span>
            </div>
            <div style="margin-top: 12px; padding-top: 12px; border-top: 2px solid #dee2e6; font-size: 20px;">
              <span>Total:</span>
              <strong style="margin-left: 16px; color: #6366f1;">${quotation.currency} $${quotation.total.toFixed(2)}</strong>
            </div>
          </div>

          ${paymentLinkHtml}

          ${quotation.notes ? `
            <div style="margin: 24px 0; padding: 16px; background: #f8f9fa; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 14px; color: #666;">Notas</h3>
              <p style="margin: 0; white-space: pre-wrap;">${quotation.notes}</p>
            </div>
          ` : ''}

          ${quotation.terms_conditions ? `
            <div style="margin: 24px 0; padding: 16px; background: #f8f9fa; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 14px; color: #666;">Términos y Condiciones</h3>
              <p style="margin: 0; white-space: pre-wrap; font-size: 12px; color: #666;">${quotation.terms_conditions}</p>
            </div>
          ` : ''}

          <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #dee2e6; text-align: center; color: #666; font-size: 12px;">
            <p style="margin: 0;">Gracias por su preferencia</p>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "B3TA <onboarding@resend.dev>",
      to: [quotation.customer_email],
      subject: `Cotización ${quotation.quotation_number}`,
      html: emailHtml,
    });

    // Update quotation status to sent
    await supabaseClient
      .from('quotations')
      .update({ 
        status: 'sent',
        sent_at: new Date().toISOString()
      })
      .eq('id', quotation_id);

    return new Response(
      JSON.stringify(emailResponse), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
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
