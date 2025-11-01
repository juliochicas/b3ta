import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileText, Download, Mail, Image as ImageIcon, Video, ExternalLink, Copy, ExternalLinkIcon, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertDeleteDialog } from "@/components/ui/alert-delete-dialog";
import { CreateReportModal } from "./CreateReportModal";
import jsPDF from 'jspdf';

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
  lead_id: string | null;
  public_slug: string | null;
}

interface Media {
  id: string;
  type: string;
  url: string;
  is_external: boolean;
  caption: string | null;
}

interface Props {
  report: Report;
  onClose: () => void;
  onUpdate: () => void;
}

export const ReportDetailModal = ({ report, onClose, onUpdate }: Props) => {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadMedia();
  }, [report.id]);

  const loadMedia = async () => {
    const { data, error } = await supabase
      .from('report_media')
      .select('*')
      .eq('report_id', report.id);

    if (!error && data) {
      setMedia(data);
    }
  };

  const downloadPDF = async () => {
    try {
      setLoading(true);
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPos = 20;

      // Header with logo
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('B3TA', 20, yPos);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Consultoría Profesional', 20, yPos + 6);

      // Report number and date
      pdf.setFontSize(12);
      pdf.text(report.report_number, pageWidth - 70, yPos);
      pdf.setFontSize(10);
      pdf.text(new Date(report.created_at).toLocaleDateString('es-ES'), pageWidth - 70, yPos + 6);

      yPos += 25;
      pdf.setLineWidth(0.5);
      pdf.line(20, yPos, pageWidth - 20, yPos);
      yPos += 10;

      // Title
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('INFORME DE CONSULTORÍA PRE-VENTA', 20, yPos);
      yPos += 15;

      // Customer info
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Datos del Cliente:', 20, yPos);
      yPos += 7;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text(`Nombre: ${report.customers.name}`, 20, yPos);
      yPos += 5;
      pdf.text(`Email: ${report.customers.email}`, 20, yPos);
      yPos += 5;
      if (report.customers.company) {
        pdf.text(`Empresa: ${report.customers.company}`, 20, yPos);
        yPos += 5;
      }
      if (report.customers.phone) {
        pdf.text(`Teléfono: ${report.customers.phone}`, 20, yPos);
        yPos += 5;
      }
      yPos += 10;

      // Sections
      const addSection = (title: string, content: string | null) => {
        if (!content) return;
        
        if (yPos > pageHeight - 40) {
          pdf.addPage();
          yPos = 20;
        }

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(title, 20, yPos);
        yPos += 7;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        const lines = pdf.splitTextToSize(content, pageWidth - 40);
        lines.forEach((line: string) => {
          if (yPos > pageHeight - 20) {
            pdf.addPage();
            yPos = 20;
          }
          pdf.text(line, 20, yPos);
          yPos += 5;
        });
        yPos += 10;
      };

      if (report.sections_config.current_situation) {
        addSection('Análisis de Situación Actual:', report.current_situation);
      }
      if (report.sections_config.findings) {
        addSection('Hallazgos Principales:', report.findings);
      }
      if (report.sections_config.recommendations) {
        addSection('Recomendaciones:', report.recommendations);
      }
      if (report.sections_config.conclusions) {
        addSection('Conclusiones:', report.conclusions);
      }

      // Multimedia section
      if (report.sections_config.multimedia && media.length > 0) {
        if (yPos > pageHeight - 40) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Evidencia Multimedia:', 20, yPos);
        yPos += 7;
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        media.forEach((m) => {
          pdf.text(`• ${m.type === 'photo' ? 'Foto' : 'Video'}: ${m.caption || 'Sin descripción'}`, 25, yPos);
          yPos += 5;
          if (m.is_external) {
            pdf.textWithLink('Ver enlace', 30, yPos, { url: m.url });
            yPos += 5;
          }
          yPos += 3;
        });
        yPos += 10;
      }

      // Signature
      if (report.consultant_signature) {
        if (yPos > pageHeight - 60) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.setFont('helvetica', 'bold');
        pdf.text('Firma del Consultor:', 20, yPos);
        yPos += 10;
        
        const img = new window.Image();
        img.src = report.consultant_signature;
        await new Promise((resolve) => {
          img.onload = () => {
            pdf.addImage(img, 'PNG', 20, yPos, 80, 30);
            resolve(null);
          };
        });
        yPos += 35;
        pdf.setFont('helvetica', 'normal');
        pdf.text(report.consultant_name, 20, yPos);
      }

      // Footer on all pages
      const totalPages = pdf.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150);
        pdf.text('B3TA - Consultoría Profesional', 20, pageHeight - 10);
        pdf.text(`www.b3ta.com | info@b3ta.com`, pageWidth / 2 - 30, pageHeight - 10);
        pdf.text(`Página ${i} de ${totalPages}`, pageWidth - 40, pageHeight - 10);
      }

      pdf.save(`${report.report_number}.pdf`);
      toast({
        title: "PDF generado",
        description: "El informe se ha descargado correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo generar el PDF",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyPublicLink = () => {
    if (!report.public_slug) return;
    
    const url = `${window.location.origin}/informe/${report.public_slug}`;
    navigator.clipboard.writeText(url);
    
    if (report.status !== 'sent') {
      toast({
        title: "Link copiado (Inactivo)",
        description: "⚠️ El enlace solo funcionará cuando cambies el estado a 'Enviado'",
        variant: "default",
      });
    } else {
      toast({
        title: "Enlace copiado",
        description: "El enlace público ha sido copiado al portapapeles",
      });
    }
  };

  const openPublicReport = () => {
    if (!report.public_slug) return;
    
    if (report.status !== 'sent') {
      toast({
        title: "Informe no publicado",
        description: "Este informe debe estar en estado 'Enviado' para poder visualizarse públicamente.",
        variant: "destructive",
      });
      return;
    }
    
    window.open(`/informe/${report.public_slug}`, '_blank');
  };

  const sendReport = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('consultation_reports')
        .update({ status: 'sent' })
        .eq('id', report.id);

      if (error) throw error;

      toast({
        title: "Informe enviado",
        description: "El informe ahora está en estado 'Enviado' y el enlace público está activo",
      });
      
      onUpdate();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo enviar el informe",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async () => {
    try {
      setLoading(true);
      
      // Delete related media from storage first
      const { data: mediaFiles } = await supabase
        .from('report_media')
        .select('url, is_external')
        .eq('report_id', report.id);

      if (mediaFiles) {
        for (const mediaItem of mediaFiles) {
          if (!mediaItem.is_external) {
            // Extract path from public URL
            const urlParts = mediaItem.url.split('/');
            const path = urlParts.slice(-2).join('/');
            await supabase.storage
              .from('consultation-reports')
              .remove([path]);
          }
        }
      }

      // Delete media records
      await supabase
        .from('report_media')
        .delete()
        .eq('report_id', report.id);

      // Delete report
      const { error } = await supabase
        .from('consultation_reports')
        .delete()
        .eq('id', report.id);

      if (error) throw error;

      toast({
        title: "Informe eliminado",
        description: "El informe ha sido eliminado correctamente",
      });
      
      onUpdate();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el informe",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: "Borrador", variant: "secondary" as const, class: "bg-secondary/50" },
      completed: { label: "Completado", variant: "default" as const, class: "bg-primary/10 text-primary" },
      sent: { label: "Enviado", variant: "outline" as const, class: "bg-status-sent/10 text-status-sent border-status-sent/20" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge variant={config.variant} className={config.class}>{config.label}</Badge>;
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="space-y-4 pb-4 border-b">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-semibold">
                    {report.report_number}
                  </DialogTitle>
                  <span className="sr-only">Detalles completos del reporte de consultoría</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Creado el {new Date(report.created_at).toLocaleDateString('es-ES', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(report.status)}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            {report.status !== 'sent' && (
              <Button 
                onClick={sendReport}
                disabled={loading}
                className="bg-success hover:bg-success-hover text-primary-foreground"
              >
                <Mail className="mr-2 h-4 w-4" />
                Enviar Informe
              </Button>
            )}
            
            {report.public_slug && report.status === 'sent' && (
              <>
                <Button variant="outline" onClick={openPublicReport}>
                  <ExternalLinkIcon className="mr-2 h-4 w-4" />
                  Ver Público
                </Button>
                <Button variant="outline" onClick={copyPublicLink}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar Link
                </Button>
              </>
            )}
            
            {report.public_slug && report.status !== 'sent' && (
              <Button 
                variant="outline" 
                onClick={copyPublicLink}
                className="opacity-50"
              >
                <Copy className="mr-2 h-4 w-4" />
                Link Inactivo
              </Button>
            )}
            
            <div className="flex-1" />
            
            <Button variant="ghost" size="icon" onClick={() => setShowEditModal(true)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={downloadPDF} disabled={loading}>
              <Download className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowDeleteDialog(true)}
              disabled={loading}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="details" className="w-full h-full flex flex-col">
            <TabsList className="w-full justify-start border-b rounded-none h-12 p-0 bg-transparent px-6">
              <TabsTrigger 
                value="details" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4"
              >
                Detalles
              </TabsTrigger>
              <TabsTrigger 
                value="multimedia"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4"
              >
                Multimedia ({media.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="flex-1 space-y-8 mt-0 px-6 py-6">
              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold tracking-tight">Información del Cliente</h3>
                <div className="rounded-xl border bg-card/50 backdrop-blur p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nombre</p>
                      <p className="text-sm font-medium">{report.customers.name}</p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</p>
                      <p className="text-sm font-medium">{report.customers.email}</p>
                    </div>
                    {report.customers.company && (
                      <div className="space-y-1.5">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Empresa</p>
                        <p className="text-sm font-medium">{report.customers.company}</p>
                      </div>
                    )}
                    {report.customers.phone && (
                      <div className="space-y-1.5">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Teléfono</p>
                        <p className="text-sm font-medium">{report.customers.phone}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Report Sections */}
              {report.sections_config.current_situation && report.current_situation && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold tracking-tight">Análisis de Situación Actual</h3>
                  <div className="rounded-xl border bg-card/50 backdrop-blur p-6">
                    <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{report.current_situation}</p>
                  </div>
                </div>
              )}

              {report.sections_config.findings && report.findings && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold tracking-tight">Hallazgos Principales</h3>
                  <div className="rounded-xl border bg-card/50 backdrop-blur p-6">
                    <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{report.findings}</p>
                  </div>
                </div>
              )}

              {report.sections_config.recommendations && report.recommendations && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold tracking-tight">Recomendaciones</h3>
                  <div className="rounded-xl border bg-card/50 backdrop-blur p-6">
                    <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{report.recommendations}</p>
                  </div>
                </div>
              )}

              {report.sections_config.conclusions && report.conclusions && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold tracking-tight">Conclusiones</h3>
                  <div className="rounded-xl border bg-card/50 backdrop-blur p-6">
                    <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{report.conclusions}</p>
                  </div>
                </div>
              )}

              {/* Consultant Signature */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold tracking-tight">Consultor Responsable</h3>
                <div className="rounded-xl border bg-card/50 backdrop-blur p-6">
                  <div className="space-y-4">
                    <p className="text-sm font-semibold">{report.consultant_name}</p>
                    {report.consultant_signature && (
                      <div className="inline-block border rounded-lg p-4 bg-background/50">
                        <img src={report.consultant_signature} alt="Firma del consultor" className="h-20" loading="lazy" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="multimedia" className="flex-1 px-6 py-6 mt-0">
              {media.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 rounded-xl border bg-card/50 backdrop-blur">
                  <ImageIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No hay archivos multimedia</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {media.map((item) => (
                    <div 
                      key={item.id}
                      className="rounded-xl border bg-card/50 backdrop-blur p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          {item.type === 'photo' ? (
                            <ImageIcon className="h-5 w-5 text-primary" />
                          ) : (
                            <Video className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold mb-1">
                            {item.type === 'photo' ? 'Fotografía' : 'Video'}
                          </p>
                          {item.caption && (
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{item.caption}</p>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(item.url, '_blank')}
                            className="w-full"
                          >
                            {item.is_external ? (
                              <>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Abrir enlace
                              </>
                            ) : (
                              <>
                                <Download className="mr-2 h-4 w-4" />
                                Ver archivo
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>

      <AlertDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={deleteReport}
        title="¿Eliminar informe?"
        description="Esta acción no se puede deshacer. Se eliminará el informe y todos sus archivos multimedia asociados."
      />

      {showEditModal && (
        <CreateReportModal
          reportToEdit={report}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            onUpdate();
            onClose();
          }}
        />
      )}
    </Dialog>
  );
};
