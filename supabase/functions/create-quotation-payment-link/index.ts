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

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ 
      email: quotation.customer_email, 
      limit: 1 
    });
    
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      // Create new customer
      const customer = await stripe.customers.create({
        email: quotation.customer_email,
        name: quotation.customer_name,
      });
      customerId = customer.id;
    }

    // Create checkout session with line items from quotation
    const lineItems = quotation.quotation_items.map((item: any) => ({
      price_data: {
        currency: quotation.currency.toLowerCase(),
        unit_amount: Math.round(item.unit_price * 100), // Convert to cents
        product_data: {
          name: item.item_name,
          description: item.description || undefined,
        },
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: lineItems,
      mode: "payment",
      locale: "en", // Forzar formato con punto decimal (200.00 en lugar de 200,00)
      success_url: `${req.headers.get("origin")}/quotations?payment=success&quotation=${quotation.quotation_number}`,
      cancel_url: `${req.headers.get("origin")}/quotations?payment=canceled`,
      metadata: {
        quotation_id: quotation.id,
        quotation_number: quotation.quotation_number,
      },
    });

    // Update quotation with payment link
    await supabaseClient
      .from('quotations')
      .update({ stripe_payment_link: session.url })
      .eq('id', quotation_id);

    return new Response(
      JSON.stringify({ url: session.url }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating payment link:", error);
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
