import { lazy, Suspense } from "react";
import { HeroAIDA } from "@/components/HeroAIDA";
import { ProblemSection } from "@/components/ProblemSection";
import { SolutionsByProblem } from "@/components/SolutionsByProblem";
import { SocialProofSimple } from "@/components/SocialProofSimple";
import { ProcessSimple } from "@/components/ProcessSimple";
import { StickyCTA } from "@/components/StickyCTA";
import { Footer } from "@/components/Footer";

// Lazy load non-critical components
const FAQ = lazy(() => import("@/components/FAQ").then(m => ({ default: m.FAQ })));
const AIConsultant = lazy(() => import("@/components/AIConsultant").then(m => ({ default: m.AIConsultant })));
const ContactForm = lazy(() => import("@/components/ContactForm").then(m => ({ default: m.ContactForm })));

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Header Simple */}
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-lg z-50 border-b border-border" role="banner">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold font-sans tracking-normal bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              B3TA
            </div>
            <span className="text-xs text-muted-foreground">.us</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8" role="navigation" aria-label="Navegación principal">
            <a href="#soluciones" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Soluciones
            </a>
            <a href="#proceso" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Proceso
            </a>
            <a href="#ai-consultant" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Consultor IA
            </a>
            <a href="#contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Contacto
            </a>
          </nav>

          {/* CTA Mobile-friendly */}
          <a 
            href="#ai-consultant"
            className="text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors py-2 px-4 rounded-lg"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('ai-consultant')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Consultor IA
          </a>
        </div>
      </header>

      {/* ESTRUCTURA AIDA */}
      <main className="pt-16">
        
        {/* A - ATENCIÓN: Hero con hook viral */}
        <HeroAIDA />
        
        {/* I - INTERÉS: Problemas que resolvemos */}
        <ProblemSection />
        
        {/* D - DESEO: Soluciones por problema */}
        <SolutionsByProblem />
        
        {/* PRUEBA SOCIAL: Testimonios + Stats */}
        <SocialProofSimple />
        
        {/* PROCESO: Cómo trabajamos */}
        <div id="proceso">
          <ProcessSimple />
        </div>
        
        {/* FAQ: Respuestas a objeciones */}
        <div id="faq">
          <Suspense fallback={<div className="py-20 animate-pulse" />}>
            <FAQ />
          </Suspense>
        </div>
        
        {/* A - ACCIÓN: Consultor IA (CTA principal) */}
        <div id="ai-consultant">
          <Suspense fallback={<div className="py-20 bg-gradient-to-b from-muted/30 to-background animate-pulse" />}>
            <AIConsultant />
          </Suspense>
        </div>
        
        {/* CONTACTO: Formulario final */}
        <div id="contact">
          <Suspense fallback={<div className="py-20 animate-pulse" />}>
            <ContactForm />
          </Suspense>
        </div>
        
        {/* Sticky CTA móvil */}
        <StickyCTA />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
