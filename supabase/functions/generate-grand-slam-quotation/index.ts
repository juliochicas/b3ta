import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const HORMOZI_SYSTEM_PROMPT = `Eres un experto en estrategia de ventas basado en los frameworks de Alex Hormozi. Tu trabajo es analizar demos/páginas ya construidas y extraer el MÁXIMO VALOR percibido para redactar una cotización profesional.

## TU TAREA
1. Analiza el HTML del demo/página para identificar EXACTAMENTE qué se construyó
2. Usa la Ecuación de Valor de Hormozi INTERNAMENTE para redactar descripciones persuasivas
3. Genera JSON con análisis interno (Hormozi) + formato limpio para PDF profesional

ECUACIÓN DE VALOR (para análisis interno):
Valor = (Resultado Soñado × Probabilidad Percibida) / (Retraso de Tiempo × Esfuerzo/Sacrificio)

RESPONDE en JSON con esta estructura:
{
  "analysis": {
    "dream_outcome": "Qué logra el cliente con esto",
    "pain_points": ["problema 1", "problema 2"],
    "perceived_probability": "Por qué funciona",
    "time_delay": "Cuándo ve resultados",
    "effort_sacrifice": "Facilidad de uso"
  },
  "quotation": {
    "title": "Nombre del proyecto",
    "sections": [
      {
        "title": "Nombre de la sección",
        "icon": "📱",
        "description": "Descripción clara y persuasiva",
        "features": ["feature 1", "feature 2"]
      }
    ],
    "pricing": {
      "base_price": 5000,
      "currency": "USD",
      "terms": "Términos claros y profesionales"
    }
  },
  "professional_summary": "Resumen ejecutivo para PDF"
}

REGLAS:
- Sé específico: refleja EXACTAMENTE lo que se construyó, nada más
- Usa la redacción del PDF de ejemplo: bullets, descripciones técnicas claras
- Las descripciones deben ser persuasivas pero profesionales (sin frameworks visibles)
- Todo en español`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { html_content, customer_name, customer_company, products_catalog, custom_prompt, currency } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const userMessage = `Analiza el siguiente demo/página HTML que YA SE LE CONSTRUYÓ a un cliente y genera una cotización profesional siguiendo el formato de ejemplo (secciones con bullets, descripción clara, precio al final).

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

IMPORTANTE:
- Usa la Ecuación de Valor de Hormozi INTERNAMENTE para redactar descripciones persuasivas
- El JSON que generes debe tener: analysis (interno) + quotation (formato limpio para PDF)
- No incluyas "Grand Slam", "bonuses", "scarcity" u otros frameworks visibles
- El resultado final debe parecer una cotización profesional estándar, no una propuesta de ventas agresiva

Genera el JSON con el análisis y la cotización profesional.`;

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
