import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export const WhatsAppButton = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBottomBannerVisible, setIsBottomBannerVisible] = useState(false);
  const phoneNumber = "14355348065";
  const message = "Hola! Me interesa una consultoría con B3TA";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

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

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
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
        className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-[#25D366] hover:bg-[#20BD5A] shadow-2xl hover:scale-110 transition-all duration-300 p-0"
      >
        <MessageCircle className="h-7 w-7 md:h-8 md:w-8 text-white" />
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
