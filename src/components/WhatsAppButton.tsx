import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef, useCallback } from "react";

export const WhatsAppButton = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBottomBannerVisible, setIsBottomBannerVisible] = useState(false);
  const phoneNumber = "50241571786"; // Guatemala
  const message = "Hola! Me interesa saber más sobre los servicios de B3TA";
  const ticking = useRef(false);
  const windowHeightRef = useRef(0);

  const updateScrollState = useCallback(() => {
    const scrollY = window.scrollY;
    setIsScrolled(scrollY > 200);
    setIsBottomBannerVisible(scrollY > windowHeightRef.current * 1.5);
    ticking.current = false;
  }, []);

  useEffect(() => {
    // Cache window height on mount
    windowHeightRef.current = window.innerHeight;

    const handleResize = () => {
      windowHeightRef.current = window.innerHeight;
    };

    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(updateScrollState);
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [updateScrollState]);

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
