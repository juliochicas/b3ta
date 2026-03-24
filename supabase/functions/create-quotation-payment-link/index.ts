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

    console.log("[PAYMENT-LINK] Creating payment link for quotation:", quotation_id);

    // Get quotation details with customer info
    const { data: quotation, error: quotationError } = await supabaseClient
      .from('quotations')
      .select(`
        *,
        quotation_items(*),
        customers(email, name, company)
      `)
      .eq('id', quotation_id)
      .single();

    if (quotationError) throw quotationError;
    if (!quotation) throw new Error("Quotation not found");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check if customer exists in Stripe
    const customers = await stripe.customers.list({ 
      email: quotation.customers.email, 
      limit: 1 
    });
    
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("[PAYMENT-LINK] Using existing customer:", customerId);
    } else {
      // Create new customer
      const customer = await stripe.customers.create({
        email: quotation.customers.email,
        name: quotation.customers.name,
        metadata: {
          customer_id: quotation.customer_id,
        },
      });
      customerId = customer.id;
      console.log("[PAYMENT-LINK] Created new customer:", customerId);
    }

    // Create products and prices for each item
    const lineItems = [];
    
    for (const item of quotation.quotation_items) {
      console.log("[PAYMENT-LINK] Creating product for:", item.item_name);
      
      // Create product
      const product = await stripe.products.create({
        name: item.item_name,
        description: item.description || undefined,
        metadata: {
          quotation_id: quotation.id,
          quotation_item_id: item.id,
        },
      });

      // Create price
      const price = await stripe.prices.create({
        product: product.id,
        currency: quotation.currency.toLowerCase(),
        unit_amount: Math.round(item.unit_price * 100), // Convert to cents
      });

      lineItems.push({
        price: price.id,
        quantity: item.quantity,
      });
    }

    // Append Tax Line Item (IVA) if applicable
    if (quotation.tax_amount > 0) {
      console.log("[PAYMENT-LINK] Creating tax line item for", quotation.tax_amount);
      const taxProduct = await stripe.products.create({
        name: `IVA (${quotation.tax_rate}%)`,
        description: 'Impuesto al Valor Agregado',
        metadata: {
          quotation_id: quotation.id,
        },
      });
      const taxPrice = await stripe.prices.create({
        product: taxProduct.id,
        currency: quotation.currency.toLowerCase(),
        unit_amount: Math.round(quotation.tax_amount * 100),
      });
      lineItems.push({
        price: taxPrice.id,
        quantity: 1,
      });
    }

    console.log("[PAYMENT-LINK] Creating payment link with", lineItems.length, "items");

    // Create payment link (no expira)
    let paymentLink = await stripe.paymentLinks.create({
      line_items: lineItems,
      after_completion: {
        type: 'redirect',
        redirect: {
          url: `${req.headers.get("origin")}/quotations?payment=success&quotation=${quotation.quotation_number}`,
        },
      },
      metadata: {
        quotation_id: quotation.id,
        quotation_number: quotation.quotation_number,
      },
      invoice_creation: {
        enabled: true,
        invoice_data: {
          custom_fields: [
            {
              name: 'Cotización',
              value: quotation.quotation_number,
            },
          ],
          metadata: {
            quotation_id: quotation.id,
          },
        },
      },
    });

    let finalUrl = paymentLink.url;

    // Handle Discounts by generating and appending a Promotion Code
    if (quotation.discount_amount > 0) {
      console.log("[PAYMENT-LINK] Creating discount coupon for", quotation.discount_amount);
      try {
        const coupon = await stripe.coupons.create({
          amount_off: Math.round(quotation.discount_amount * 100),
          currency: quotation.currency.toLowerCase(),
          duration: 'once',
          name: 'Descuento Aplicado',
        });
        const promoCode = await stripe.promotionCodes.create({
          coupon: coupon.id,
          code: `DESC-${quotation.quotation_number}-${Date.now().toString().slice(-4)}`,
        });
        finalUrl = `${paymentLink.url}?prefilled_promo_code=${promoCode.code}`;
        console.log("[PAYMENT-LINK] Discount appended to URL");
      } catch (e) {
        console.error("[PAYMENT-LINK] Failed to generate promo code", e);
      }
    }

    console.log("[PAYMENT-LINK] Payment link created:", finalUrl);

    // Update quotation with payment link
    await supabaseClient
      .from('quotations')
      .update({ stripe_payment_link: finalUrl })
      .eq('id', quotation_id);

    return new Response(
      JSON.stringify({ url: finalUrl }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("[PAYMENT-LINK] Error:", error);
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
