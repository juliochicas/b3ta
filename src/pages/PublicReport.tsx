import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Image as ImageIcon, Video, ExternalLink, Calendar, User, Building2, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Report {
  id: string;
  report_number: string;
  customer_id: string;
  customers: {
    name: string;
    email: string;
    company: string | null;
    phone: string | null;
  };
  status: string;
  consultant_name: string;
  consultant_signature: string | null;
  sections_config: any;
  current_situation: string | null;
  findings: string | null;
  recommendations: string | null;
  conclusions: string | null;
  created_at: string;
}

interface Media {
  id: string;
  type: string;
  url: string;
  is_external: boolean;
  caption: string | null;
}

export default function PublicReport() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadReport();
  }, [slug]);

  const loadReport = async () => {
    try {
      setLoading(true);
      
      // Cargar informe público con JOIN a customers
      const { data: reportData, error: reportError } = await supabase
        .from('consultation_reports')
        .select(`
          *,
          customers (
            name,
            email,
            company,
            phone
          )
        `)
        .eq('public_slug', slug)
        .eq('status', 'sent')
        .single();

      if (reportError || !reportData) {
        console.error('Error cargando reporte público:', reportError);
        setError(true);
        return;
      }

      setReport(reportData);

      // Cargar multimedia
      const { data: mediaData } = await supabase
        .from('report_media')
        .select('*')
        .eq('report_id', reportData.id);

      setMedia(mediaData || []);
    } catch (err) {
      console.error('Error inesperado:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando informe...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="py-12 text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Informe no disponible</h2>
            <p className="text-muted-foreground mb-6">
              Este informe no existe, ha sido eliminado, o aún no ha sido publicado. Si recientemente recibiste este enlace, por favor contacta con tu consultor de B3TA.
            </p>
            <div className="space-y-3">
              <Button onClick={() => navigate('/')} className="w-full">
                Ir al inicio
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = 'mailto:hi@b3ta.us?subject=Problema con enlace de informe'}
                className="w-full"
              >
                <Mail className="mr-2 h-4 w-4" />
                Contactar soporte
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-2xl font-bold text-white">B3</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent">
                  B3TA
                </h1>
                <p className="text-sm text-muted-foreground">Consultoría Profesional</p>
              </div>
            </div>
            <Badge variant="outline" className="text-sm">
              Informe de Consultoría
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Report Header */}
        <Card className="mb-6 border-2">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-3xl mb-2">{report.report_number}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(report.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              <Badge variant="default" className="text-base px-4 py-2">
                Informe Oficial
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Customer Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Información del Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Nombre</p>
                    <p className="font-semibold text-lg">{report.customers.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{report.customers.email}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {report.customers.company && (
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Empresa</p>
                      <p className="font-medium">{report.customers.company}</p>
                    </div>
                  </div>
                )}
                {report.customers.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Teléfono</p>
                      <p className="font-medium">{report.customers.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Sections */}
        {report.sections_config.current_situation && report.current_situation && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Análisis de Situación Actual</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap leading-relaxed">{report.current_situation}</p>
            </CardContent>
          </Card>
        )}

        {report.sections_config.findings && report.findings && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Hallazgos Principales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap leading-relaxed">{report.findings}</p>
            </CardContent>
          </Card>
        )}

        {/* Multimedia Section */}
        {report.sections_config.multimedia && media.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Evidencia Multimedia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {media.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-3 rounded-lg bg-primary/10">
                          {item.type === 'photo' ? (
                            <ImageIcon className="h-6 w-6 text-primary" />
                          ) : (
                            <Video className="h-6 w-6 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold mb-1">
                            {item.type === 'photo' ? 'Fotografía' : 'Video'}
                          </p>
                          {item.caption && (
                            <p className="text-sm text-muted-foreground mb-3">{item.caption}</p>
                          )}
                          {!item.is_external && item.type === 'photo' && (
                            <img 
                              src={item.url} 
                              alt={item.caption || 'Imagen'} 
                              className="w-full rounded-lg mt-2"
                            />
                          )}
                          {!item.is_external && item.type === 'video' && (
                            <video 
                              src={item.url} 
                              controls 
                              className="w-full rounded-lg mt-2"
                            />
                          )}
                          {item.is_external && (
                            <Button
                              size="sm"
                              onClick={() => window.open(item.url, '_blank')}
                              className="mt-2"
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Ver contenido
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {report.sections_config.recommendations && report.recommendations && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Recomendaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap leading-relaxed">{report.recommendations}</p>
            </CardContent>
          </Card>
        )}

        {report.sections_config.conclusions && report.conclusions && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Conclusiones</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap leading-relaxed">{report.conclusions}</p>
            </CardContent>
          </Card>
        )}

        {/* Consultant Signature */}
        <Card>
          <CardHeader>
            <CardTitle>Consultor Responsable</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <p className="font-semibold text-lg mb-2">{report.consultant_name}</p>
                <p className="text-sm text-muted-foreground">Consultor de B3TA</p>
              </div>
              {report.consultant_signature && (
                <div className="border-2 rounded-lg p-4 bg-white">
                  <img 
                    src={report.consultant_signature} 
                    alt="Firma" 
                    className="h-20"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-8 w-8 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-sm font-bold text-white">B3</span>
            </div>
            <span className="font-bold text-lg">B3TA</span>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Consultoría Profesional</p>
          <p className="text-sm text-muted-foreground">www.b3ta.com | info@b3ta.com</p>
          <Separator className="my-4" />
          <p className="text-xs text-muted-foreground">
            Este es un documento oficial de B3TA. Confidencial y de uso exclusivo para {report.customers.name}.
          </p>
        </div>
      </main>
    </div>
  );
}
