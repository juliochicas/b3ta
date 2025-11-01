import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export const WhatsAppButton = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBottomBannerVisible, setIsBottomBannerVisible] = useState(false);
  const phoneNumber = "14355348065";
  const message = "Hola, me interesa una consultoria con B3TA";

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 200;
      const nearBottom = window.scrollY > window.innerHeight * 1.5;
      
      setIsScrolled(scrolled);
      setIsBottomBannerVisible(nearBottom);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <a
      href="#"
      onClick={handleClick}
      className={`fixed left-6 z-40 group transition-all duration-500 ${
        isScrolled && !isBottomBannerVisible 
          ? 'bottom-6 opacity-100' 
          : isScrolled && isBottomBannerVisible
          ? 'bottom-24 opacity-100'
          : 'bottom-[-100px] opacity-0'
      }`}
    >
      <Button
        size="lg"
        className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-whatsapp hover:bg-whatsapp-hover shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 p-0 animate-pulse"
      >
        <MessageCircle className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />
      </Button>
      
      {/* Tooltip */}
      <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        <div className="bg-foreground text-background px-4 py-2 rounded-lg text-sm font-medium shadow-lg">
          Chatea con nosotros
        </div>
      </div>
    </a>
  );
};
