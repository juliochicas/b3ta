import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const WhatsAppButton = () => {
  const phoneNumber = "14355348065"; // Número sin + ni espacios
  const message = "Hola! Me interesa una consultoría con B3TA";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
    >
      <Button
        size="lg"
        className="h-16 w-16 rounded-full bg-[#25D366] hover:bg-[#20BD5A] shadow-2xl hover:scale-110 transition-all duration-300 p-0"
      >
        <MessageCircle className="h-8 w-8 text-white" />
      </Button>
      
      {/* Tooltip */}
      <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-foreground text-background px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium shadow-lg">
          Chatea con nosotros
        </div>
      </div>
    </a>
  );
};
