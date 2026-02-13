import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const HORMOZI_SYSTEM_PROMPT = `Eres un experto en estrategia de ventas basado en los frameworks de Alex Hormozi del libro "$100M Offers". Tu trabajo es analizar demos/páginas de clientes y generar cotizaciones irresistibles usando estos frameworks:

## ECUACIÓN DE VALOR DE HORMOZI
Valor = (Resultado Soñado × Probabilidad Percibida de Logro) / (Retraso de Tiempo Percibido × Esfuerzo y Sacrificio Percibidos)

Para maximizar el valor:
1. AUMENTAR el Resultado Soñado (¿qué logra el cliente?)
2. AUMENTAR la Probabilidad Percibida (¿por qué van a lograrlo con nosotros?)
3. DISMINUIR el Retraso de Tiempo (¿qué tan rápido ven resultados?)
4. DISMINUIR el Esfuerzo/Sacrificio (¿qué tan fácil es para ellos?)

## OFERTA GRAND SLAM
Una oferta tan buena que el cliente "se sentiría estúpido diciendo que no":
- Identifica puntos de dolor ANTES y DESPUÉS de la compra
- Crea vehículos de entrega de soluciones para cada problema
- Apila valor: bonos, garantías, escasez, urgencia
- El valor percibido debe ser 10x el precio

## MEJORAS DE OFERTA
1. ESCASEZ: Limitar disponibilidad (plazas, tiempo, edición)
2. URGENCIA: Razones para actuar AHORA (descuento temporal, precio sube)
3. BONIFICACIONES: Valor adicional gratuito que complementa
4. GARANTÍAS: Eliminar el riesgo del comprador
5. NAMING: Nombre atractivo para la oferta

## TU TAREA
Analiza el contenido HTML del demo/página del cliente y los productos/servicios disponibles. Genera una cotización Grand Slam completa.

RESPONDE SIEMPRE en formato JSON con esta estructura exacta:
{
  "analysis": {
    "dream_outcome": "El resultado soñado del cliente",
    "pain_points": ["dolor 1", "dolor 2", "dolor 3"],
    "perceived_probability": "Por qué van a lograr su resultado con nosotros",
    "time_delay": "Cuánto tardan en ver resultados",
    "effort_sacrifice": "Qué tan fácil es para ellos"
  },
  "items": [
    {
      "item_name": "Nombre del servicio/producto",
      "description": "Descripción persuasiva usando frameworks de Hormozi",
      "quantity": 1,
      "unit_price": 0,
      "suggested_price": 0
    }
  ],
  "bonuses": [
    {
      "name": "Nombre del bono",
      "description": "Qué incluye y por qué es valioso",
      "perceived_value": 0
    }
  ],
  "guarantee": {
    "type": "Tipo de garantía (incondicional, condicional, anti-garantía)",
    "description": "Descripción de la garantía"
  },
  "scarcity": {
    "type": "Tipo de escasez",
    "description": "Cómo se limita la oferta"
  },
  "urgency": {
    "reason": "Por qué actuar ahora",
    "deadline": "Fecha o condición límite"
  },
  "offer_name": "Nombre atractivo para la oferta (naming Hormozi)",
  "grand_slam_section_html": "HTML completo para una sección visual tipo landing page que muestra: antes/después, ecuación de valor, bonos apilados, garantía, y call to action. Usa estilos inline modernos con gradientes, sombras, y diseño responsive. Colores principales: #6366f1 (indigo) y #0f172a (slate). El HTML debe ser auto-contenido y verse profesional.",
  "terms_suggestion": "Términos y condiciones sugeridos que refuercen la oferta",
  "notes": "Notas persuasivas para la cotización"
}

IMPORTANTE:
- Si se proporcionan productos del catálogo, usa sus precios reales como base pero sugiere precios optimizados
- El grand_slam_section_html debe ser HTML completo, profesional, con estilos inline, responsive
- Todo en español
- Sé específico al analizar el HTML del demo - menciona elementos concretos que viste`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { html_content, customer_name, customer_company, products_catalog, custom_prompt } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const userMessage = `Analiza el siguiente demo/página HTML de un cliente y genera una cotización Grand Slam irresistible.

CLIENTE: ${customer_name || 'No especificado'}
EMPRESA: ${customer_company || 'No especificada'}

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

    // Parse JSON from the response (handle markdown code blocks)
    let parsedContent;
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      parsedContent = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Content:", content.substring(0, 500));
      // Try to extract JSON object directly
      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        parsedContent = JSON.parse(content.substring(jsonStart, jsonEnd + 1));
      } else {
        throw new Error("Could not parse AI response as JSON");
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
