import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { formatCurrencyForEmail, formatCurrencyDisplay } from "../_shared/currency.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrencyDisplay(item.unit_price, quotation.currency)}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;"><strong>${formatCurrencyDisplay(item.total, quotation.currency)}</strong></td>
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
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 0; background: #f4f6fa;">
          <!-- Branded Header -->
          <div style="background: #1A1F2E; padding: 28px 32px 20px 32px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0; color: #fff; font-size: 24px; font-weight: 700; letter-spacing: 1px;">B3TA</h2>
            <p style="margin: 4px 0 0 0; color: #b4c8dc; font-size: 12px;">Tecnología que escala contigo</p>
          </div>
          <div style="height: 3px; background: linear-gradient(90deg, #00C9A7, #2B4FE0);"></div>

          <div style="background: #fff; padding: 32px; border-radius: 0 0 8px 8px;">
            <h1 style="margin: 0 0 8px 0; color: #1A1F2E; font-size: 22px;">Cotización ${quotation.quotation_number}</h1>
            <p style="margin: 0 0 24px 0; color: #888; font-size: 13px;">Válida hasta: ${quotation.valid_until ? new Date(quotation.valid_until).toLocaleDateString('es-ES') : 'No especificado'}</p>

            <div style="margin-bottom: 24px; padding: 16px; background: #f8faff; border-left: 4px solid #2B4FE0; border-radius: 4px;">
              <p style="margin: 0; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Cliente</p>
              <p style="margin: 4px 0 0 0; font-weight: 600; color: #1A1F2E;">${quotation.customer_name}</p>
              ${quotation.customer_company ? `<p style="margin: 2px 0 0 0; color: #555;">${quotation.customer_company}</p>` : ''}
              <p style="margin: 2px 0 0 0; color: #555;">${quotation.customer_email}</p>
              ${quotation.tracking_number ? `<p style="margin: 6px 0 0 0; color: #888; font-size: 12px;"><strong>Tracking:</strong> ${quotation.tracking_number}</p>` : ''}
            </div>

            <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
              <thead>
                <tr style="background: #f0f4ff;">
                  <th style="padding: 12px; text-align: left; border-bottom: 2px solid #2B4FE0; color: #1A1F2E; font-size: 13px;">Producto/Servicio</th>
                  <th style="padding: 12px; text-align: center; border-bottom: 2px solid #2B4FE0; color: #1A1F2E; font-size: 13px;">Cantidad</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #2B4FE0; color: #1A1F2E; font-size: 13px;">Precio Unitario</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #2B4FE0; color: #1A1F2E; font-size: 13px;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="text-align: right; padding: 20px; background: #1A1F2E; border-radius: 8px; color: #fff;">
              <div style="margin-bottom: 6px;">
                <span style="color: #b4c8dc; font-size: 13px;">Subtotal:</span>
                <strong style="margin-left: 16px; color: #fff;">${formatCurrencyDisplay(quotation.subtotal, quotation.currency)}</strong>
              </div>
              <div style="margin-bottom: 6px;">
                <span style="color: #b4c8dc; font-size: 13px;">IVA (${quotation.tax_rate}%):</span>
                <span style="margin-left: 16px; color: #b4c8dc;">${formatCurrencyDisplay(quotation.tax_amount, quotation.currency)}</span>
              </div>
              <div style="margin-top: 12px; padding-top: 12px; border-top: 2px solid #00C9A7; font-size: 22px;">
                <span style="color: #b4c8dc;">Total:</span>
                <strong style="margin-left: 16px; color: #00C9A7;">${formatCurrencyDisplay(quotation.total, quotation.currency)}</strong>
              </div>
            </div>

            ${paymentLinkHtml ? `<p style="margin: 24px 0; text-align: center;"><a href="${quotation.stripe_payment_link}" style="display: inline-block; background: linear-gradient(135deg, #2B4FE0, #00C9A7); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">Pagar Ahora</a></p>` : ''}

            ${quotation.notes ? `
              <div style="margin: 24px 0; padding: 16px; background: #f8faff; border-left: 4px solid #00C9A7; border-radius: 4px;">
                <h3 style="margin: 0 0 8px 0; font-size: 13px; color: #1A1F2E; text-transform: uppercase; letter-spacing: 1px;">Notas</h3>
                <p style="margin: 0; white-space: pre-wrap; color: #555; font-size: 13px;">${quotation.notes}</p>
              </div>
            ` : ''}

            ${quotation.terms_conditions ? `
              <div style="margin: 24px 0; padding: 16px; background: #fafafa; border-radius: 4px;">
                <h3 style="margin: 0 0 8px 0; font-size: 12px; color: #1A1F2E; text-transform: uppercase; letter-spacing: 1px;">Términos y Condiciones</h3>
                <p style="margin: 0; white-space: pre-wrap; font-size: 11px; color: #888;">${quotation.terms_conditions}</p>
              </div>
            ` : ''}
          </div>

          <!-- Branded Footer -->
          <div style="background: #1A1F2E; padding: 20px 32px; border-radius: 0 0 8px 8px; margin-top: 2px; text-align: center;">
            <p style="margin: 0; color: #fff; font-weight: 700; font-size: 14px; letter-spacing: 1px;">B3TA</p>
            <p style="margin: 4px 0 0 0; color: #b4c8dc; font-size: 11px;">consulting@b3ta.us | b3ta.us | +1 435 534 8065</p>
            <p style="margin: 8px 0 0 0; color: #7a8ca0; font-size: 10px;">Consultoría en infraestructura, automatización y soluciones digitales</p>
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
