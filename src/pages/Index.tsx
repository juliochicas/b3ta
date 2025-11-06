import { lazy, Suspense } from "react";
import { Hero } from "@/components/Hero";
import { SolutionsByBudget } from "@/components/SolutionsByBudget";
import { StrategicCTA } from "@/components/StrategicCTA";
import { Benefits } from "@/components/Benefits";
import { TrustBadges } from "@/components/TrustBadges";
import { StickyCTA } from "@/components/StickyCTA";
import { LazySection } from "@/components/LazySection";
import { Footer } from "@/components/Footer";

// Lazy load non-critical components for better performance
const CaseStudiesIndustries = lazy(() => import("@/components/CaseStudiesIndustries").then(m => ({ default: m.CaseStudiesIndustries })));
const ProcessSteps = lazy(() => import("@/components/ProcessSteps").then(m => ({ default: m.ProcessSteps })));
const PartnersSection = lazy(() => import("@/components/PartnersSection").then(m => ({ default: m.PartnersSection })));
const Testimonials = lazy(() => import("@/components/Testimonials").then(m => ({ default: m.Testimonials })));
const VideoSection = lazy(() => import("@/components/VideoSection").then(m => ({ default: m.VideoSection })));
const FAQ = lazy(() => import("@/components/FAQ").then(m => ({ default: m.FAQ })));
const UrgencyBanner = lazy(() => import("@/components/UrgencyBanner").then(m => ({ default: m.UrgencyBanner })));
const AIConsultant = lazy(() => import("@/components/AIConsultant").then(m => ({ default: m.AIConsultant })));
const ContactForm = lazy(() => import("@/components/ContactForm").then(m => ({ default: m.ContactForm })));

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-lg z-50 border-b border-border" role="banner">
        <div className="container mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent">
              B3TA
            </div>
            <span className="text-xs text-muted-foreground">.us</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-12" role="navigation" aria-label="Navegación principal">
            <a href="#soluciones" className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2 px-3" aria-label="Ir a soluciones">
              Soluciones
            </a>
            <a href="#videos" className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2 px-3" aria-label="Ir a videos">
              Videos
            </a>
            <a href="#ai-consultant" className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2 px-3" aria-label="Ir a consultor IA">
              Consultor IA
            </a>
            <a href="#contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2 px-3" aria-label="Ir a contacto">
              Contacto
            </a>
            <a href="/crm" className="text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors py-2 px-4 rounded-lg" aria-label="Acceder al CRM">
              CRM
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content - Arquitectura Optimizada para Conversión */}
      <main className="pt-16">
        {/* 1. GANCHO INICIAL - Hero + Credibilidad */}
        <Hero />
        <TrustBadges />
        
        {/* 2. OFERTA CLARA - Soluciones por Presupuesto */}
        <div id="soluciones">
          <SolutionsByBudget />
        </div>
        
        {/* 🎯 CTA #1 - Después de mostrar soluciones */}
        <StrategicCTA 
          variant="primary"
          title="¿Listo para Transformar tu Negocio?"
          description="Agenda una consultoría gratuita y descubre cómo podemos ayudarte"
          ctaText="Agendar Consultoría Gratuita"
          icon="calendar"
        />
        
        {/* 3. VALOR - Por qué somos diferentes */}
        <Benefits />
        
        {/* 🎯 CTA #2 - Después de valor */}
        <StrategicCTA 
          variant="secondary"
          title="Hablemos de Tu Proyecto"
          description="Sin compromiso, sin letra pequeña. Solo soluciones reales."
          ctaText="Contactar Ahora"
          icon="message"
        />
        
        {/* 4. PRUEBA SOCIAL - Casos + Industrias fusionados */}
        <div id="casos">
          <Suspense fallback={<div className="py-28 bg-muted/30 animate-pulse" />}>
            <CaseStudiesIndustries />
          </Suspense>
        </div>
        
        {/* 5. PROCESO - Cómo trabajamos */}
        <Suspense fallback={<div className="py-28 animate-pulse" />}>
          <ProcessSteps />
        </Suspense>
        
        {/* 🎯 CTA #3 - Después del proceso */}
        <StrategicCTA 
          variant="consultation"
          title="Empieza Tu Transformación Digital Hoy"
          description="El primer paso es una conversación. Sin presión, sin ventas forzadas."
          ctaText="Comenzar Ahora"
          icon="arrow"
        />
        
        {/* 6. CREDIBILIDAD - Partners y Testimonios */}
        <LazySection fallback={<div className="py-28 bg-muted/30" />}>
          <Suspense fallback={<div className="py-20 animate-pulse" />}>
            <PartnersSection />
          </Suspense>
        </LazySection>
        <LazySection fallback={<div className="py-28" />}>
          <Suspense fallback={<div className="py-20 animate-pulse" />}>
            <Testimonials />
          </Suspense>
        </LazySection>
        
        {/* 7. CONTENIDO EDUCATIVO - Videos */}
        <div id="videos">
          <LazySection fallback={<div className="py-28 bg-muted/30" />}>
            <Suspense fallback={<div className="py-20 animate-pulse" />}>
              <VideoSection />
            </Suspense>
          </LazySection>
        </div>
        
        {/* 8. RESPUESTAS - FAQ */}
        <div id="faq">
          <LazySection fallback={<div className="py-28" />}>
            <Suspense fallback={<div className="py-20 animate-pulse" />}>
              <FAQ />
            </Suspense>
          </LazySection>
        </div>
        
        {/* 9. HERRAMIENTA INTERACTIVA - Consultor IA */}
        <div id="ai-consultant">
          <LazySection fallback={<div className="py-28 bg-gradient-to-b from-muted/30 to-background" />}>
            <Suspense fallback={<div className="py-20 animate-pulse" />}>
              <AIConsultant />
            </Suspense>
          </LazySection>
        </div>
        
        {/* 10. CIERRE CON URGENCIA */}
        <Suspense fallback={<div className="py-16 animate-pulse" />}>
          <UrgencyBanner />
        </Suspense>
        <div id="contact">
          <Suspense fallback={<div className="py-28 animate-pulse" />}>
            <ContactForm />
          </Suspense>
        </div>
        
        {/* Elementos flotantes */}
        <StickyCTA />
      </main>

      <Footer />
    </div>
  );
};

export default Index;