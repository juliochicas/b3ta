import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  text: string;
  action: 'correct' | 'improve' | 'formal' | 'friendly' | 'expand' | 'summarize';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, action }: RequestBody = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY no está configurado");
    }

    console.log(`Mejorando términos y condiciones - Acción: ${action}`);

    // Definir prompts según la acción
    const prompts = {
      correct: `Corrige únicamente los errores de ortografía y gramática en el siguiente texto de términos y condiciones. Mantén el mismo estilo y tono legal. NO cambies el contenido ni la estructura, solo corrige errores:

${text}`,
      
      improve: `Mejora la redacción de los siguientes términos y condiciones haciéndolos más claros y profesionales. Mantén el mismo mensaje legal pero hazlo más fluido y efectivo:

${text}`,
      
      formal: `Reescribe los siguientes términos y condiciones de manera más formal y profesional, apropiado para un documento legal ejecutivo. Mantén todos los puntos clave:

${text}`,
      
      friendly: `Reescribe los siguientes términos y condiciones de manera más amigable y accesible para el cliente, pero manteniendo el profesionalismo y validez legal. Hazlo más fácil de entender:

${text}`,
      
      expand: `Expande los siguientes términos y condiciones agregando más detalles, aclaraciones y ejemplos cuando sea apropiado. Hazlo más completo y detallado mientras mantienes el enfoque legal:

${text}`,
      
      summarize: `Resume los siguientes términos y condiciones de manera concisa, manteniendo solo los puntos legales más importantes y esenciales. Hazlo breve pero completo:

${text}`
    };

    const systemPrompt = `Eres un asistente experto en redacción legal y de términos y condiciones comerciales. Tu trabajo es ayudar a mejorar documentos legales para que sean claros, profesionales y efectivos.

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

    console.log("Términos y condiciones mejorados exitosamente");

    return new Response(
      JSON.stringify({ improvedText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error("Error en improve-terms-text:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Error desconocido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
