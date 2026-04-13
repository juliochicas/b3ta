import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CRM from "./pages/CRM";
import Quotations from "./pages/Quotations";
import Reports from "./pages/Reports";
import PublicReport from "./pages/PublicReport";
import Meetings from "./pages/Meetings";
import Email from "./pages/Email";
import ClientPage from "./pages/ClientPage";
import ClientPages from "./pages/ClientPages";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import PaginasWeb from "./pages/servicios/PaginasWeb";
import PaginasEconomicas from "./pages/servicios/PaginasEconomicas";
import SeoGuatemala from "./pages/servicios/SeoGuatemala";
import TiendaShopify from "./pages/servicios/TiendaShopify";
import IntegracionSapShopify from "./pages/servicios/IntegracionSapShopify";
import IntegracionOdoo from "./pages/servicios/IntegracionOdoo";
import AutomatizacionWhatsapp from "./pages/servicios/AutomatizacionWhatsapp";
import SistemasAMedida from "./pages/servicios/SistemasAMedida";
import CorreoEmpresarial from "./pages/servicios/CorreoEmpresarial";
import SapBusinessOne from "./pages/servicios/SapBusinessOne";
import { CountryPage } from "./pages/servicios/CountryPage";
import BlogIndex from "./pages/blog/BlogIndex";
import CuantoCuestaPaginaWeb from "./pages/blog/CuantoCuestaPaginaWeb";
import ComoSalirEnGoogle from "./pages/blog/ComoSalirEnGoogle";
import MejorSoftwareCotizaciones from "./pages/blog/MejorSoftwareCotizaciones";
import BotWhatsappNegocio from "./pages/blog/BotWhatsappNegocio";
import SapVsOdoo from "./pages/blog/SapVsOdoo";
import ShopifyVsWoocommerce from "./pages/blog/ShopifyVsWoocommerce";
import AutomatizarNegocio from "./pages/blog/AutomatizarNegocio";
import CorreoEmpresarialBarato from "./pages/blog/CorreoEmpresarialBarato";
import QueNecesitoParaMiWeb from "./pages/blog/QueNecesitoParaMiWeb";
import CuantoCobraProgramador from "./pages/blog/CuantoCobraProgramador";
import { countries } from "./pages/servicios/countries";

const queryClient = new QueryClient();

import Team from "./pages/Team";
import { ProtectedRoute } from "./components/ProtectedRoute";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/crm" element={<ProtectedRoute><CRM /></ProtectedRoute>} />
          <Route path="/quotations" element={<ProtectedRoute><Quotations /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/meetings" element={<ProtectedRoute><Meetings /></ProtectedRoute>} />
          <Route path="/email" element={<ProtectedRoute><Email /></ProtectedRoute>} />
          <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
          <Route path="/informe/:slug" element={<PublicReport />} />
          <Route path="/p/:slug" element={<ClientPage />} />
          <Route path="/client-pages" element={<ProtectedRoute><ClientPages /></ProtectedRoute>} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/cuanto-cuesta-pagina-web-guatemala" element={<CuantoCuestaPaginaWeb />} />
          <Route path="/blog/como-salir-en-google-guatemala" element={<ComoSalirEnGoogle />} />
          <Route path="/blog/mejor-software-cotizaciones" element={<MejorSoftwareCotizaciones />} />
          <Route path="/blog/como-crear-bot-whatsapp-negocio" element={<BotWhatsappNegocio />} />
          <Route path="/blog/sap-vs-odoo-cual-elegir" element={<SapVsOdoo />} />
          <Route path="/blog/shopify-vs-woocommerce-guatemala" element={<ShopifyVsWoocommerce />} />
          <Route path="/blog/automatizar-negocio-sin-programar" element={<AutomatizarNegocio />} />
          <Route path="/blog/correo-empresarial-barato" element={<CorreoEmpresarialBarato />} />
          <Route path="/blog/que-necesito-para-mi-pagina-web" element={<QueNecesitoParaMiWeb />} />
          <Route path="/blog/cuanto-cobra-programador-guatemala" element={<CuantoCobraProgramador />} />
          <Route path="/privacidad" element={<Privacy />} />
          <Route path="/terminos" element={<Terms />} />
          <Route path="/servicios/paginas-web-guatemala" element={<PaginasWeb />} />
          <Route path="/servicios/paginas-web-economicas" element={<PaginasEconomicas />} />
          <Route path="/servicios/seo-guatemala" element={<SeoGuatemala />} />
          <Route path="/servicios/tienda-shopify" element={<TiendaShopify />} />
          <Route path="/servicios/integracion-sap-shopify" element={<IntegracionSapShopify />} />
          <Route path="/servicios/integracion-odoo" element={<IntegracionOdoo />} />
          <Route path="/servicios/automatizacion-whatsapp" element={<AutomatizacionWhatsapp />} />
          <Route path="/servicios/sistemas-a-medida" element={<SistemasAMedida />} />
          <Route path="/servicios/correo-empresarial" element={<CorreoEmpresarial />} />
          <Route path="/servicios/sap-business-one" element={<SapBusinessOne />} />
          {countries.map((c) => (
            <Route key={c.slug} path={`/servicios/${c.slug}`} element={
              <CountryPage country={c.country} countryCode={c.code} slug={c.slug} currency={c.currency} city={c.city} lang={c.lang} region={c.region} localContent={c.localContent} />
            } />
          ))}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
