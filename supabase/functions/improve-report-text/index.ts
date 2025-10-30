import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  text: string;
  action: 'correct' | 'improve' | 'structure' | 'professional' | 'expand';
  section: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, action, section }: RequestBody = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY no está configurado");
    }

    console.log(`Mejorando texto - Sección: ${section}, Acción: ${action}`);

    // Definir prompts según la acción
    const prompts = {
      correct: `Corrige únicamente los errores de ortografía y gramática en el siguiente texto. Mantén el mismo estilo y tono. NO cambies el contenido ni la estructura, solo corrige errores:

${text}`,
      
      improve: `Mejora la redacción del siguiente texto haciéndolo más claro y profesional. Mantén el mismo mensaje principal pero hazlo más fluido y efectivo:

${text}`,
      
      structure: `Organiza y estructura el siguiente texto en párrafos bien definidos con una jerarquía lógica. Agrega conectores y haz que fluya mejor:

${text}`,
      
      professional: `Reescribe el siguiente texto de manera más formal y profesional, apropiado para un informe de consultoría ejecutiva. Mantén todos los puntos clave:

${text}`,
      
      expand: `Expande el siguiente texto agregando más detalles, ejemplos y explicaciones. Hazlo más completo y detallado mientras mantienes el enfoque principal:

${text}`
    };

    const systemPrompt = `Eres un asistente experto en redacción de informes de consultoría profesional. Tu trabajo es ayudar a mejorar textos para informes empresariales de alta calidad.

INSTRUCCIONES CRÍTICAS:
- Responde ÚNICAMENTE con el texto mejorado
- NO agregues comentarios, explicaciones o meta-texto
- NO uses comillas, asteriscos ni formato markdown
- Mantén el idioma original del texto (español)
- Si el texto está vacío o es muy corto, responde: "Por favor ingresa más texto para poder ayudarte."`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompts[action] }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Límite de solicitudes excedido. Intenta de nuevo en unos minutos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos agotados. Por favor recarga tu cuenta de Lovable AI." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("Error de Lovable AI:", response.status, errorText);
      throw new Error("Error al comunicarse con Lovable AI");
    }

    const data = await response.json();
    const improvedText = data.choices[0]?.message?.content || "";

    console.log("Texto mejorado exitosamente");

    return new Response(
      JSON.stringify({ improvedText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Error en improve-report-text:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Error desconocido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
