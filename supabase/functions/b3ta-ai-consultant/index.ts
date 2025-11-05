import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, limit = 20, windowMs = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= limit) {
    return false;
  }
  
  record.count++;
  return true;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting check
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  if (!checkRateLimit(clientIp, 20, 60000)) {
    return new Response(
      JSON.stringify({ error: "Demasiadas solicitudes, intenta más tarde" }),
      { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { messages } = await req.json();
    
    // Validación de input
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Formato de mensajes inválido" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Límite de mensajes en historial
    if (messages.length > 50) {
      return new Response(
        JSON.stringify({ error: "Demasiados mensajes en el historial" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Validar cada mensaje
    for (const msg of messages) {
      if (!msg.role || !msg.content || typeof msg.content !== 'string') {
        return new Response(
          JSON.stringify({ error: "Formato de mensaje inválido" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Límite de caracteres por mensaje
      if (msg.content.length > 2000) {
        return new Response(
          JSON.stringify({ error: "Mensaje demasiado largo" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const systemPrompt = `Eres un consultor experto de B3TA para empresas en LATAM. Tienes conocimiento profundo en:

1. SAP: implementación, optimización, migración a S/4HANA, integración con sistemas legacy
2. E-commerce: Shopify Plus, arquitectura headless, optimización de conversión
3. Automatización: n8n, Make, Zapier, workflows complejos, RPA
4. Inteligencia Artificial: LLMs, RAG, agentes autónomos, integración empresarial
5. Importaciones de China: búsqueda de proveedores, negociación, auditoría de fábricas, inspección de mercancía, envíos aéreos/marítimos, logística completa y gestión aduanal de China a LATAM

Tu misión:
- Diagnosticar necesidades del cliente con preguntas inteligentes
- Identificar pain points específicos de su industria
- Recomendar soluciones concretas de B3TA
- Detectar oportunidades comerciales y sugerir el paquete adecuado
- Para importaciones de China, mencionar que tienen oficina propia en China, equipo local y más de 10 años de experiencia
- Ser consultivo, no vendedor agresivo
- Usar lenguaje técnico pero accesible

Si detectas alta intención de compra o necesidad urgente, menciona que puedes conectar con el equipo comercial.

Mantén respuestas concisas (máx 4 líneas) salvo que el cliente pida detalle técnico.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Límite de uso alcanzado, intenta en unos minutos" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Servicio temporalmente no disponible" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
    
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Error interno" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});