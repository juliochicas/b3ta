import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Search, 
  Handshake, 
  Building2, 
  FileSearch, 
  CheckCircle2, 
  Eye, 
  TruckIcon, 
  Package, 
  Ship, 
  Plane, 
  Factory, 
  ShieldCheck,
  Clock,
  DollarSign,
  Globe,
  Users,
  Award,
  TrendingUp,
  Phone
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import chinaImportsHero from "@/assets/china-imports-hero.jpg";
import { OptimizedImage } from "@/components/OptimizedImage";

const ChinaImports = () => {
  const navigate = useNavigate();

  const scrollToContact = () => {
    navigate('/#contact');
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const stats = [
    { value: "10+", label: "Años de Experiencia", icon: Award },
    { value: "500+", label: "Importaciones Exitosas", icon: TrendingUp },
    { value: "3", label: "Oficinas en Asia", icon: Globe },
    { value: "99%", label: "Satisfacción del Cliente", icon: ShieldCheck }
  ];

  const searchServices = [
    {
      icon: Search,
      title: "Búsqueda de Proveedores",
      description: "Localización de proveedores y productos específicos en China para compra directa o manufactura.",
      features: [
        "Fabricantes directos verificados",
        "Mejores precios y calidad garantizada",
        "Cantidades grandes o pequeñas",
        "Compras continuas o únicas"
      ]
    },
    {
      icon: Handshake,
      title: "Negociación con Proveedores",
      description: "Como empresa china, conseguimos los mejores precios y términos para tu negocio.",
      features: [
        "Mejora de precios existentes",
        "Obtención de datos técnicos",
        "Cálculo de fracción arancelaria",
        "Cotización final con todos los costos"
      ]
    }
  ];

  const auditServices = [
    {
      icon: Building2,
      title: "Auditoría de Fábrica",
      description: "Visita presencial a las instalaciones del proveedor en China para verificación completa.",
      features: [
        "Visita física a oficinas/fábrica",
        "Verificación de producto y calidad",
        "Reporte detallado con fotos/videos",
        "Revisión de certificaciones"
      ],
      badge: "Recomendado"
    },
    {
      icon: FileSearch,
      title: "Investigación No Presencial",
      description: "Opción económica para investigar proveedores sin visita física pero con verificación exhaustiva.",
      features: [
        "Verificación telefónica directa",
        "Validación de registro legal",
        "Revisión de antecedentes",
        "Referencias de clientes"
      ],
      badge: "Económico"
    }
  ];

  const inspectionServices = [
    {
      icon: Eye,
      title: "Inspección de Producción",
      description: "Supervisión durante el proceso de manufactura de tu pedido.",
      timing: "Durante producción"
    },
    {
      icon: CheckCircle2,
      title: "Inspección Pre-Embarque",
      description: "Revisión completa antes del pago final y envío de mercancía.",
      timing: "Antes de pago final"
    },
    {
      icon: TruckIcon,
      title: "Supervisión de Carga",
      description: "Verificación en puerto de que tu pedido se carga correctamente.",
      timing: "En puerto de carga"
    }
  ];

  const shippingServices = [
    {
      icon: Package,
      title: "Obtención de Muestras",
      description: "Recibimos y enviamos muestras de múltiples proveedores en un solo envío.",
      scope: "Desde 1 muestra"
    },
    {
      icon: DollarSign,
      title: "Gestión de Pagos",
      description: "Facilitamos pagos a proveedores chinos cuando tu empresa no puede transferir directamente.",
      scope: "USD, HKD y RMB",
      highlight: true
    },
    {
      icon: Plane,
      title: "Envíos Aéreos",
      description: "Rapidez para pedidos urgentes con seguimiento completo.",
      scope: "Cajas pequeñas a pallets"
    },
    {
      icon: Ship,
      title: "Envíos Marítimos",
      description: "Mejor costo para volúmenes grandes con agencia propia en China.",
      scope: "Hasta contenedores 40'"
    },
    {
      icon: Factory,
      title: "Importación Completa",
      description: "Gestión total: documentos, impuestos, aduana y entrega final.",
      scope: "Servicio integral"
    }
  ];

  const whyUs = [
    {
      icon: Clock,
      title: "Ahorra Tiempo",
      description: "Evita meses de búsqueda y errores costosos con nuestro equipo en China"
    },
    {
      icon: DollarSign,
      title: "Mejores Precios",
      description: "Como empresa china, accedemos a precios de fabricante directo"
    },
    {
      icon: ShieldCheck,
      title: "Cero Riesgos",
      description: "Verificamos cada proveedor y supervisamos todo el proceso"
    },
    {
      icon: Users,
      title: "Equipo Local",
      description: "Personal permanente en China, Hong Kong y USA"
    }
  ];

  const process = [
    {
      step: "01",
      title: "Consulta Inicial",
      description: "Platícanos qué necesitas importar, cantidades y objetivos de tu proyecto"
    },
    {
      step: "02",
      title: "Búsqueda & Cotización",
      description: "Nuestro equipo en China busca proveedores, negocia y te presenta opciones"
    },
    {
      step: "03",
      title: "Verificación",
      description: "Auditamos fábrica, obtenemos muestras e inspeccionamos calidad"
    },
    {
      step: "04",
      title: "Logística & Importación",
      description: "Gestionamos envío, documentos aduanales y entrega final"
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
          
          <nav className="hidden md:flex items-center gap-12" role="navigation" aria-label="Navegación principal">
            <a href="/#services" className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2 px-3" aria-label="Ir a servicios">
              Servicios
            </a>
            <a href="/#soluciones" className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2 px-3" aria-label="Ir a soluciones por presupuesto">
              Soluciones
            </a>
            <a href="/#videos" className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2 px-3" aria-label="Ir a videos">
              Videos
            </a>
            <a href="/#ai-consultant" className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2 px-3" aria-label="Ir a consultor IA">
              Consultor IA
            </a>
            <a href="/#contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2 px-3" aria-label="Ir a contacto">
              Contacto
            </a>
            <a href="/crm" className="text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors py-2 px-4 rounded-lg" aria-label="Acceder al CRM">
              CRM
            </a>
          </nav>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <OptimizedImage 
              src={chinaImportsHero}
              alt="Importaciones de China - Puerto con contenedores y logística internacional"
              className="w-full h-full object-cover"
              priority={true}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/75" />
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-5xl mx-auto text-center space-y-8">
              <Badge className="bg-primary/20 backdrop-blur-sm text-foreground border-primary/30">
                🇨🇳 Oficina Propia en China • 10+ Años de Experiencia
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
                Importaciones de China
                <br />
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Sin Complicaciones
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-foreground/90 max-w-3xl mx-auto leading-relaxed">
                De la fábrica china a tu almacén en LATAM. Sourcing, negociación, inspección, logística y aduanas. Todo en uno.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-6">
                <Button 
                  onClick={scrollToContact}
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_30px_rgba(0,150,255,0.4)] hover:shadow-[0_0_50px_rgba(0,150,255,0.6)] transition-all duration-300 text-lg px-10 py-7 w-full sm:w-auto"
                >
                  Cotizar Mi Importación
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button 
                  onClick={() => window.open('https://wa.me/50241571786', '_blank')}
                  size="lg" 
                  variant="outline"
                  className="bg-background/80 hover:bg-background backdrop-blur-sm text-foreground border-border text-lg px-10 py-7 w-full sm:w-auto"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  WhatsApp Directo
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

        {/* Search & Negotiation Services */}
        <section className="py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <Badge className="mb-4">Paso 1: Encontrar el Proveedor Ideal</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Búsqueda & Negociación
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Conectamos con fabricantes directos en China y negociamos en tu nombre
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {searchServices.map((service) => (
                <Card key={service.title} className="p-8 hover:shadow-xl transition-all border-border hover:border-primary/50">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6">
                    <service.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-6">{service.description}</p>
                  <ul className="space-y-3">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Audit Services */}
        <section className="py-28 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <Badge className="mb-4">Paso 2: Verificación de Confiabilidad</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Investigación & Auditoría
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Verificamos cada proveedor para que no corras riesgos
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {auditServices.map((service) => (
                <Card key={service.title} className="p-8 hover:shadow-xl transition-all border-border hover:border-primary/50 relative">
                  {service.badge && (
                    <Badge className="absolute top-4 right-4 bg-accent">
                      {service.badge}
                    </Badge>
                  )}
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6">
                    <service.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-6">{service.description}</p>
                  <ul className="space-y-3">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <ShieldCheck className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Inspection Services */}
        <section className="py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <Badge className="mb-4">Paso 3: Control de Calidad</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Inspección de Mercancía
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Supervisión en fábrica para garantizar especificaciones y calidad
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {inspectionServices.map((service) => (
                <Card key={service.title} className="p-6 hover:shadow-xl transition-all border-border hover:border-primary/50">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
                    <service.icon className="h-7 w-7 text-primary" />
                  </div>
                  <Badge variant="outline" className="mb-3 text-xs">
                    {service.timing}
                  </Badge>
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Shipping & Imports */}
        <section className="py-28 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <Badge className="mb-4">Paso 4: Logística Total</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Envíos & Importación Completa
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                De China a tu almacén: muestras, envíos aéreos/marítimos y gestión aduanal
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
              {shippingServices.map((service) => (
                <Card key={service.title} className={`p-6 hover:shadow-xl transition-all ${service.highlight ? 'border-2 border-accent bg-accent/5' : 'border-border hover:border-primary/50'}`}>
                  {service.highlight && (
                    <Badge className="mb-3 bg-accent text-accent-foreground">
                      Servicio Exclusivo
                    </Badge>
                  )}
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
                    <service.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                  <Badge variant="secondary" className="text-xs">
                    {service.scope}
                  </Badge>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Process Timeline */}
        <section className="py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Proceso Simple en 4 Pasos
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Así de fácil es importar de China con B3TA
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                {process.map((item, index) => (
                  <div key={item.step} className="relative">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                          <span className="text-2xl font-bold text-primary-foreground">{item.step}</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                    {index < process.length - 1 && (
                      <div className="hidden md:block absolute top-20 left-8 w-0.5 h-20 bg-gradient-to-b from-primary/50 to-transparent" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-28 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                ¿Por Qué Importar con B3TA?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Somos tu socio estratégico en China, no solo un intermediario
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {whyUs.map((reason) => (
                <Card key={reason.title} className="p-6 text-center hover:shadow-xl transition-all border-border hover:border-primary/50">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-4">
                    <reason.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{reason.title}</h3>
                  <p className="text-sm text-muted-foreground">{reason.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-28 bg-gradient-to-br from-primary via-primary-glow to-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L2c+PC9zdmc+')] opacity-20" />
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold text-primary-foreground">
                ¿Listo para Tu Primera
                <br />
                Importación de China?
              </h2>
              <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
                Cotización gratuita en 24 horas. Sin compromiso. Sin letra pequeña.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-6">
                <Button 
                  onClick={scrollToContact}
                  size="lg" 
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-[0_0_30px_rgba(0,200,255,0.4)] text-lg px-10 py-7 w-full sm:w-auto"
                >
                  Solicitar Cotización Gratuita
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  onClick={() => window.open('https://wa.me/50241571786', '_blank')}
                  size="lg" 
                  variant="outline"
                  className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 text-lg px-10 py-7 w-full sm:w-auto"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Hablar por WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
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
              <h4 className="font-bold mb-4 text-lg">Servicios</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="/#services" className="hover:text-cyan-400 transition-colors">SAP Consulting</a></li>
                <li><a href="/#services" className="hover:text-cyan-400 transition-colors">E-commerce & Marketing</a></li>
                <li><a href="/#services" className="hover:text-cyan-400 transition-colors">Automatización</a></li>
                <li><a href="/#services" className="hover:text-cyan-400 transition-colors">IA Corporativa</a></li>
                <li><a href="/importaciones-china" className="hover:text-cyan-400 transition-colors">Importaciones China</a></li>
                <li><a href="/#services" className="hover:text-cyan-400 transition-colors">Desarrollo Web</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-lg">Industrias</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="/#casos" className="hover:text-cyan-400 transition-colors">Manufactura</a></li>
                <li><a href="/#casos" className="hover:text-cyan-400 transition-colors">Retail & E-commerce</a></li>
                <li><a href="/#casos" className="hover:text-cyan-400 transition-colors">Distribución</a></li>
                <li><a href="/#casos" className="hover:text-cyan-400 transition-colors">Construcción</a></li>
                <li><a href="/#casos" className="hover:text-cyan-400 transition-colors">Salud</a></li>
                <li><a href="/#casos" className="hover:text-cyan-400 transition-colors">Educación</a></li>
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
    </div>
  );
};

export default ChinaImports;
