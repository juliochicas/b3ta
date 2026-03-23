import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

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

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY not configured");
    }

    const { leadId } = await req.json();
    
    if (!leadId) {
      return new Response(
        JSON.stringify({ error: "leadId is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Obtener el lead de la base de datos
    const { data: lead, error: leadError } = await supabase
      .from('leads_b3ta')
      .select('*')
      .eq('id', leadId)
      .single();

    if (leadError || !lead) {
      throw new Error('Lead not found');
    }

    // Analizar el lead con IA
    const aiPrompt = `Eres un experto en calificación de leads B2B. Analiza este lead y dame:
1. Score de calidad (0-100)
2. Prioridad sugerida (high/medium/low)
3. Resumen breve (2-3 líneas)
4. Próximos pasos recomendados

Lead:
- Nombre: ${lead.name}
- Email: ${lead.email}
- Empresa: ${lead.company || 'No especificada'}
- Teléfono: ${lead.phone || 'No especificado'}
- Servicio de interés: ${lead.service_interest || 'No especificado'}
- Mensaje: ${lead.message || 'Sin mensaje'}

Responde ESTRICTAMENTE en este formato JSON (sin markdown, solo el JSON raw):
{"score": 85, "priority": "high", "summary": "Este lead busca...", "next_steps": "Contactar..."}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: aiPrompt }]
        }],
        generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json"
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const aiData = await response.json();
    let aiContent = aiData.candidates[0].content.parts[0].text;
    
    // Limpiar markdown code blocks si existen
    aiContent = aiContent.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    // Parsear respuesta JSON de IA
    let analysisData;
    try {
      analysisData = JSON.parse(aiContent);
    } catch (e) {
      console.error("Error parsing AI response:", e, "Content:", aiContent);
      // Si no es JSON válido, extraer manualmente
      analysisData = {
        score: 50,
        priority: 'medium',
        summary: aiContent.substring(0, 200),
        next_steps: 'Contactar al lead para calificación manual'
      };
    }

    // Actualizar lead con análisis de IA - guardar como JSON
    const { error: updateError } = await supabase
      .from('leads_b3ta')
      .update({
        ai_score: analysisData.score,
        priority: analysisData.priority,
        ai_summary: JSON.stringify(analysisData)
      })
      .eq('id', leadId);

    if (updateError) {
      throw updateError;
    }

    // Registrar actividad
    await supabase
      .from('lead_activities')
      .insert({
        lead_id: leadId,
        activity_type: 'ai_analysis',
        description: `IA analizó el lead. Score: ${analysisData.score}/100, Prioridad: ${analysisData.priority}`
      });

    return new Response(
      JSON.stringify({ success: true, analysis: analysisData }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const origin = req.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);
    console.error('Error in ai-lead-scorer:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Error procesando lead" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});