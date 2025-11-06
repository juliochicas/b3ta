import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  CheckCircle2, 
  Phone,
  Factory,
  ShoppingBag,
  Truck,
  HardHat,
  Heart,
  GraduationCap,
  BarChart3,
  Zap,
  Shield,
  TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { OptimizedImage } from "@/components/OptimizedImage";
import industriesHero from "@/assets/industries-hero.jpg";
import { Footer } from "@/components/Footer";

const Industries = () => {
  const navigate = useNavigate();

  const scrollToContact = () => {
    navigate('/#contact');
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const scrollToIndustry = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const industries = [
    {
      id: "manufactura",
      icon: Factory,
      name: "Manufactura",
      tagline: "Produce Más, Desperdicia Menos",
      description: "Optimiza tu producción con ERP integrado, control de inventarios en tiempo real y trazabilidad completa desde materia prima hasta producto terminado.",
      challenges: [
        "Desperdicios de material y mermas no controladas",
        "Descoordinación entre producción, compras y ventas",
        "Falta de trazabilidad por lote/serie",
        "Costeo impreciso y márgenes invisibles"
      ],
      solutions: [
        {
          title: "SAP Business One para Manufactura",
          description: "MRP, órdenes de producción, BOMs multinivel, control de calidad y costeo estándar vs real integrado."
        },
        {
          title: "Sistema MES + IoT",
          description: "Monitoreo en tiempo real de líneas de producción, OEE, alarmas predictivas y mantenimiento preventivo."
        },
        {
          title: "Automatización de Reportes",
          description: "Dashboards de producción, desperdicios, eficiencia de líneas y análisis de causas raíz automáticos."
        }
      ],
      metrics: [
        { label: "Reducción Desperdicio", value: "30%" },
        { label: "Mejora OEE", value: "25%" },
        { label: "Visibilidad Real-Time", value: "100%" }
      ],
      color: "from-orange-500/20 to-red-500/20"
    },
    {
      id: "retail",
      icon: ShoppingBag,
      name: "Retail & E-commerce",
      tagline: "Vende Más, Online y Offline",
      description: "Unifica ventas en tienda física, online y marketplaces. Inventarios sincronizados, programas de lealtad y análisis predictivo de demanda.",
      challenges: [
        "Inventarios desincronizados entre canales",
        "Imposible vender en múltiples marketplaces",
        "Sin datos de comportamiento del cliente",
        "Promociones y descuentos manuales"
      ],
      solutions: [
        {
          title: "Omnichannel Integrado",
          description: "POS, e-commerce, marketplaces y redes sociales sincronizados en un solo sistema de inventarios y ventas."
        },
        {
          title: "CRM + Loyalty Programs",
          description: "Base de clientes unificada, programas de puntos, campañas segmentadas y análisis de lifetime value."
        },
        {
          title: "Forecasting con IA",
          description: "Predicción de demanda por producto/tienda, recomendaciones de reorden y optimización de compras."
        }
      ],
      metrics: [
        { label: "Aumento Ventas Online", value: "150%" },
        { label: "Reducción Stock-outs", value: "40%" },
        { label: "Mejora Retención", value: "35%" }
      ],
      color: "from-pink-500/20 to-purple-500/20"
    },
    {
      id: "distribucion",
      icon: Truck,
      name: "Distribución",
      tagline: "Entrega Más Rápido, Gasta Menos",
      description: "Optimiza rutas de reparto, reduce costos de última milla y mejora tiempos de entrega con tecnología de punta en logística.",
      challenges: [
        "Rutas de reparto ineficientes y costosas",
        "Falta de visibilidad del camión en ruta",
        "Devoluciones y rechazos sin control",
        "Inventarios en tránsito invisibles"
      ],
      solutions: [
        {
          title: "WMS + Route Optimization",
          description: "Gestión de almacén automatizada, picking/packing optimizado y rutas dinámicas con GPS en tiempo real."
        },
        {
          title: "TMS Integrado",
          description: "Control de flota, asignación inteligente de pedidos, tracking para clientes y gestión de devoluciones."
        },
        {
          title: "Portal de Clientes B2B",
          description: "Pedidos online 24/7, consulta de estados, facturas electrónicas y reportes de compras automáticos."
        }
      ],
      metrics: [
        { label: "Reducción Costo Entrega", value: "28%" },
        { label: "Mejora Entregas On-Time", value: "45%" },
        { label: "Reducción KM Recorridos", value: "22%" }
      ],
      color: "from-blue-500/20 to-cyan-500/20"
    },
    {
      id: "construccion",
      icon: HardHat,
      name: "Construcción",
      tagline: "Proyectos On-Time, On-Budget",
      description: "Gestiona múltiples proyectos simultáneamente con control de costos, avances, subcontratistas y flujo de caja en tiempo real.",
      challenges: [
        "Sobrecostos y desviaciones presupuestarias",
        "Falta de control sobre subcontratistas",
        "Materiales no llegan cuando se necesitan",
        "Cash flow impredecible"
      ],
      solutions: [
        {
          title: "Project Management ERP",
          description: "SAP B1 con módulo de proyectos: presupuestos vs reales, órdenes de cambio, billing milestones y reportes por obra."
        },
        {
          title: "Gestión de Subcontratistas",
          description: "Portal colaborativo, control de avances, retenciones, pagos escalonados y certificaciones digitales."
        },
        {
          title: "Procurement Inteligente",
          description: "Compras centralizadas, comparación de cotizaciones, aprobaciones workflow y just-in-time delivery."
        }
      ],
      metrics: [
        { label: "Reducción Sobrecostos", value: "35%" },
        { label: "Mejora Cash Flow", value: "40%" },
        { label: "Proyectos On-Time", value: "+50%" }
      ],
      color: "from-yellow-500/20 to-orange-500/20"
    },
    {
      id: "salud",
      icon: Heart,
      name: "Salud",
      tagline: "Mejor Atención, Menos Carga Admin",
      description: "Software médico que reduce carga administrativa, mejora experiencia del paciente y cumple normativas de privacidad y facturación.",
      challenges: [
        "Agendas manuales y citas no optimizadas",
        "Expedientes en papel o PDFs sin integración",
        "Facturación a aseguradoras lenta y errores",
        "Incumplimiento HIPAA o normas locales"
      ],
      solutions: [
        {
          title: "Sistema de Gestión Hospitalaria",
          description: "Agenda inteligente, expediente electrónico unificado, prescripción digital y portal del paciente."
        },
        {
          title: "Facturación Automatizada",
          description: "Integración con aseguradoras, facturación electrónica, seguimiento de cobros y conciliación automática."
        },
        {
          title: "Compliance & Seguridad",
          description: "Cumplimiento HIPAA/normativas locales, encriptación end-to-end, auditorías automáticas y backups seguros."
        }
      ],
      metrics: [
        { label: "Reducción Tiempo Admin", value: "50%" },
        { label: "Mejora Satisfacción", value: "42%" },
        { label: "Aumento Cobros", value: "30%" }
      ],
      color: "from-red-500/20 to-pink-500/20"
    },
    {
      id: "educacion",
      icon: GraduationCap,
      name: "Educación",
      tagline: "Enseña Mejor, Administra Menos",
      description: "Plataformas educativas que automatizan gestión académica, mejoran comunicación con padres y potencian el aprendizaje digital.",
      challenges: [
        "Gestión de calificaciones y asistencia manual",
        "Comunicación desorganizada con padres",
        "Cobros de colegiaturas complicados",
        "Falta de herramientas de enseñanza virtual"
      ],
      solutions: [
        {
          title: "LMS + Sistema Académico",
          description: "Plataforma de aprendizaje, calificaciones digitales, asistencia automatizada y reportes para padres en tiempo real."
        },
        {
          title: "Portal Padres/Estudiantes",
          description: "Consulta de calificaciones, asistencia, tareas, pagos de colegiaturas y comunicación directa con maestros."
        },
        {
          title: "Facturación & Cobranza",
          description: "Cobro de colegiaturas automatizado, facturación electrónica, pagos online y seguimiento de morosos."
        }
      ],
      metrics: [
        { label: "Reducción Carga Admin", value: "45%" },
        { label: "Mejora Comunicación", value: "60%" },
        { label: "Aumento Cobros On-Time", value: "38%" }
      ],
      color: "from-green-500/20 to-emerald-500/20"
    }
  ];

  const commonBenefits = [
    {
      icon: BarChart3,
      title: "Visibilidad Total",
      description: "Dashboards en tiempo real con KPIs relevantes para tu industria"
    },
    {
      icon: Zap,
      title: "Automatización",
      description: "Elimina procesos manuales repetitivos y reduce errores humanos"
    },
    {
      icon: Shield,
      title: "Compliance",
      description: "Cumple normativas fiscales, contables y regulatorias de LATAM"
    },
    {
      icon: TrendingUp,
      title: "ROI Medible",
      description: "Resultados tangibles en eficiencia, costos y satisfacción del cliente"
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
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent">
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
              src={industriesHero}
              alt="Soluciones por Industria - Manufactura, Retail, Distribución, Construcción, Salud y Educación"
              className="w-full h-full object-cover"
              priority={true}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/75" />
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-5xl mx-auto text-center space-y-8">
              <Badge className="bg-primary/20 backdrop-blur-sm text-foreground border-primary/30">
                🏭 Soluciones Especializadas por Industria
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
                Tecnología que Entiende
                <br />
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Tu Industria
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-foreground/90 max-w-3xl mx-auto leading-relaxed">
                Soluciones probadas en manufactura, retail, distribución, construcción, salud y educación. Conocemos tus desafíos porque los hemos resuelto.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-6">
                <Button 
                  onClick={scrollToContact}
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_30px_rgba(0,150,255,0.4)] hover:shadow-[0_0_50px_rgba(0,150,255,0.6)] transition-all duration-300 text-lg px-10 py-7 w-full sm:w-auto"
                >
                  Ver Mi Industria
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

              {/* Industry Quick Links */}
              <div className="pt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
                {industries.map((industry) => (
                  <button
                    key={industry.id}
                    onClick={() => scrollToIndustry(industry.id)}
                    className="flex flex-col items-center gap-2 p-4 bg-background/80 backdrop-blur-sm rounded-lg border border-border hover:border-primary transition-all"
                  >
                    <industry.icon className="h-8 w-8 text-primary" />
                    <span className="text-sm font-medium text-foreground">{industry.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Industries Sections */}
        {industries.map((industry, index) => (
          <section 
            key={industry.id} 
            id={industry.id}
            className={`py-28 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}`}
          >
            <div className="container mx-auto px-4 sm:px-6">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                  <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${industry.color} flex items-center justify-center`}>
                    <industry.icon className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-2">{industry.name}</h2>
                    <p className="text-xl text-primary">{industry.tagline}</p>
                  </div>
                </div>

                <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                  {industry.description}
                </p>

                {/* Challenges */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold mb-6">Desafíos Comunes en {industry.name}</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {industry.challenges.map((challenge) => (
                      <Card key={challenge} className="p-6 border-destructive/50">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-destructive text-lg">×</span>
                          </div>
                          <p className="text-muted-foreground">{challenge}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Solutions */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold mb-6">Nuestras Soluciones</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {industry.solutions.map((solution) => (
                      <Card key={solution.title} className="p-6 hover:shadow-xl transition-all border-border hover:border-primary/50">
                        <h4 className="text-lg font-bold mb-3">{solution.title}</h4>
                        <p className="text-sm text-muted-foreground">{solution.description}</p>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid md:grid-cols-3 gap-6">
                  {industry.metrics.map((metric) => (
                    <Card key={metric.label} className="p-6 text-center bg-gradient-to-br from-primary/5 to-accent/5">
                      <div className="text-5xl font-bold text-primary mb-2">{metric.value}</div>
                      <div className="text-sm text-muted-foreground">{metric.label}</div>
                    </Card>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <Button 
                    onClick={scrollToContact}
                    size="lg"
                    className="bg-primary hover:bg-primary/90"
                  >
                    Solicitar Consultoría para {industry.name}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* Common Benefits */}
        <section className="py-28 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <Badge className="mb-4">Beneficios Transversales</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                En Todas las Industrias
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Beneficios comunes sin importar tu sector
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {commonBenefits.map((benefit) => (
                <Card key={benefit.title} className="p-8 text-center hover:shadow-xl transition-all border-border hover:border-primary/50">
                  <benefit.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <Badge className="bg-primary/20">¿No Encuentras Tu Industria?</Badge>
              <h2 className="text-4xl md:text-6xl font-bold">
                Hablemos de Tus
                <br />
                <span className="text-primary">Desafíos Específicos</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Cada negocio es único. Agenda una consulta gratuita y diseñemos la solución perfecta para tu operación.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 justify-center pt-6">
                <Button 
                  onClick={scrollToContact}
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-7"
                >
                  Agendar Consulta Gratuita
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button 
                  onClick={() => window.open('https://wa.me/50241571786', '_blank')}
                  size="lg" 
                  variant="outline"
                  className="text-lg px-10 py-7"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  WhatsApp Directo
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

export default Industries;
