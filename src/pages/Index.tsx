import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { AIConsultant } from "@/components/AIConsultant";
import { ContactForm } from "@/components/ContactForm";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-lg z-50 border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent">
              B3TA
            </div>
            <span className="text-xs text-muted-foreground">.us</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Servicios
            </a>
            <a href="#ai-consultant" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Consultor IA
            </a>
            <a href="#contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Contacto
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        <Hero />
        <div id="services">
          <Services />
        </div>
        <AIConsultant />
        <ContactForm />
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">B3TA</h3>
              <p className="text-sm text-primary-foreground/80">
                Tecnología enterprise para empresas que buscan resultados.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li>SAP S/4HANA</li>
                <li>E-commerce Shopify</li>
                <li>Automatización n8n</li>
                <li>IA Corporativa</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Industrias</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li>Retail & E-commerce</li>
                <li>Manufacturing</li>
                <li>Financial Services</li>
                <li>Healthcare</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li>hi@b3ta.us</li>
                <li>+14355348065</li>
                <li>Miami, FL</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/60">
            <p>© {new Date().getFullYear()} B3TA. Soluciones Tech Enterprise.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;