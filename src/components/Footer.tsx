export const Footer = () => {
  return (
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
            <h4 className="font-bold mb-4 text-lg">Soluciones</h4>
            <ul className="space-y-3 text-slate-400">
              <li><a href="/soluciones-por-presupuesto" className="hover:text-cyan-400 transition-colors">Emprendedor</a></li>
              <li><a href="/soluciones-por-presupuesto" className="hover:text-cyan-400 transition-colors">Crecimiento</a></li>
              <li><a href="/soluciones-por-presupuesto" className="hover:text-cyan-400 transition-colors">Enterprise</a></li>
              <li><a href="/sap-business-one" className="hover:text-cyan-400 transition-colors">SAP Business One</a></li>
              <li><a href="/importaciones-china" className="hover:text-cyan-400 transition-colors">Importaciones China</a></li>
              <li><a href="/e-commerce" className="hover:text-cyan-400 transition-colors">E-commerce</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-lg">Industrias</h4>
            <ul className="space-y-3 text-slate-400">
              <li><a href="/industrias#manufactura" className="hover:text-cyan-400 transition-colors">Manufactura</a></li>
              <li><a href="/industrias#retail" className="hover:text-cyan-400 transition-colors">Retail & E-commerce</a></li>
              <li><a href="/industrias#distribucion" className="hover:text-cyan-400 transition-colors">Distribución</a></li>
              <li><a href="/industrias#construccion" className="hover:text-cyan-400 transition-colors">Construcción</a></li>
              <li><a href="/industrias#salud" className="hover:text-cyan-400 transition-colors">Salud</a></li>
              <li><a href="/industrias#educacion" className="hover:text-cyan-400 transition-colors">Educación</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-lg">Recursos</h4>
            <ul className="space-y-3 text-slate-400">
              <li><a href="/#casos" className="hover:text-cyan-400 transition-colors">Casos de Éxito</a></li>
              <li><a href="/#videos" className="hover:text-cyan-400 transition-colors">Videos</a></li>
              <li><a href="/crm" className="hover:text-cyan-400 transition-colors">Portal CRM</a></li>
              <li><a href="/#ai-consultant" className="hover:text-cyan-400 transition-colors">Consultor IA</a></li>
              <li><a href="/#faq" className="hover:text-cyan-400 transition-colors">FAQ</a></li>
              <li><a href="/#contact" className="hover:text-cyan-400 transition-colors">Contacto</a></li>
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
  );
};
