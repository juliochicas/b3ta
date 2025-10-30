import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);
    if (userError || !user) throw new Error("Unauthorized");

    const { text, action, language } = await req.json();

    if (!text || !action) {
      throw new Error("Missing required fields: text, action");
    }

    let systemPrompt = "";
    let userPrompt = "";

    switch (action) {
      case "correct":
        systemPrompt =
          "Eres un asistente experto en corrección de textos en español. Corrige ortografía, gramática y puntuación sin cambiar el tono o el mensaje original.";
        userPrompt = `Corrige este texto manteniendo el mismo tono y mensaje:\n\n${text}`;
        break;

      case "improve":
        systemPrompt =
          "Eres un asistente experto en redacción profesional. Mejora la claridad, fluidez y profesionalismo del texto manteniendo el mensaje original.";
        userPrompt = `Mejora la redacción de este texto haciéndolo más profesional y claro:\n\n${text}`;
        break;

      case "formal":
        systemPrompt =
          "Eres un asistente experto en comunicación corporativa. Convierte textos a un tono formal y profesional.";
        userPrompt = `Reescribe este texto con un tono formal y profesional:\n\n${text}`;
        break;

      case "friendly":
        systemPrompt =
          "Eres un asistente experto en comunicación amigable. Convierte textos a un tono cálido y cercano sin perder profesionalismo.";
        userPrompt = `Reescribe este texto con un tono más amigable y cercano:\n\n${text}`;
        break;

      case "expand":
        systemPrompt =
          "Eres un asistente experto en redacción. Expande textos añadiendo detalles relevantes y manteniendo coherencia.";
        userPrompt = `Expande este texto añadiendo más detalles y explicaciones:\n\n${text}`;
        break;

      case "summarize":
        systemPrompt =
          "Eres un asistente experto en síntesis. Resume textos manteniendo los puntos clave.";
        userPrompt = `Resume este texto manteniendo los puntos más importantes:\n\n${text}`;
        break;

      case "translate":
        systemPrompt = `Eres un traductor profesional. Traduce textos al ${
          language || "inglés"
        } manteniendo el tono y contexto.`;
        userPrompt = `Traduce este texto al ${language || "inglés"}:\n\n${text}`;
        break;

      case "generate":
        systemPrompt =
          "Eres un asistente experto en redacción de correos profesionales. Genera correos bien estructurados basados en la información proporcionada.";
        userPrompt = `Genera un correo profesional basado en estas instrucciones:\n\n${text}`;
        break;

      default:
        throw new Error("Invalid action");
    }

    console.log("Calling Lovable AI with action:", action);

    const aiResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      }
    );

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI Gateway error:", aiResponse.status, errorText);
      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const improvedText = aiData.choices?.[0]?.message?.content;

    if (!improvedText) {
      throw new Error("No response from AI");
    }

    console.log("AI response received successfully");

    return new Response(JSON.stringify({ improvedText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in improve-email-text function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
