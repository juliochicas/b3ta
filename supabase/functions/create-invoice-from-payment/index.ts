import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

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
    console.log("[CREATE-INVOICE] Function started");

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user) throw new Error("User not authenticated");

    const { quotation_id, session_id } = await req.json();
    if (!quotation_id) throw new Error("quotation_id is required");

    console.log("[CREATE-INVOICE] Processing quotation:", quotation_id);

    // Get quotation details with items
    const { data: quotation, error: quotationError } = await supabaseClient
      .from('quotations')
      .select('*, quotation_items(*)')
      .eq('id', quotation_id)
      .single();

    if (quotationError) throw quotationError;
    if (!quotation) throw new Error("Quotation not found");

    console.log("[CREATE-INVOICE] Quotation found:", quotation.quotation_number);

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    let paymentIntent = null;
    let chargeId = null;
    let paymentStatus = "pending";

    // If session_id is provided, get payment details from Stripe
    if (session_id) {
      console.log("[CREATE-INVOICE] Fetching Stripe session:", session_id);
      const session = await stripe.checkout.sessions.retrieve(session_id);
      
      if (session.payment_intent) {
        const pi = await stripe.paymentIntents.retrieve(session.payment_intent as string);
        paymentIntent = pi.id;
        paymentStatus = pi.status === "succeeded" ? "paid" : "pending";
        
        if (pi.latest_charge) {
          chargeId = pi.latest_charge as string;
        }
      }
    }

    console.log("[CREATE-INVOICE] Payment status:", paymentStatus);

    // Generate invoice number
    const { data: invoiceNumber, error: numberError } = await supabaseClient
      .rpc('generate_invoice_number');

    if (numberError) throw numberError;

    console.log("[CREATE-INVOICE] Generated invoice number:", invoiceNumber);

    // Calculate due date (30 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    // Create invoice
    const { data: invoice, error: invoiceError } = await supabaseClient
      .from('invoices')
      .insert({
        invoice_number: invoiceNumber,
        quotation_id: quotation_id,
        customer_name: quotation.customer_name,
        customer_email: quotation.customer_email,
        customer_company: quotation.customer_company,
        stripe_payment_intent: paymentIntent,
        stripe_charge_id: chargeId,
        payment_status: paymentStatus,
        subtotal: quotation.subtotal,
        tax_rate: quotation.tax_rate,
        tax_amount: quotation.tax_amount,
        total: quotation.total,
        currency: quotation.currency,
        invoice_date: new Date().toISOString(),
        payment_date: paymentStatus === "paid" ? new Date().toISOString() : null,
        due_date: dueDate.toISOString(),
        notes: quotation.notes,
        terms_conditions: quotation.terms_conditions,
      })
      .select()
      .single();

    if (invoiceError) throw invoiceError;

    console.log("[CREATE-INVOICE] Invoice created:", invoice.id);

    // Create invoice items from quotation items
    const invoiceItems = quotation.quotation_items.map((item: any) => ({
      invoice_id: invoice.id,
      item_name: item.item_name,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total: item.total,
    }));

    const { error: itemsError } = await supabaseClient
      .from('invoice_items')
      .insert(invoiceItems);

    if (itemsError) throw itemsError;

    console.log("[CREATE-INVOICE] Invoice items created:", invoiceItems.length);

    // Update quotation status if payment was successful
    if (paymentStatus === "paid") {
      await supabaseClient
        .from('quotations')
        .update({ status: 'accepted' })
        .eq('id', quotation_id);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        invoice_id: invoice.id,
        invoice_number: invoice.invoice_number 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("[CREATE-INVOICE] Error:", error);
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
