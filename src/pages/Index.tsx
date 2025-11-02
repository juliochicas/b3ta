import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Benefits } from "@/components/Benefits";
import { CaseStudies } from "@/components/CaseStudies";
import { Industries } from "@/components/Industries";
import { SolutionsByBudget } from "@/components/SolutionsByBudget";
import { PartnersSection } from "@/components/PartnersSection";
import { ProcessSteps } from "@/components/ProcessSteps";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Testimonials } from "@/components/Testimonials";
import { VideoSection } from "@/components/VideoSection";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { TrustBadges } from "@/components/TrustBadges";
import { UrgencyBanner } from "@/components/UrgencyBanner";
import { AIConsultant } from "@/components/AIConsultant";
import { ContactForm } from "@/components/ContactForm";
import { StickyCTA } from "@/components/StickyCTA";

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
            <a href="#services" className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2 px-3" aria-label="Ir a servicios">
              Servicios
            </a>
            <a href="#soluciones" className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2 px-3" aria-label="Ir a soluciones por presupuesto">
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

      {/* Main Content - Flujo Narrativo Optimizado */}
      <main className="pt-16">
        {/* 1. GANCHO INICIAL - Propuesta de valor y credibilidad */}
        <Hero />
        <TrustBadges />
        
        {/* 2. OFERTA - Qué hacemos y para quién */}
        <div id="services">
          <Services />
        </div>
        <div id="soluciones">
          <SolutionsByBudget />
        </div>
        
        {/* 3. VALOR - Por qué somos diferentes */}
        <Benefits />
        
        {/* 4. PRUEBA SOCIAL - Casos de éxito e industrias */}
        <div id="casos">
          <CaseStudies />
        </div>
        <div id="industrias">
          <Industries />
        </div>
        
        {/* 5. PROCESO - Cómo trabajamos */}
        <ProcessSteps />
        <BeforeAfter />
        
        {/* 6. CREDIBILIDAD - Partners y testimonios */}
        <PartnersSection />
        <Testimonials />
        
        {/* 7. CONTENIDO EDUCATIVO - Videos */}
        <div id="videos">
          <VideoSection />
        </div>
        
        {/* 8. PRECIOS - Planes claros */}
        <Pricing />
        
        {/* 9. RESPUESTAS - FAQ */}
        <div id="faq">
          <FAQ />
        </div>
        
        {/* 10. HERRAMIENTA INTERACTIVA - Consultor IA */}
        <div id="ai-consultant">
          <AIConsultant />
        </div>
        
        {/* 11. URGENCIA Y LLAMADO A LA ACCIÓN FINAL */}
        <UrgencyBanner />
        <div id="contact">
          <ContactForm />
        </div>
        
        {/* Elementos flotantes */}
        <StickyCTA />
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-5 gap-12 mb-16">
            <div className="md:col-span-2">
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                B3TA
              </h3>
              <p className="text-slate-400 mb-6 text-lg leading-relaxed">
                Transformación Digital Integral para LATAM. De SAP a Shopify, de China a tu Almacén. Consultoría + Tecnología + Crecimiento.
              </p>
              <div className="flex space-x-4">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-cyan-500 flex items-center justify-center transition-all duration-300">
                  <span className="text-sm">in</span>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-cyan-500 flex items-center justify-center transition-all duration-300">
                  <span className="text-sm">𝕏</span>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-cyan-500 flex items-center justify-center transition-all duration-300">
                  <span className="text-sm">▶</span>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-lg">Servicios</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#services" className="hover:text-cyan-400 transition-colors">SAP Consulting</a></li>
                <li><a href="#services" className="hover:text-cyan-400 transition-colors">E-commerce & Marketing</a></li>
                <li><a href="#services" className="hover:text-cyan-400 transition-colors">Automatización</a></li>
                <li><a href="#services" className="hover:text-cyan-400 transition-colors">IA Corporativa</a></li>
                <li><a href="#services" className="hover:text-cyan-400 transition-colors">Importaciones China</a></li>
                <li><a href="#services" className="hover:text-cyan-400 transition-colors">Desarrollo Web</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-lg">Industrias</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#industrias" className="hover:text-cyan-400 transition-colors">Manufactura</a></li>
                <li><a href="#industrias" className="hover:text-cyan-400 transition-colors">Retail & E-commerce</a></li>
                <li><a href="#industrias" className="hover:text-cyan-400 transition-colors">Distribución</a></li>
                <li><a href="#industrias" className="hover:text-cyan-400 transition-colors">Construcción</a></li>
                <li><a href="#industrias" className="hover:text-cyan-400 transition-colors">Salud</a></li>
                <li><a href="#industrias" className="hover:text-cyan-400 transition-colors">Educación</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-lg">Recursos</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#casos" className="hover:text-cyan-400 transition-colors">Casos de Éxito</a></li>
                <li><a href="#videos" className="hover:text-cyan-400 transition-colors">Videos</a></li>
                <li><a href="/crm" className="hover:text-cyan-400 transition-colors">Portal CRM</a></li>
                <li><a href="#ai-consultant" className="hover:text-cyan-400 transition-colors">Consultor IA</a></li>
                <li><a href="#faq" className="hover:text-cyan-400 transition-colors">FAQ</a></li>
                <li><a href="#contact" className="hover:text-cyan-400 transition-colors">Contacto</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-slate-400 text-sm">
                &copy; {new Date().getFullYear()} B3TA. Todos los derechos reservados.
              </p>
              <div className="flex items-center gap-6 text-sm text-slate-400">
                <a href="#" className="hover:text-cyan-400 transition-colors">Política de Privacidad</a>
                <a href="#" className="hover:text-cyan-400 transition-colors">Términos de Servicio</a>
                <span>🇬🇹 Guatemala, LATAM</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;