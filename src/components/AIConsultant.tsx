import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Bot, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DOMPurify from 'dompurify';
import { z } from 'zod';

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Validación de inputs
const messageSchema = z.object({
  content: z.string()
    .trim()
    .min(1, "El mensaje no puede estar vacío")
    .max(2000, "El mensaje es demasiado largo (máx 2000 caracteres)")
    .refine(
      (val) => !/<script|javascript:|onerror=|onclick=/i.test(val),
      "El mensaje contiene contenido no permitido"
    )
});

// Rate limiting: máximo 5 mensajes por minuto
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 60000; // 1 minuto
const REQUEST_TIMEOUT = 30000; // 30 segundos

export const AIConsultant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "¡Hola! Soy el consultor virtual de B3TA. ¿En qué área necesitas ayuda? (SAP, E-commerce, Automatización, IA)"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [requestCount, setRequestCount] = useState<number[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Limpiar rate limit timestamps antiguos
  const cleanRateLimitTracking = () => {
    const now = Date.now();
    setRequestCount(prev => prev.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW));
  };

  // Verificar rate limit
  const isRateLimited = () => {
    cleanRateLimitTracking();
    return requestCount.length >= RATE_LIMIT_MAX;
  };

  // Sanitizar output de IA
  const sanitizeContent = (content: string): string => {
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
      ALLOWED_ATTR: []
    });
  };

  // Fetch con timeout y retry logic
  const fetchWithTimeout = async (url: string, options: RequestInit, timeout: number, retries = 2): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      // Si es 429 o 502/503, reintentar después de un delay
      if ((response.status === 429 || response.status >= 502) && retries > 0) {
        const delay = (3 - retries) * 2000; // 2s, 4s
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithTimeout(url, options, timeout, retries - 1);
      }
      
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('La solicitud tardó demasiado tiempo');
      }
      
      if (retries > 0) {
        const delay = (3 - retries) * 2000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithTimeout(url, options, timeout, retries - 1);
      }
      
      throw error;
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Rate limiting
    if (isRateLimited()) {
      toast({
        title: "Demasiadas solicitudes",
        description: "Por favor espera un momento antes de enviar otro mensaje.",
        variant: "destructive",
      });
      return;
    }

    const userMessage = input.trim();

    // Validación de input
    try {
      messageSchema.parse({ content: userMessage });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Mensaje inválido",
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);
    setRequestCount(prev => [...prev, Date.now()]);

    try {
      const response = await fetchWithTimeout(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/b3ta-ai-consultant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [...messages, { role: "user", content: userMessage }],
          }),
        },
        REQUEST_TIMEOUT
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Servicio temporalmente saturado. Intenta en unos minutos.");
        }
        if (response.status === 402) {
          throw new Error("Servicio temporalmente no disponible.");
        }
        throw new Error("Error al conectar con el consultor");
      }

      if (!response.body) {
        throw new Error("No se recibió respuesta del servidor");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";
      
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.trim() || line.startsWith(":")) continue;
          if (!line.startsWith("data: ")) continue;

          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              // Sanitizar cada chunk antes de agregarlo
              const sanitizedContent = sanitizeContent(content);
              assistantMessage += sanitizedContent;
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: "assistant",
                  content: assistantMessage
                };
                return newMessages;
              });
            }
          } catch (parseError) {
            // Ignorar errores de parsing de chunks incompletos
            continue;
          }
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Remover el mensaje del usuario si falló completamente
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="ai-consultant" className="py-28 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block p-3 bg-primary/10 rounded-2xl mb-4">
              <Bot className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Consultor IA de B3TA
            </h2>
            <p className="text-xl text-muted-foreground">
              Diagnóstico inteligente 24/7 powered by Lovable Cloud AI
            </p>
          </div>

          <Card className="p-8 shadow-xl border-border bg-card">
            <div className="h-[500px] overflow-y-auto mb-4 space-y-4 pr-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted p-4 rounded-2xl flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Consultando...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu consulta..."
                disabled={isLoading}
                className="flex-1"
                maxLength={2000}
              />
              <Button type="submit" disabled={isLoading || !input.trim()} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};