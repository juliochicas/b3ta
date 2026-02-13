import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const HORMOZI_SYSTEM_PROMPT = `Eres un experto en estrategia de ventas basado en los frameworks de Alex Hormozi del libro "$100M Offers". Tu trabajo es analizar demos/páginas que YA SE CONSTRUYERON para un cliente y generar una propuesta de valor que justifique lo que SE HIZO, no lo que se podría hacer.

IMPORTANTE: El demo/página HTML que recibes ES LO QUE YA SE LE ENTREGÓ AL CLIENTE. Tu cotización debe reflejar EXACTAMENTE lo que se construyó. No inventes servicios adicionales ni ofrezcas cosas que no están en el demo. Sé puntual y específico.

## ECUACIÓN DE VALOR DE HORMOZI
Valor = (Resultado Soñado × Probabilidad Percibida de Logro) / (Retraso de Tiempo Percibido × Esfuerzo y Sacrificio Percibidos)

## OFERTA GRAND SLAM
Los items deben ser ESPECÍFICOS a lo que se construyó en el demo. Apila valor con bonos, garantías, escasez, urgencia. El valor percibido debe ser 10x el precio.

## TU TAREA
Analiza el contenido HTML del demo/página que SE LE CONSTRUYÓ al cliente. Genera una cotización que refleje EXACTAMENTE lo que se hizo.

RESPONDE SIEMPRE en formato JSON con esta estructura exacta:
{
  "analysis": {
    "dream_outcome": "El resultado que logra con lo que se le construyó",
    "pain_points": ["dolor que resuelve lo construido 1", "dolor 2"],
    "perceived_probability": "Por qué va a funcionar lo que se hizo",
    "time_delay": "Cuánto tarda en ver resultados",
    "effort_sacrifice": "Qué tan fácil es usar lo entregado"
  },
  "items": [
    {
      "item_name": "Nombre específico de lo que se construyó",
      "description": "Descripción basada en el demo real",
      "quantity": 1,
      "unit_price": 0,
      "suggested_price": 0
    }
  ],
  "bonuses": [
    {
      "name": "Nombre del bono",
      "description": "Qué incluye",
      "perceived_value": 0
    }
  ],
  "guarantee": {
    "type": "Tipo de garantía",
    "description": "Descripción"
  },
  "scarcity": {
    "type": "Tipo de escasez",
    "description": "Cómo se limita"
  },
  "urgency": {
    "reason": "Por qué actuar ahora",
    "deadline": "Fecha límite"
  },
  "offer_name": "Nombre atractivo para la oferta",
  "grand_slam_section_html": "HTML visual con estilos inline. Colores: #6366f1 y #0f172a. Auto-contenido.",
  "terms_suggestion": "Términos y condiciones sugeridos",
  "notes": "Notas persuasivas"
}

IMPORTANTE:
- Los items deben reflejar EXACTAMENTE lo que se ve en el demo HTML
- Si se proporcionan productos del catálogo, usa sus precios como referencia
- Usa la moneda que se indique en el mensaje del usuario
- Todo en español
- Sé PUNTUAL: el cliente recibe ESTO que se le hizo, no más`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { html_content, customer_name, customer_company, products_catalog, custom_prompt, currency } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const userMessage = `Analiza el siguiente demo/página HTML que YA SE LE CONSTRUYÓ a un cliente y genera una cotización Grand Slam que refleje EXACTAMENTE lo que se hizo.

CLIENTE: ${customer_name || 'No especificado'}
EMPRESA: ${customer_company || 'No especificada'}
MONEDA: ${currency || 'USD'} (usa esta moneda para todos los precios)

${custom_prompt ? `INSTRUCCIONES ADICIONALES: ${custom_prompt}` : ''}

PRODUCTOS/SERVICIOS DISPONIBLES EN CATÁLOGO:
${products_catalog && products_catalog.length > 0 
  ? products_catalog.map((p: any) => `- ${p.name}: $${p.unit_price} ${p.currency} (${p.type}) - ${p.description || 'Sin descripción'}`).join('\n')
  : 'No hay productos en catálogo. Sugiere items basándote en el demo.'}

CONTENIDO HTML DEL DEMO/PÁGINA:
\`\`\`html
${html_content ? html_content.substring(0, 15000) : 'No se proporcionó HTML. Genera una cotización basada en los datos del cliente y productos disponibles.'}
\`\`\`

Genera la cotización Grand Slam completa en formato JSON.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: HORMOZI_SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Límite de solicitudes excedido. Intenta de nuevo en unos segundos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes. Agrega fondos en Configuración." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse JSON from the response
    let parsedContent;
    const extractJson = (text: string): string => {
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
      if (jsonMatch) return jsonMatch[1].trim();
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) return text.substring(jsonStart, jsonEnd + 1);
      return text.trim();
    };

    const jsonStr = extractJson(content);

    try {
      parsedContent = JSON.parse(jsonStr);
    } catch (_e1) {
      console.error("First parse failed, retrying with AI fix...");
      // Ask AI to fix the JSON
      const retryResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-lite",
          messages: [
            { role: "system", content: "Fix the following broken JSON. Return ONLY valid JSON, no markdown, no explanation. Escape all quotes inside string values." },
            { role: "user", content: jsonStr.substring(0, 30000) },
          ],
        }),
      });

      if (!retryResponse.ok) throw new Error("No se pudo procesar la respuesta. Intenta de nuevo.");
      const retryData = await retryResponse.json();
      const retryContent = retryData.choices?.[0]?.message?.content || "";
      const retryJson = extractJson(retryContent);
      try {
        parsedContent = JSON.parse(retryJson);
      } catch (_e2) {
        console.error("All parse attempts failed. Content:", content.substring(0, 500));
        throw new Error("No se pudo procesar la respuesta de la IA. Intenta de nuevo.");
      }
    }

    return new Response(JSON.stringify(parsedContent), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Error generando cotización" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
