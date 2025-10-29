import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

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
            ${item.description ? `<br/><small style="color: #666; font-size: 12px;">${item.description}</small>` : ''}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${quotation.currency} $${item.unit_price.toFixed(2)}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;"><strong>${quotation.currency} $${item.total.toFixed(2)}</strong></td>
        </tr>
      `)
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Cotización ${quotation.quotation_number}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px 20px;
            }
            .header {
              background: #6366f1;
              color: white;
              padding: 30px;
              border-radius: 8px;
              margin-bottom: 30px;
            }
            .header h1 {
              margin: 0 0 8px 0;
              font-size: 32px;
            }
            .header p {
              margin: 0;
              font-size: 14px;
              opacity: 0.9;
            }
            .section {
              margin-bottom: 30px;
            }
            .section h2 {
              font-size: 16px;
              color: #666;
              margin: 0 0 12px 0;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 24px 0;
            }
            thead tr {
              background: #f8f9fa;
            }
            th {
              padding: 12px;
              border-bottom: 2px solid #dee2e6;
              font-weight: 600;
            }
            th.left { text-align: left; }
            th.center { text-align: center; }
            th.right { text-align: right; }
            .totals {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin-top: 30px;
            }
            .totals-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
            }
            .totals-row.subtotal {
              color: #666;
            }
            .totals-row.total {
              margin-top: 12px;
              padding-top: 12px;
              border-top: 2px solid #dee2e6;
              font-size: 20px;
              font-weight: bold;
            }
            .totals-row.total .value {
              color: #6366f1;
            }
            .info-box {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .info-box p {
              margin: 4px 0;
            }
            .footer {
              margin-top: 50px;
              padding-top: 30px;
              border-top: 1px solid #dee2e6;
              text-align: center;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Cotización ${quotation.quotation_number}</h1>
            <p>Válida hasta: ${quotation.valid_until ? new Date(quotation.valid_until).toLocaleDateString('es-ES') : 'No especificado'}</p>
            <p>Fecha de emisión: ${new Date(quotation.created_at).toLocaleDateString('es-ES')}</p>
          </div>

          <div class="section">
            <h2>Cliente</h2>
            <div class="info-box">
              <p><strong style="font-size: 16px;">${quotation.customer_name}</strong></p>
              ${quotation.customer_company ? `<p>${quotation.customer_company}</p>` : ''}
              <p>${quotation.customer_email}</p>
            </div>
          </div>

          <div class="section">
            <h2>Detalle de Productos/Servicios</h2>
            <table>
              <thead>
                <tr>
                  <th class="left">Producto/Servicio</th>
                  <th class="center">Cantidad</th>
                  <th class="right">Precio Unitario</th>
                  <th class="right">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
          </div>

          <div class="totals">
            <div class="totals-row subtotal">
              <span>Subtotal:</span>
              <strong>${quotation.currency} $${quotation.subtotal.toFixed(2)}</strong>
            </div>
            <div class="totals-row subtotal">
              <span>IVA (${quotation.tax_rate}%):</span>
              <span>${quotation.currency} $${quotation.tax_amount.toFixed(2)}</span>
            </div>
            <div class="totals-row total">
              <span>Total:</span>
              <span class="value">${quotation.currency} $${quotation.total.toFixed(2)}</span>
            </div>
          </div>

          ${quotation.notes ? `
            <div class="section">
              <h2>Notas</h2>
              <div class="info-box">
                <p style="white-space: pre-wrap;">${quotation.notes}</p>
              </div>
            </div>
          ` : ''}

          ${quotation.terms_conditions ? `
            <div class="section">
              <h2>Términos y Condiciones</h2>
              <div class="info-box">
                <p style="white-space: pre-wrap; font-size: 12px; color: #666;">${quotation.terms_conditions}</p>
              </div>
            </div>
          ` : ''}

          <div class="footer">
            <p>Gracias por su preferencia</p>
          </div>
        </body>
      </html>
    `;

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
    });

    await browser.close();

    return new Response(pdfBuffer, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Cotizacion-${quotation.quotation_number}.pdf"`,
      },
      status: 200,
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
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
