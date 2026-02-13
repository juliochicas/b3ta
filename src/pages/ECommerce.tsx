import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  CheckCircle2, 
  Phone,
  ShoppingCart,
  Smartphone,
  BarChart3,
  Zap,
  Globe,
  CreditCard,
  Package,
  TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { OptimizedImage } from "@/components/OptimizedImage";
import ecommerceHero from "@/assets/ecommerce-hero.jpg";
import { Footer } from "@/components/Footer";
import { useCurrencyConverter } from "@/hooks/useCurrencyConverter";

const ECommerce = () => {
  const navigate = useNavigate();
  const { formatPrice, loading } = useCurrencyConverter();

  const scrollToContact = () => {
    navigate('/#contact');
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const services = [
    {
      icon: ShoppingCart,
      title: "Tienda E-commerce Completa",
      description: "Shopify o Shopify Plus con diseño personalizado, productos ilimitados y checkout optimizado para conversión.",
      price: 500,
      features: [
        "Diseño responsive premium",
        "Productos y categorías ilimitados",
        "Checkout optimizado",
        "SEO on-page completo",
        "Integración con redes sociales",
        "Panel de administración intuitivo"
      ]
    },
    {
      icon: CreditCard,
      title: "Integraciones de Pago",
      description: "Conectamos múltiples gateways de pago: tarjetas, transferencias, wallets digitales y contra-entrega.",
      price: null,
      features: [
        "Stripe, PayPal, Mercado Pago",
        "Pagos locales LATAM",
        "Pago contra-entrega (COD)",
        "Meses sin intereses",
        "Detección de fraude",
        "Multi-moneda"
      ]
    },
    {
      icon: Package,
      title: "Logística & Fulfillment",
      description: "Integración con correos, cálculo automático de envíos, rastreo y gestión de devoluciones.",
      price: null,
      features: [
        "Fedex, DHL, UPS, correos locales",
        "Cálculo automático de tarifas",
        "Tracking en tiempo real",
        "Gestión de devoluciones",
        "Pickup en tienda",
        "Dropshipping"
      ]
    },
    {
      icon: TrendingUp,
      title: "Marketing & Growth Hacking",
      description: "Estrategias de crecimiento acelerado: paid ads, email marketing, retargeting y optimización de conversión.",
      price: 500,
      features: [
        "Campañas Google & Meta Ads",
        "Email marketing automatizado",
        "Retargeting & remarketing",
        "A/B testing continuo",
        "Optimización de conversión (CRO)",
        "Analytics y reportes"
      ]
    },
    {
      icon: BarChart3,
      title: "Analytics & Reporting",
      description: "Dashboards en tiempo real con métricas clave: ventas, conversión, AOV, LTV y análisis de cohortes.",
      price: null,
      features: [
        "Google Analytics 4",
        "Facebook Pixel avanzado",
        "Dashboards personalizados",
        "Análisis de cohortes",
        "Reportes automáticos",
        "Recomendaciones basadas en datos"
      ]
    },
    {
      icon: Smartphone,
      title: "App Móvil Nativa",
      description: "Apps iOS y Android nativas para experiencia de compra premium y notificaciones push.",
      price: null,
      features: [
        "iOS & Android nativo",
        "Notificaciones push",
        "Carrito persistente",
        "Login social",
        "Pasarela de pago nativa",
        "Publicación en stores"
      ]
    }
  ];

  const platforms = [
    {
      name: "Shopify",
      description: "Ideal para PYMEs. Rápido, confiable y escalable hasta $1M+ ventas/mes.",
      features: ["Setup rápido", "Sin mantenimiento", "99.99% uptime", "Apps ilimitadas"]
    },
    {
      name: "Shopify Plus",
      description: "Para enterprise. APIs avanzadas, checkout personalizado y soporte dedicado.",
      features: ["Checkout custom", "APIs ilimitadas", "Multi-store", "Soporte 24/7"]
    },
    {
      name: "Custom Development",
      description: "Soluciones a medida con React, Node.js y arquitectura serverless.",
      features: ["Totalmente custom", "Tu infraestructura", "Control total", "Escalabilidad ilimitada"]
    }
  ];

  const successMetrics = [
    { metric: "Conversión", target: "2-5%", description: "Visitantes que compran" },
    { metric: "AOV", target: "$50-200", description: "Valor promedio de orden" },
    { metric: "CAC", target: "< 30% AOV", description: "Costo de adquisición" },
    { metric: "ROAS", target: "> 3x", description: "Retorno sobre inversión publicitaria" }
  ];

  const faqs = [
    {
      q: "¿Cuánto cuesta lanzar una tienda online?",
      a: "Desde $500 USD para una tienda Shopify completa lista para vender. Incluye diseño, configuración de productos, integraciones de pago y capacitación. Costos adicionales son licencias Shopify ($29-299/mes) y pasarelas de pago (2-3% por transacción)."
    },
    {
      q: "¿Cuánto tiempo tarda el lanzamiento?",
      a: "Una tienda Shopify estándar: 2-4 semanas. Incluye diseño, carga de productos, configuración de pagos/envíos y pruebas. Proyectos enterprise con Shopify Plus pueden tomar 6-12 semanas dependiendo de customizaciones."
    },
    {
      q: "¿Necesito inventario físico para vender?",
      a: "No necesariamente. Puedes hacer dropshipping (vendedor envía directo), print-on-demand (productos bajo demanda) o modelo híbrido. Te ayudamos a conectar con proveedores confiables y automatizar el proceso."
    },
    {
      q: "¿Cómo recibo los pagos de mis clientes?",
      a: "Integramos Shopify Payments, Stripe, PayPal, Mercado Pago y métodos locales. Los pagos van directo a tu cuenta bancaria. Desembolsos diarios, semanales o mensuales según tu preferencia y gateway."
    },
    {
      q: "¿Qué pasa si no vendo?",
      a: "Te ayudamos con estrategias de marketing digital: Google Ads, Facebook/Instagram Ads, email marketing y optimización de conversión. Si tu producto tiene demanda, te enseñamos cómo llegar a tus clientes objetivo de forma rentable."
    },
    {
      q: "¿Puedo integrar con mi ERP/inventario actual?",
      a: "Sí, integramos tu tienda con ERP, WMS, sistemas de inventario, CRM y cualquier plataforma con API. Sincronización automática de stock, precios y órdenes para evitar sobreventa y agilizar fulfillment."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-lg z-50 border-b border-border" role="banner">
        <div className="container mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="text-2xl font-bold font-sans tracking-normal bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              B3TA
            </div>
            <span className="text-xs text-muted-foreground">.us</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-12" role="navigation">
            <a href="/#services" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Servicios</a>
            <a href="/#videos" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Videos</a>
            <a href="/#contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Contacto</a>
            <a href="/crm" className="text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors py-2 px-4 rounded-lg">CRM</a>
          </nav>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <OptimizedImage 
              src={ecommerceHero}
              alt="E-commerce y Marketing Digital - Tiendas online que venden"
              className="w-full h-full object-cover"
              priority={true}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/75" />
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-5xl mx-auto text-center space-y-8">
              <Badge className="bg-primary/20 backdrop-blur-sm text-foreground border-primary/30">
                🛒 Shopify, Shopify Plus & Marketing 360°
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
                E-commerce &
                <br />
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Growth Hacking
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-foreground/90 max-w-3xl mx-auto leading-relaxed">
                Tiendas online profesionales con Shopify/Shopify Plus, integradas con pagos, envíos y estrategias de marketing digital que maximizan conversión.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-6">
                <Button 
                  onClick={scrollToContact}
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_30px_rgba(0,150,255,0.4)] hover:shadow-[0_0_50px_rgba(0,150,255,0.6)] transition-all duration-300 text-lg px-10 py-7 w-full sm:w-auto"
                >
                  Lanzar Mi Tienda
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button 
                  onClick={() => window.open('https://wa.me/50241571786', '_blank')}
                  size="lg" 
                  variant="outline"
                  className="bg-background/80 hover:bg-background backdrop-blur-sm text-foreground border-border text-lg px-10 py-7 w-full sm:w-auto"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Consulta Gratuita
                </Button>
              </div>

              {/* Stats */}
              <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {[
                  { value: "2-4", label: "Semanas Lanzamiento" },
                  { value: "$500", label: "Inversión Inicial" },
                  { value: "24/7", label: "Ventas Automáticas" },
                  { value: "99.9%", label: "Uptime Garantizado" }
                ].map((stat) => (
                  <div key={stat.label} className="text-center bg-background/80 backdrop-blur-sm rounded-lg p-4 border border-border">
                    <div className="text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <Badge className="mb-4">Servicios E-commerce</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Todo para Vender Online
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                De la tienda al marketing, te acompañamos en cada paso
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {services.map((service) => (
                <Card key={service.title} className="p-8 hover:shadow-xl transition-all border-border hover:border-primary/50">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6">
                    <service.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground text-sm mb-6">{service.description}</p>
                  
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="pt-4 border-t border-border">
                    <span className="text-2xl font-bold text-primary">
                      {service.price === null ? "Cotizar" : loading ? "..." : `Desde ${formatPrice(service.price)}`}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Platforms */}
        <section className="py-28 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <Badge className="mb-4">Plataformas</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Elegimos la Mejor Tecnología
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {platforms.map((platform) => (
                <Card key={platform.name} className="p-8 hover:shadow-xl transition-all border-border hover:border-primary/50">
                  <Globe className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-2xl font-bold mb-3">{platform.name}</h3>
                  <p className="text-muted-foreground mb-6">{platform.description}</p>
                  
                  <ul className="space-y-2">
                    {platform.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Success Metrics */}
        <section className="py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <Badge className="mb-4">Métricas de Éxito</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                KPIs que Medimos
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {successMetrics.map((item) => (
                <Card key={item.metric} className="p-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{item.target}</div>
                  <div className="font-semibold mb-2">{item.metric}</div>
                  <div className="text-sm text-muted-foreground">{item.description}</div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-28 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <Badge className="mb-4">Preguntas Frecuentes</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Todo lo que Necesitas Saber
              </h2>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="p-8 hover:shadow-xl transition-all border-border">
                  <h3 className="text-xl font-bold mb-3 text-foreground">{faq.q}</h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-28 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <Badge className="bg-primary/20">¿Listo para Vender?</Badge>
              <h2 className="text-4xl md:text-6xl font-bold">
                Lanza Tu Tienda en
                <br />
                <span className="text-primary">2-4 Semanas</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Agenda una consulta y descubre cómo podemos ayudarte a vender más online
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 justify-center pt-6">
                <Button 
                  onClick={scrollToContact}
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-7"
                >
                  Empezar Ahora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ECommerce;
