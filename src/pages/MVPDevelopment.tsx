import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Lightbulb,
  Rocket,
  Target,
  Users,
  TrendingUp,
  Clock,
  DollarSign,
  CheckCircle2,
  Zap,
  ShieldCheck,
  BarChart3,
  Smartphone,
  Globe,
  Package,
  Phone,
  Code2,
  Palette,
  TestTube2,
  LineChart
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { OptimizedImage } from "@/components/OptimizedImage";
import videoThumbnailAi from "@/assets/video-thumbnail-ai.jpg";
import { Footer } from "@/components/Footer";

const MVPDevelopment = () => {
  const navigate = useNavigate();

  const scrollToContact = () => {
    navigate('/#contact');
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const stats = [
    { value: "4-8", label: "Semanas Desarrollo", icon: Clock },
    { value: "70%", label: "Menos Inversión", icon: DollarSign },
    { value: "3x", label: "Más Rápido", icon: Zap },
    { value: "90%", label: "Validación Exitosa", icon: Target }
  ];

  const benefits = [
    {
      icon: Target,
      title: "Validación Real de Mercado",
      description: "Prueba tu idea con usuarios reales antes de invertir todo tu presupuesto. Aprende qué funciona y qué no."
    },
    {
      icon: DollarSign,
      title: "Inversión Mínima",
      description: "Reduce el riesgo financiero hasta en 70%. Solo construye lo esencial para validar tu hipótesis de negocio."
    },
    {
      icon: Clock,
      title: "Time-to-Market Acelerado",
      description: "De idea a producto en 4-8 semanas. Llega al mercado antes que tu competencia y comienza a generar tracción."
    },
    {
      icon: TrendingUp,
      title: "Iteración Basada en Datos",
      description: "Mejora tu producto con feedback real. Cada versión se construye sobre aprendizajes validados del mercado."
    },
    {
      icon: ShieldCheck,
      title: "Reducción de Riesgos",
      description: "Evita construir productos que nadie quiere. Valida cada suposición antes de escalar."
    },
    {
      icon: Users,
      title: "Product-Market Fit",
      description: "Encuentra el ajuste perfecto entre tu producto y las necesidades reales de tus clientes objetivo."
    }
  ];

  const process = [
    {
      step: "01",
      title: "Discovery & Validación",
      duration: "1 semana",
      description: "Entendemos tu visión, validamos hipótesis y definimos el núcleo de valor del MVP",
      deliverables: [
        "Product Brief documentado",
        "User Stories priorizadas",
        "Wireframes clave",
        "Roadmap técnico"
      ]
    },
    {
      step: "02",
      title: "Diseño UX/UI",
      duration: "1-2 semanas",
      description: "Creamos interfaces centradas en el usuario que maximizan conversión y engagement",
      deliverables: [
        "Diseño de pantallas clave",
        "Flujos de usuario optimizados",
        "Sistema de diseño base",
        "Prototipo interactivo"
      ]
    },
    {
      step: "03",
      title: "Desarrollo Ágil",
      duration: "2-4 semanas",
      description: "Sprints de desarrollo con entregas incrementales y feedback continuo",
      deliverables: [
        "Código de producción",
        "Funcionalidades core operativas",
        "Integración de APIs",
        "Testing automatizado"
      ]
    },
    {
      step: "04",
      title: "Lanzamiento & Validación",
      duration: "1 semana",
      description: "Deploy en producción, monitoreo y análisis de métricas clave para iterar",
      deliverables: [
        "Producto en producción",
        "Dashboard de analytics",
        "Documentación técnica",
        "Plan de iteración"
      ]
    }
  ];

  const useCases = [
    {
      icon: Rocket,
      title: "Startups Tech",
      description: "Valida tu idea de negocio con inversión mínima antes de buscar funding o escalar",
      examples: "SaaS, Marketplace, Fintech"
    },
    {
      icon: Package,
      title: "Productos Internos",
      description: "Digitaliza procesos corporativos críticos con herramientas a medida",
      examples: "CRM, ERP ligero, Portales"
    },
    {
      icon: Smartphone,
      title: "Apps Móviles",
      description: "PWAs y apps nativas que funcionan en cualquier dispositivo",
      examples: "E-commerce, Delivery, Social"
    },
    {
      icon: Globe,
      title: "Innovación Corporativa",
      description: "Valida nuevas líneas de negocio sin comprometer recursos del core business",
      examples: "Nuevos canales, Servicios digitales"
    }
  ];

  const techStack = [
    {
      category: "Frontend",
      icon: Code2,
      technologies: "React, TypeScript, Tailwind CSS"
    },
    {
      category: "Backend",
      icon: Zap,
      technologies: "Supabase, Edge Functions, PostgreSQL"
    },
    {
      category: "Diseño",
      icon: Palette,
      technologies: "Figma, Design System, UX Research"
    },
    {
      category: "Testing",
      icon: TestTube2,
      technologies: "Jest, Testing Library, E2E Tests"
    }
  ];

  const pricing = {
    base: 500,
    features: [
      "4-8 semanas de desarrollo",
      "Diseño UX/UI profesional",
      "Hasta 10 pantallas funcionales",
      "Backend completo con base de datos",
      "Autenticación de usuarios",
      "Panel de administración",
      "Deployment en producción",
      "1 mes de soporte post-lanzamiento",
      "Analytics y monitoreo",
      "Código fuente completo"
    ]
  };

  const metrics = [
    {
      icon: BarChart3,
      metric: "Conversión",
      description: "Medimos tasa de registro, activación y retención desde día 1"
    },
    {
      icon: Users,
      metric: "Engagement",
      description: "Analizamos uso real, sesiones y comportamiento de usuarios"
    },
    {
      icon: LineChart,
      metric: "Crecimiento",
      description: "Trackeamos KPIs clave para validar tu modelo de negocio"
    }
  ];

  const faqs = [
    {
      q: "¿Qué es exactamente un MVP?",
      a: "Un MVP (Minimum Viable Product) es la versión más simple de tu producto que tiene las funcionalidades esenciales para resolver el problema principal de tus usuarios. El objetivo es validar tu idea con inversión mínima antes de construir el producto completo."
    },
    {
      q: "¿Por qué 4-8 semanas?",
      a: "Un MVP bien definido se enfoca en el core value. En 4-8 semanas podemos diseñar, desarrollar y lanzar las funcionalidades críticas que necesitas para validar tu hipótesis de negocio sin sobreconstruir."
    },
    {
      q: "¿Qué pasa después del MVP?",
      a: "Post-lanzamiento, analizamos métricas reales y feedback de usuarios. Basado en estos datos, iteramos y escalamos las funcionalidades que demuestran tracción. Incluye 1 mes de soporte para ajustes críticos."
    },
    {
      q: "¿Puedo escalar el MVP después?",
      a: "Absolutamente. Tu MVP está construido con arquitectura escalable desde día 1. Puedes agregar funcionalidades, integrar nuevos servicios y crecer hasta millones de usuarios cuando valides el product-market fit."
    },
    {
      q: "¿Qué incluye el precio desde $500?",
      a: "Incluye discovery completo, diseño UX/UI, desarrollo full-stack, backend con base de datos, autenticación, panel admin, deployment, 1 mes de soporte y código fuente. El precio final depende de la complejidad específica de tu MVP."
    },
    {
      q: "¿Qué NO es un MVP?",
      a: "Un MVP no es un prototipo visual ni un producto a medias. Es un producto funcional, en producción, con usuarios reales, pero enfocado en validar tu hipótesis principal sin funcionalidades secundarias que pueden esperar."
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
          
          <nav className="hidden md:flex items-center gap-12" role="navigation" aria-label="Navegación principal">
            <a href="/#services" className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2 px-3">
              Servicios
            </a>
            <a href="/#soluciones" className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2 px-3">
              Soluciones
            </a>
            <a href="/#videos" className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2 px-3">
              Videos
            </a>
            <a href="/#ai-consultant" className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2 px-3">
              Consultor IA
            </a>
            <a href="/#contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2 px-3">
              Contacto
            </a>
            <a href="/crm" className="text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors py-2 px-4 rounded-lg">
              CRM
            </a>
          </nav>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <OptimizedImage 
              src={videoThumbnailAi}
              alt="MVP Development - Desarrollo de producto mínimo viable"
              className="w-full h-full object-cover"
              priority={true}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/75" />
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-5xl mx-auto text-center space-y-8">
              <Badge className="bg-primary/20 backdrop-blur-sm text-foreground border-primary/30">
                💡 De Idea a Producto Real en 4-8 Semanas
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
                MVP & Desarrollo
                <br />
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  de Producto
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-foreground/90 max-w-3xl mx-auto leading-relaxed">
                Transforma tu idea en producto funcional, validado con usuarios reales. Reduce riesgos, invierte menos y llega al mercado 3x más rápido.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-6">
                <Button 
                  onClick={scrollToContact}
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_30px_rgba(0,150,255,0.4)] hover:shadow-[0_0_50px_rgba(0,150,255,0.6)] transition-all duration-300 text-lg px-10 py-7 w-full sm:w-auto"
                >
                  Validar Mi Idea
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
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center bg-background/80 backdrop-blur-sm rounded-lg p-4 border border-border">
                    <stat.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <Badge className="mb-4">Por Qué MVP</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Beneficios de Validar con MVP
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Reduce riesgos, aprende rápido y escala solo lo que funciona
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {benefits.map((benefit) => (
                <Card key={benefit.title} className="p-8 hover:shadow-xl transition-all border-border hover:border-primary/50">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6">
                    <benefit.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-28 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <Badge className="mb-4">Metodología Probada</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Proceso de Desarrollo MVP
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                De concepto a producto en producción en 4 fases ágiles
              </p>
            </div>

            <div className="max-w-6xl mx-auto space-y-6">
              {process.map((phase, index) => (
                <Card key={phase.step} className="p-8 hover:shadow-xl transition-all border-border hover:border-primary/50">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <span className="text-3xl font-bold text-primary">{phase.step}</span>
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

        {/* Use Cases */}
        <section className="py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <Badge className="mb-4">Casos de Uso</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                ¿Para Quién es Ideal un MVP?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Desde startups hasta corporaciones innovando
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {useCases.map((useCase) => (
                <Card key={useCase.title} className="p-6 hover:shadow-xl transition-all border-border hover:border-primary/50">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
                    <useCase.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{useCase.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{useCase.description}</p>
                  <Badge variant="outline" className="text-xs">{useCase.examples}</Badge>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="py-28 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <Badge className="mb-4">Stack Tecnológico</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Tecnología Enterprise, Velocidad Startup
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Stack moderno, escalable y probado en producción
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {techStack.map((tech) => (
                <Card key={tech.category} className="p-6 text-center hover:shadow-xl transition-all border-border hover:border-primary/50">
                  <tech.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">{tech.category}</h3>
                  <p className="text-sm text-muted-foreground">{tech.technologies}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <Badge className="mb-4">Inversión</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Precio Transparente
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Todo incluido, sin sorpresas
              </p>
            </div>

            <Card className="max-w-3xl mx-auto p-10 border-2 border-primary/50 shadow-2xl">
              <div className="text-center mb-8">
                <Badge className="mb-4 bg-accent">Más Popular</Badge>
                <div className="text-5xl font-bold mb-2">
                  Desde ${pricing.base}
                </div>
                <p className="text-muted-foreground">USD + IVA • Precio final según complejidad</p>
              </div>

              <div className="space-y-4 mb-8">
                {pricing.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-base">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                onClick={scrollToContact}
                size="lg" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-7"
              >
                Cotizar Mi MVP
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Card>
          </div>
        </section>

        {/* Metrics */}
        <section className="py-28 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <Badge className="mb-4">Analytics & Validación</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Métricas que Importan
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Medimos lo que realmente valida tu modelo de negocio
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {metrics.map((item) => (
                <Card key={item.metric} className="p-8 text-center hover:shadow-xl transition-all border-border hover:border-primary/50">
                  <item.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-3">{item.metric}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-28 bg-background">
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
              <Badge className="bg-primary/20">¿Listo para Validar?</Badge>
              <h2 className="text-4xl md:text-6xl font-bold">
                De Idea a Producto Real
                <br />
                <span className="text-primary">en 4-8 Semanas</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Agenda una consulta gratuita y descubre cómo podemos transformar tu idea en un MVP validado con usuarios reales
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

export default MVPDevelopment;
