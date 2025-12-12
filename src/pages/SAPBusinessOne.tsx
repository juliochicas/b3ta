import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  CheckCircle2, 
  Phone,
  Database,
  BarChart3,
  Users,
  Package,
  TruckIcon,
  DollarSign,
  ShieldCheck,
  Zap,
  Globe,
  Building2,
  TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { OptimizedImage } from "@/components/OptimizedImage";
import sapHero from "@/assets/sap-hero.jpg";
import { Footer } from "@/components/Footer";

const SAPBusinessOne = () => {
  const navigate = useNavigate();

  const scrollToContact = () => {
    navigate('/#contact');
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const modules = [
    {
      icon: DollarSign,
      title: "Finanzas & Contabilidad",
      description: "Control total sobre cuentas por pagar, cobrar, activos fijos y reportes financieros en tiempo real.",
      features: ["Contabilidad automatizada", "Flujos de caja", "Reportes fiscales", "Multi-moneda"]
    },
    {
      icon: Package,
      title: "Inventarios & Compras",
      description: "Gestión inteligente de stock, bodegas múltiples, órdenes de compra y trazabilidad completa.",
      features: ["Control por lote/serie", "Multi-almacén", "Reorden automático", "Valuación de inventario"]
    },
    {
      icon: Users,
      title: "Ventas & CRM",
      description: "Desde cotización hasta factura. Pipeline de ventas, seguimiento de clientes y análisis predictivo.",
      features: ["Cotizaciones rápidas", "Seguimiento oportunidades", "Historial clientes", "Comisiones vendedores"]
    },
    {
      icon: TruckIcon,
      title: "Distribución & Logística",
      description: "Rutas de reparto, picking, packing y seguimiento de entregas integrado con transportistas.",
      features: ["Rutas optimizadas", "Tracking en tiempo real", "E-waybill", "Integración transportes"]
    },
    {
      icon: Building2,
      title: "Manufactura & MRP",
      description: "Planificación de materiales, órdenes de producción, control de calidad y costeo por proyecto.",
      features: ["BOMs multinivel", "Órdenes de producción", "Control calidad", "Costeo real vs estándar"]
    },
    {
      icon: BarChart3,
      title: "Analytics & BI",
      description: "Dashboards ejecutivos, KPIs en vivo y reportes personalizados con SAP Analytics Cloud.",
      features: ["Dashboards interactivos", "KPIs personalizados", "Forecasting", "Mobile access"]
    }
  ];

  const benefits = [
    {
      title: "Elimina Silos de Información",
      description: "Un solo sistema integrado. Finanzas, ventas, compras e inventarios sincronizados en tiempo real.",
      icon: Database
    },
    {
      title: "Escalabilidad Probada",
      description: "De 5 a 500 usuarios. Crece sin cambiar de ERP. Usado por +70,000 empresas en el mundo.",
      icon: TrendingUp
    },
    {
      title: "ROI Medible",
      description: "Reduce costos operativos hasta 30%, mejora ciclos de venta 40% y elimina errores manuales.",
      icon: BarChart3
    },
    {
      title: "Cumplimiento Garantizado",
      description: "Fiscal, contable y normativo. Certificado para operar en LATAM con regulaciones locales.",
      icon: ShieldCheck
    }
  ];

  const implementation = [
    {
      phase: "01",
      title: "Diagnóstico & Planeación",
      duration: "2-4 semanas",
      description: "Entendemos tus procesos actuales, identificamos gaps y diseñamos el blueprint de implementación.",
      deliverables: ["Mapeo de procesos AS-IS y TO-BE", "Plan de proyecto detallado", "Equipo asignado", "Licenciamiento definido"]
    },
    {
      phase: "02",
      title: "Configuración & Desarrollo",
      duration: "6-12 semanas",
      description: "Parametrizamos SAP B1 según tus necesidades y desarrollamos custom add-ons si se requiere.",
      deliverables: ["Configuración core", "Desarrollos custom", "Integraciones externas", "Ambiente de pruebas"]
    },
    {
      phase: "03",
      title: "Migración de Datos",
      duration: "2-4 semanas",
      description: "Limpieza, transformación y carga de datos históricos desde tus sistemas legacy.",
      deliverables: ["Data cleansing", "Migración controlada", "Validaciones", "Rollback plan"]
    },
    {
      phase: "04",
      title: "Go-Live & Soporte",
      duration: "1-2 semanas + ongoing",
      description: "Salida a producción con soporte intensivo. Hiper-cuidado durante las primeras 4 semanas críticas.",
      deliverables: ["Go-live controlado", "Soporte 24/7", "Ajustes post-live", "Capacitación continua"]
    }
  ];

  const faqs = [
    {
      q: "¿Cuánto cuesta SAP Business One?",
      a: "Desde $15,000 USD incluyendo licencias, implementación y capacitación. El costo exacto depende del número de usuarios, módulos y customizaciones. Contacta para una cotización personalizada sin compromiso."
    },
    {
      q: "¿Cuánto dura la implementación?",
      a: "Entre 3-6 meses para una implementación estándar. Proyectos complejos con muchas integraciones o desarrollos custom pueden tomar hasta 12 meses. Incluye fases de diagnóstico, configuración, migración de datos y go-live."
    },
    {
      q: "¿Necesito estar en la nube o puedo tenerlo on-premise?",
      a: "SAP Business One funciona en ambos modelos. Recomendamos SAP B1 for HANA en la nube para mejor performance, escalabilidad y menores costos de infraestructura. Pero si requieres on-premise, también lo soportamos."
    },
    {
      q: "¿Qué pasa con mi sistema actual?",
      a: "Migramos toda tu data histórica relevante: catálogos de productos, clientes, proveedores, transacciones históricas. Hacemos limpieza de datos, transformación y validación antes del go-live para asegurar integridad."
    },
    {
      q: "¿Incluye soporte post-implementación?",
      a: "Sí, incluimos 1 mes de hiper-cuidado post go-live. Después puedes contratar planes de soporte mensual 24/7/365 que incluyen actualizaciones, parches, help desk y consultoría continua."
    },
    {
      q: "¿Puedo integrarlo con mis otros sistemas?",
      a: "Absolutamente. Integramos SAP B1 con e-commerce, CRM, WMS, TMS, plataformas de pagos, marketplaces y cualquier sistema que tenga API. Hacemos que todo tu ecosistema tecnológico trabaje unificado."
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
              src={sapHero}
              alt="SAP Business One - ERP Enterprise para LATAM"
              className="w-full h-full object-cover"
              priority={true}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/75" />
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-5xl mx-auto text-center space-y-8">
              <Badge className="bg-primary/20 backdrop-blur-sm text-foreground border-primary/30">
                🏢 ERP #1 para PYMEs en Crecimiento
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
                SAP Business One
                <br />
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  for HANA
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-foreground/90 max-w-3xl mx-auto leading-relaxed">
                El ERP completo que unifica finanzas, ventas, compras, inventarios y manufactura. Implementación, migración y soporte 24/7 para empresas en LATAM.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-6">
                <Button 
                  onClick={scrollToContact}
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_30px_rgba(0,150,255,0.4)] hover:shadow-[0_0_50px_rgba(0,150,255,0.6)] transition-all duration-300 text-lg px-10 py-7 w-full sm:w-auto"
                >
                  Solicitar Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button 
                  onClick={() => window.open('https://wa.me/50241571786', '_blank')}
                  size="lg" 
                  variant="outline"
                  className="bg-background/80 hover:bg-background backdrop-blur-sm text-foreground border-border text-lg px-10 py-7 w-full sm:w-auto"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Hablar con Experto
                </Button>
              </div>

              {/* Stats */}
              <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {[
                  { value: "70K+", label: "Empresas Globales" },
                  { value: "180", label: "Países" },
                  { value: "99.9%", label: "Uptime Garantizado" },
                  { value: "15+", label: "Años Experiencia" }
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

        {/* Modules */}
        <section className="py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <Badge className="mb-4">Módulos Integrados</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Todo en Un Solo Sistema
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Finanzas, ventas, compras, inventarios, manufactura y más. Sincronizados en tiempo real.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {modules.map((module) => (
                <Card key={module.title} className="p-8 hover:shadow-xl transition-all border-border hover:border-primary/50">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6">
                    <module.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{module.title}</h3>
                  <p className="text-muted-foreground text-sm mb-6">{module.description}</p>
                  
                  <ul className="space-y-2">
                    {module.features.map((feature) => (
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

        {/* Benefits */}
        <section className="py-28 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <Badge className="mb-4">Beneficios Reales</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Por Qué SAP Business One
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {benefits.map((benefit) => (
                <Card key={benefit.title} className="p-8 hover:shadow-xl transition-all border-border hover:border-primary/50">
                  <benefit.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-2xl font-bold mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Implementation Process */}
        <section className="py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <Badge className="mb-4">Proceso Probado</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Implementación en 4 Fases
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Metodología ágil certificada por SAP para go-lives exitosos
              </p>
            </div>

            <div className="max-w-6xl mx-auto space-y-6">
              {implementation.map((phase) => (
                <Card key={phase.phase} className="p-8 hover:shadow-xl transition-all border-border hover:border-primary/50">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <span className="text-3xl font-bold text-primary">{phase.phase}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-2xl font-bold">{phase.title}</h3>
                        <Badge variant="outline">{phase.duration}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-6">{phase.description}</p>
                      
                      <div className="grid md:grid-cols-2 gap-3">
                        {phase.deliverables.map((deliverable) => (
                          <div key={deliverable} className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" />
                            <span className="text-sm">{deliverable}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
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
              <Badge className="bg-primary/20">¿Listo para Transformar?</Badge>
              <h2 className="text-4xl md:text-6xl font-bold">
                Solicita una Demo
                <br />
                <span className="text-primary">Personalizada</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Agenda una sesión con nuestros consultores SAP y descubre cómo Business One puede transformar tu operación
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 justify-center pt-6">
                <Button 
                  onClick={scrollToContact}
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-7"
                >
                  Solicitar Demo Ahora
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

export default SAPBusinessOne;
