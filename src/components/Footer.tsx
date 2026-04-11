export const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-background via-muted/50 to-background border-t border-border py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-5 gap-12 mb-16">
          <div className="md:col-span-2">
            <h3 className="text-3xl font-black font-sans tracking-tighter mb-4 text-foreground">
              B3TA
            </h3>
            <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
              Consultoria tecnologica en Guatemala. Integramos SAP, Shopify, WhatsApp y sistemas a medida para empresas en LATAM.
            </p>
            <div className="flex space-x-4">
              <a href="https://wa.me/14355348065" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-muted hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-all duration-300">
                <span className="text-sm font-semibold">WA</span>
              </a>
              <a href="mailto:hi@b3ta.us" className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300">
                <span className="text-sm font-semibold">@</span>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-lg text-foreground">Soluciones Core</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><a href="/#precios" className="hover:text-primary transition-colors">Flujos Inteligentes IA</a></li>
              <li><a href="/#precios" className="hover:text-primary transition-colors">Implementación SAP B1</a></li>
              <li><a href="/#precios" className="hover:text-primary transition-colors">Modularis.pro ERP/CRM</a></li>
              <li><a href="/#precios" className="hover:text-primary transition-colors">Desarrollo Shopify Plus</a></li>
              <li><a href="/#precios" className="hover:text-primary transition-colors">Puntos de Venta (POS)</a></li>
              <li><a href="/#precios" className="hover:text-primary transition-colors">SEO Automático</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-lg text-foreground">Agencia</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><a href="/#proceso" className="hover:text-primary transition-colors">Nuestra Metodología</a></li>
              <li><a href="/#casos" className="hover:text-primary transition-colors">Casos de Éxito Reales</a></li>
              <li><a href="/#problema" className="hover:text-primary transition-colors">Auditoría Operativa</a></li>
              <li><a href="/#contact" className="hover:text-primary transition-colors">Diagnóstico Gratuito</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-lg text-foreground">Clientes & Tech</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><a href="/auth" className="hover:text-primary transition-colors text-secondary font-medium">Acceso Clientes (CRM)</a></li>
              <li><a href="https://supabase.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Infraestructura Real-time</a></li>
              <li><a href="https://n8n.io" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Motor n8n Enterprise</a></li>
              <li><a href="/#contact" className="hover:text-primary transition-colors">Contacto / Soporte</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} B3TA. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="mailto:hi@b3ta.us" className="hover:text-primary transition-colors">hi@b3ta.us</a>
              <a href="https://wa.me/14355348065" className="hover:text-primary transition-colors">+1 (435) 534-8065</a>
              <span>🇬🇹 Guatemala, LATAM</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
