import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Zap, RefreshCw, Shield, TrendingUp, Package, DollarSign, Clock, Users, Database, Network } from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import heroImage from "@/assets/shopify-sap-connector-hero.jpg";
import { Helmet } from "react-helmet";

const ShopifySAPConnector = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const benefits = [
    {
      icon: RefreshCw,
      title: "Sincronización en Tiempo Real",
      description: "Inventario, precios y descripciones actualizados automáticamente entre Shopify y SAP Business One"
    },
    {
      icon: Zap,
      title: "Integración Vía Service Layer",
      description: "Conexión robusta y segura utilizando la capa de servicios nativa de SAP para máxima confiabilidad"
    },
    {
      icon: Shield,
      title: "100% Confiable y Seguro",
      description: "Arquitectura enterprise-grade con encriptación end-to-end y manejo de errores automático"
    },
    {
      icon: TrendingUp,
      title: "Escalabilidad Garantizada",
      description: "Soporta desde cientos hasta millones de productos sin degradación de performance"
    },
    {
      icon: Clock,
      title: "Ahorro de Tiempo",
      description: "Elimina la entrada manual de datos y reduce errores hasta en un 95%"
    },
    {
      icon: DollarSign,
      title: "ROI Inmediato",
      description: "Recupera tu inversión en menos de 3 meses con la optimización de procesos"
    }
  ];

  const features = [
    "Sincronización bidireccional de productos (Shopify ↔ SAP)",
    "Actualización de stock en tiempo real",
    "Gestión automática de precios y promociones",
    "Sincronización de descripciones multiidioma",
    "Control de variantes y SKUs",
    "Webhooks para eventos instantáneos",
    "Dashboard de monitoreo y logs",
    "Alertas automáticas de errores",
    "Respaldo y recuperación de datos",
    "Soporte técnico 24/7 en español"
  ];

  const useCases = [
    {
      icon: Package,
      title: "Retail Multicanal",
      description: "Unifica tu tienda física y online con inventario sincronizado en tiempo real"
    },
    {
      icon: Users,
      title: "Distribuidores",
      description: "Gestiona múltiples tiendas Shopify desde un único SAP Business One"
    },
    {
      icon: Database,
      title: "Fabricantes",
      description: "Conecta tu producción con ventas online sin intervención manual"
    },
    {
      icon: Network,
      title: "Mayoristas",
      description: "Sincroniza catálogos masivos con actualizaciones automáticas de precios B2B"
    }
  ];

  const faqs = [
    {
      question: "¿Cuánto tiempo toma la implementación?",
      answer: "La implementación completa toma entre 2-4 semanas, dependiendo de la complejidad de tu catálogo y configuraciones personalizadas."
    },
    {
      question: "¿Es compatible con mi versión de SAP Business One?",
      answer: "Sí, el conector es compatible con SAP Business One 9.3 y versiones superiores, tanto SQL como HANA."
    },
    {
      question: "¿Qué pasa si hay conflictos de datos?",
      answer: "El sistema cuenta con reglas de resolución de conflictos configurables y notificaciones automáticas para revisión manual cuando sea necesario."
    },
    {
      question: "¿Incluye soporte técnico?",
      answer: "Sí, incluimos soporte técnico 24/7 en español, actualizaciones automáticas y monitoreo proactivo del sistema."
    },
    {
      question: "¿Puedo personalizar las reglas de sincronización?",
      answer: "Absolutamente. El conector es totalmente configurable para adaptarse a tus procesos de negocio específicos."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Conector Shopify - SAP Business One | Sincronización en Tiempo Real</title>
        <meta name="description" content="Conecta Shopify con SAP Business One vía Service Layer. Sincronización automática de productos, inventario y precios en tiempo real. Implementación en 2-4 semanas." />
        <meta name="keywords" content="Shopify SAP connector, SAP Business One Shopify, Service Layer integration, sincronización ecommerce ERP, conector Shopify SAP LATAM" />
        <link rel="canonical" href="https://b3ta.io/shopify-sap-connector" />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <OptimizedImage
              src={heroImage}
              alt="Conector Shopify SAP Business One - Sincronización en Tiempo Real"
              className="absolute inset-0 w-full h-full object-cover"
              priority={true}
              width={1920}
              height={1080}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary-glow/90 to-primary/95" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-5xl mx-auto text-center space-y-8">
              <div className="inline-block px-5 py-2.5 bg-secondary/20 backdrop-blur-sm rounded-full border border-secondary/30">
                <span className="text-sm font-semibold text-primary-foreground">✨ Integración Enterprise Lista para Producción</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground leading-tight">
                Conector Shopify
                <br />
                <span className="bg-gradient-to-r from-secondary via-accent to-secondary bg-clip-text text-transparent">
                  SAP Business One
                </span>
              </h1>

              <h2 className="text-2xl md:text-3xl font-semibold text-primary-foreground/95">
                Sincroniza tu e-commerce con tu ERP en tiempo real vía Service Layer
              </h2>

              <p className="text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
                Elimina la duplicación de datos y errores manuales. Conecta Shopify con SAP Business One 
                para mantener productos, inventario y precios sincronizados automáticamente.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-6">
                <Button 
                  onClick={scrollToContact}
                  size="lg" 
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-[0_0_30px_rgba(0,200,255,0.4)] hover:shadow-[0_0_50px_rgba(0,200,255,0.6)] transition-all duration-300 text-lg px-10 py-7"
                >
                  Solicitar Demo Personalizada
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {[
                  { label: "Uptime", value: "99.9%" },
                  { label: "Implementación", value: "2-4 Sem" },
                  { label: "Soporte", value: "24/7" },
                  { label: "ROI", value: "<3 Meses" }
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-3xl font-bold text-primary-foreground mb-1">{stat.value}</div>
                    <div className="text-sm text-primary-foreground/70">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                ¿Por Qué Nuestro Conector?
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Tecnología probada en producción para empresas que necesitan sincronización confiable
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {benefits.map((benefit, index) => (
                <Card 
                  key={benefit.title}
                  className="p-8 hover:shadow-xl transition-all duration-300 border-border hover:border-primary/50 bg-card"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="mb-6 w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <benefit.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Características Completas
                </h2>
                <p className="text-xl text-muted-foreground">
                  Todo lo que necesitas para una integración enterprise-grade
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg hover:bg-card transition-colors"
                  >
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  ¿Cómo Funciona?
                </h2>
                <p className="text-xl text-muted-foreground">
                  Proceso simple y transparente de implementación
                </p>
              </div>

              <div className="grid md:grid-cols-4 gap-8">
                {[
                  { step: "1", title: "Análisis", desc: "Evaluamos tu infraestructura actual y necesidades específicas" },
                  { step: "2", title: "Configuración", desc: "Instalamos y configuramos el conector según tus reglas de negocio" },
                  { step: "3", title: "Migración", desc: "Sincronizamos tu catálogo inicial y validamos la integridad" },
                  { step: "4", title: "Go Live", desc: "Activamos la sincronización en tiempo real con monitoreo 24/7" }
                ].map((phase) => (
                  <div key={phase.step} className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-2xl font-bold text-primary-foreground mx-auto mb-4">
                      {phase.step}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{phase.title}</h3>
                    <p className="text-muted-foreground text-sm">{phase.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Casos de Uso
              </h2>
              <p className="text-xl text-muted-foreground">
                Soluciones específicas para diferentes modelos de negocio
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {useCases.map((useCase, index) => (
                <Card 
                  key={useCase.title}
                  className="p-6 hover:shadow-xl transition-all duration-300 border-border hover:border-primary/50 bg-card text-center"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="mb-4 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto">
                    <useCase.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{useCase.title}</h3>
                  <p className="text-muted-foreground text-sm">{useCase.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Preguntas Frecuentes
                </h2>
              </div>

              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <Card key={index} className="p-6 hover:shadow-lg transition-all">
                    <h3 className="text-xl font-bold text-foreground mb-3">{faq.question}</h3>
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary via-primary-glow to-primary">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground">
                ¿Listo para Sincronizar tu Negocio?
              </h2>
              <p className="text-xl text-primary-foreground/90">
                Agenda una demo personalizada y descubre cómo podemos optimizar tu operación
              </p>
              <Button 
                onClick={scrollToContact}
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-[0_0_30px_rgba(0,200,255,0.4)] text-lg px-10 py-7"
              >
                Solicitar Demo Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <ContactForm />
        
        <Footer />
      </div>
    </>
  );
};

export default ShopifySAPConnector;
