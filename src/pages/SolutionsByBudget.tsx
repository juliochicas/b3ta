import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  CheckCircle2, 
  Phone,
  Sparkles,
  TrendingUp,
  Building2,
  DollarSign,
  Users,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { OptimizedImage } from "@/components/OptimizedImage";
import solutionsHero from "@/assets/solutions-hero.jpg";
import { Footer } from "@/components/Footer";
import { useCurrencyConverter } from "@/hooks/useCurrencyConverter";

const SolutionsByBudget = () => {
  const navigate = useNavigate();
  const { formatPrice, loading } = useCurrencyConverter();

  const scrollToContact = () => {
    navigate('/#contact');
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const solutions = [
    {
      icon: Sparkles,
      tier: "Emprendedor",
      subtitle: "Para Startups y Negocios en Inicio",
      budget: "< $1,000 USD",
      description: "Inicia tu presencia digital con soluciones rápidas, efectivas y de bajo costo. Ideal para emprendedores que necesitan validar su idea o comenzar a vender online.",
      features: [
        "Landing Page profesional",
        "Configuración básica de Google Analytics",
        "Formulario de contacto optimizado",
        "Diseño responsive mobile-first",
        "SEO básico on-page",
        "Entrega en 5-7 días"
      ],
      services: [
        { name: "Landing Page Básica", price: 100 },
        { name: "Sitio Web 5 páginas", price: 300 },
        { name: "Automatización con n8n", price: 500 }
      ],
      color: "from-green-500/20 to-emerald-500/20",
      borderColor: "border-green-500/50"
    },
    {
      icon: TrendingUp,
      tier: "Crecimiento",
      subtitle: "Para PYMEs en Expansión",
      budget: "$1,000 - $10,000 USD",
      description: "Escala tu negocio con soluciones robustas que automatizan procesos y multiplican tu alcance. Para empresas que ya facturan y buscan crecer rápido.",
      features: [
        "E-commerce completo en Shopify",
        "Integraciones de pagos y envíos",
        "Marketing automation avanzado",
        "CRM integrado con WhatsApp",
        "Dashboards y reportes en tiempo real",
        "Soporte 24/7 durante implementación"
      ],
      services: [
        { name: "Tienda E-commerce Shopify", price: 500 },
        { name: "MVP o App Web", price: 500 },
        { name: "Automatización Completa", price: 500 },
        { name: "IA Corporativa + RAG", price: 500 }
      ],
      color: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/50",
      popular: true
    },
    {
      icon: Building2,
      tier: "Enterprise",
      subtitle: "Para Corporaciones y Grandes Empresas",
      budget: "> $10,000 USD",
      description: "Transformación digital completa con ERP enterprise, integración multicanal y consultoría estratégica. Para empresas que operan a escala.",
      features: [
        "Plataformas SaaS a medida",
        "IA Corporativa avanzada",
        "Integración con sistemas legacy",
        "Consultoría estratégica dedicada",
        "Soporte y mantenimiento 24/7/365",
        "SLA garantizado 99.9%"
      ],
      services: [
        { name: "Plataforma SaaS Custom", price: 15000 },
        { name: "IA Corporativa", price: null },
        { name: "Integración Multi-sistema", price: null },
        { name: "Consultoría Estratégica", price: null }
      ],
      color: "from-purple-500/20 to-indigo-500/20",
      borderColor: "border-purple-500/50"
    }
  ];

  const comparisonFeatures = [
    { feature: "Tiempo de Implementación", starter: "5-7 días", growth: "4-8 semanas", enterprise: "3-6 meses" },
    { feature: "Soporte Incluido", starter: "Email 48h", growth: "Chat + Email 24h", enterprise: "24/7/365 + Dedicado" },
    { feature: "Escalabilidad", starter: "Básica", growth: "Alta", enterprise: "Ilimitada" },
    { feature: "Personalización", starter: "Limitada", growth: "Moderada", enterprise: "Total" },
    { feature: "Integraciones", starter: "1-2", growth: "5-10", enterprise: "Ilimitadas" }
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
              src={solutionsHero}
              alt="Soluciones por Presupuesto - Transformación digital para cada etapa"
              className="w-full h-full object-cover"
              priority={true}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/75" />
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-5xl mx-auto text-center space-y-8">
              <Badge className="bg-primary/20 backdrop-blur-sm text-foreground border-primary/30">
                💼 Soluciones para Cada Presupuesto y Etapa de Crecimiento
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
                Soluciones Escalables
                <br />
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Para Cada Etapa
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-foreground/90 max-w-3xl mx-auto leading-relaxed">
                Desde $100 hasta implementaciones enterprise. La tecnología correcta para tu momento de crecimiento, sin pagar de más ni quedarte corto.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-6">
                <Button 
                  onClick={scrollToContact}
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_30px_rgba(0,150,255,0.4)] hover:shadow-[0_0_50px_rgba(0,150,255,0.6)] transition-all duration-300 text-lg px-10 py-7 w-full sm:w-auto"
                >
                  Encontrar Mi Solución
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
            </div>
          </div>
        </section>

        {/* Solutions by Tier */}
        <section className="py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <Badge className="mb-4">3 Niveles de Inversión</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Elige Tu Nivel de Inversión
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Soluciones diseñadas específicamente para tu presupuesto y objetivos de crecimiento
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {solutions.map((solution) => (
                <Card 
                  key={solution.tier}
                  className={`p-8 relative ${solution.popular ? 'border-2 border-primary shadow-2xl scale-105' : 'border-border hover:border-primary/50'} transition-all`}
                >
                  {solution.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent">
                      Más Popular
                    </Badge>
                  )}
                  
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${solution.color} flex items-center justify-center mb-6`}>
                    <solution.icon className="h-8 w-8 text-primary" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">{solution.tier}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{solution.subtitle}</p>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <span className="text-3xl font-bold text-primary">{solution.budget}</span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-8">{solution.description}</p>
                  
                  <div className="space-y-4 mb-8">
                    <h4 className="font-semibold text-sm">Incluye:</h4>
                    {solution.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-3 mb-8 pt-6 border-t border-border">
                    <h4 className="font-semibold text-sm">Servicios Disponibles:</h4>
                    {solution.services.map((service) => (
                      <div key={service.name} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{service.name}</span>
                        <span className="font-semibold">
                          {service.price === null ? "Cotizar" : loading ? "..." : `Desde ${formatPrice(service.price)}`}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={scrollToContact}
                    className={`w-full ${solution.popular ? 'bg-primary hover:bg-primary/90' : 'bg-primary/10 hover:bg-primary/20 text-primary'}`}
                  >
                    Cotizar Ahora
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-28 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <Badge className="mb-4">Comparación</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Compara Niveles
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Encuentra la combinación perfecta de características y presupuesto
              </p>
            </div>

            <Card className="max-w-6xl mx-auto overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-4 text-left font-bold">Característica</th>
                      <th className="p-4 text-center font-bold">Emprendedor</th>
                      <th className="p-4 text-center font-bold">Crecimiento</th>
                      <th className="p-4 text-center font-bold">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((row, index) => (
                      <tr key={row.feature} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                        <td className="p-4 font-medium">{row.feature}</td>
                        <td className="p-4 text-center text-muted-foreground">{row.starter}</td>
                        <td className="p-4 text-center text-muted-foreground">{row.growth}</td>
                        <td className="p-4 text-center text-muted-foreground">{row.enterprise}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <Badge className="mb-4">Por Qué B3TA</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Transparencia y Resultados
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="p-8 text-center">
                <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Sin Costos Ocultos</h3>
                <p className="text-sm text-muted-foreground">Precio transparente desde el día 1. Lo que ves es lo que pagas.</p>
              </Card>
              
              <Card className="p-8 text-center">
                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Implementación Rápida</h3>
                <p className="text-sm text-muted-foreground">De la cotización a producción en semanas, no meses.</p>
              </Card>
              
              <Card className="p-8 text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Soporte Real</h3>
                <p className="text-sm text-muted-foreground">Equipo dedicado que responde rápido y resuelve problemas.</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-28 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <Badge className="bg-primary/20">¿No estás seguro?</Badge>
              <h2 className="text-4xl md:text-6xl font-bold">
                Agenda una Consulta
                <br />
                <span className="text-primary">100% Gratuita</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Te ayudamos a encontrar la solución perfecta para tu presupuesto y objetivos. Sin compromiso.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 justify-center pt-6">
                <Button 
                  onClick={scrollToContact}
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-7"
                >
                  Agendar Consulta Ahora
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

export default SolutionsByBudget;
