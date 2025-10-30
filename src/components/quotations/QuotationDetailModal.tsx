import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Send, ExternalLink, FileText, Download, Edit2, Save, X, Receipt, TrendingDown } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { InvoiceDetailModal } from "./InvoiceDetailModal";
import { ExpensesList } from "./ExpensesList";

interface Quotation {
  id: string;
  quotation_number: string;
  customer_name: string;
  customer_email: string;
  customer_company: string | null;
  status: string;
  subtotal: number;
  discount_percentage: number;
  discount_amount: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  currency: string;
  valid_until: string | null;
  tracking_number: string | null;
  notes: string | null;
  terms_conditions: string | null;
  stripe_payment_link: string | null;
  created_at: string;
  sent_at: string | null;
}

interface QuotationItem {
  id: string;
  item_name: string;
  description: string | null;
  quantity: number;
  unit_price: number;
  discount_percentage: number;
  total: number;
}

interface Props {
  quotation: Quotation;
  onClose: () => void;
  onUpdate: () => void;
}

export const QuotationDetailModal = ({ quotation, onClose, onUpdate }: Props) => {
  const [items, setItems] = useState<QuotationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingPaymentLink, setIsCreatingPaymentLink] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [isEditingTracking, setIsEditingTracking] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState(quotation.tracking_number || "");
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [relatedInvoice, setRelatedInvoice] = useState<any>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadItems();
    loadRelatedInvoice();
  }, [quotation.id]);

  const loadItems = async () => {
    try {
      const { data, error } = await supabase
        .from('quotation_items')
        .select('*')
        .eq('quotation_id', quotation.id);

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadRelatedInvoice = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('quotation_id', quotation.id)
        .maybeSingle();

      if (error) throw error;
      setRelatedInvoice(data);
    } catch (error) {
      console.error("Error loading invoice:", error);
    }
  };

  const createStripePaymentLink = async () => {
    setIsCreatingPaymentLink(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-quotation-payment-link', {
        body: { quotation_id: quotation.id }
      });

      if (error) throw error;

      toast({
        title: "Link de pago creado",
        description: "El link de pago ha sido generado exitosamente",
      });
      
      onUpdate();
    } catch (error) {
      console.error("Error creating payment link:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el link de pago",
        variant: "destructive",
      });
    } finally {
      setIsCreatingPaymentLink(false);
    }
  };

  const updateTrackingNumber = async () => {
    try {
      const { error } = await supabase
        .from('quotations')
        .update({ tracking_number: trackingNumber || null })
        .eq('id', quotation.id);

      if (error) throw error;

      toast({
        title: "Tracking actualizado",
        description: "El número de tracking se ha actualizado exitosamente",
      });
      
      setIsEditingTracking(false);
      onUpdate();
    } catch (error) {
      console.error("Error updating tracking:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el tracking",
        variant: "destructive",
      });
    }
  };

  const sendQuotationEmail = async () => {
    try {
      const { error } = await supabase.functions.invoke('send-quotation-email', {
        body: { quotation_id: quotation.id }
      });

      if (error) throw error;

      toast({
        title: "Email enviado",
        description: `La cotización ha sido enviada a ${quotation.customer_email}`,
      });
      
      onUpdate();
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Error",
        description: "No se pudo enviar el email",
        variant: "destructive",
      });
    }
  };

  const createInvoice = async () => {
    setIsCreatingInvoice(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-invoice-from-payment', {
        body: { quotation_id: quotation.id }
      });

      if (error) throw error;

      toast({
        title: "Factura creada",
        description: `La factura ${data.invoice_number} ha sido generada exitosamente`,
      });
      
      loadRelatedInvoice();
      onUpdate();
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la factura",
        variant: "destructive",
      });
    } finally {
      setIsCreatingInvoice(false);
    }
  };

  const downloadPDF = async () => {
    setIsDownloadingPDF(true);
    try {
      // Cargar gastos
      const { data: expensesData } = await supabase
        .from('quotation_expenses')
        .select('*')
        .eq('quotation_id', quotation.id)
        .order('expense_date', { ascending: false });
      
      const expenses = expensesData || [];
      const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount.toString()), 0);
      const netProfit = quotation.total - totalExpenses;

      // Generación 100% en el navegador con jsPDF (sin llamar funciones backend)
      const { jsPDF } = await import('jspdf');

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let yPos = 20;

      // Encabezado con fondo blanco
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, pageWidth, 45, 'F');
      
      // Nombre de la empresa
      doc.setTextColor(99, 102, 241);
      doc.setFontSize(20);
      doc.setFont(undefined, 'bold');
      doc.text('B3TA', margin, 15);
      
      // Texto del encabezado
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(24);
      doc.text(`Cotización ${quotation.quotation_number}`, margin, 28);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Válida hasta: ${quotation.valid_until ? format(new Date(quotation.valid_until), 'PPP', { locale: es }) : 'No especificado'}`,
        margin,
        36
      );
      doc.text(`Fecha: ${format(new Date(quotation.created_at), 'PPP', { locale: es })}`, margin, 41);
      
      yPos = 55;

      // Reset de color
      doc.setTextColor(0, 0, 0);
      yPos += 20;

      // Datos del cliente
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('CLIENTE', margin, yPos);
      yPos += 7;
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(quotation.customer_name, margin, yPos);
      yPos += 5;
      if (quotation.customer_company) {
        doc.text(quotation.customer_company, margin, yPos);
        yPos += 5;
      }
      doc.text(quotation.customer_email, margin, yPos);
      yPos += 5;
      
      // Tracking number if available
      if (quotation.tracking_number) {
        doc.setFont(undefined, 'bold');
        doc.text('Tracking: ', margin, yPos);
        doc.setFont(undefined, 'normal');
        doc.text(quotation.tracking_number, margin + 20, yPos);
        yPos += 5;
      }
      
      yPos += 10;

      // Título de items
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('DETALLE DE PRODUCTOS/SERVICIOS', margin, yPos);
      yPos += 7;

      // Header de tabla
      doc.setFillColor(248, 249, 250);
      doc.rect(margin, yPos - 5, contentWidth, 8, 'F');
      doc.setFontSize(9);
      doc.text('Producto/Servicio', margin + 2, yPos);
      doc.text('Cant.', margin + contentWidth * 0.55, yPos);
      doc.text('P. Unit.', margin + contentWidth * 0.68, yPos);
      doc.text('Desc.', margin + contentWidth * 0.8, yPos);
      doc.text('Total', margin + contentWidth * 0.9, yPos);
      yPos += 8;

      // Filas
      doc.setFont(undefined, 'normal');
      doc.setFontSize(9);
      items.forEach((item) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(item.item_name.substring(0, 35), margin + 2, yPos);
        doc.text(String(item.quantity), margin + contentWidth * 0.55, yPos);
        doc.text(`$${item.unit_price.toFixed(2)}`, margin + contentWidth * 0.68, yPos);
        doc.text(item.discount_percentage > 0 ? `${item.discount_percentage}%` : '-', margin + contentWidth * 0.8, yPos);
        doc.text(`$${item.total.toFixed(2)}`, margin + contentWidth * 0.9, yPos);
        yPos += 6;

        if (item.description) {
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          const descLines = doc.splitTextToSize(item.description, contentWidth * 0.55);
          descLines.forEach((line: string) => {
            if (yPos > 270) {
              doc.addPage();
              yPos = 20;
            }
            doc.text(line, margin + 4, yPos);
            yPos += 4;
          });
          doc.setFontSize(9);
          doc.setTextColor(0, 0, 0);
        }
        yPos += 2;
      });

      // Totales
      yPos += 10;
      const totalsSectionHeight = quotation.discount_percentage > 0 ? 40 : 30;
      doc.setFillColor(248, 249, 250);
      doc.rect(margin + contentWidth * 0.5, yPos - 5, contentWidth * 0.5, totalsSectionHeight, 'F');

      doc.setFontSize(10);
      doc.text('Subtotal:', margin + contentWidth * 0.55, yPos);
      doc.text(
        `${quotation.currency} $${quotation.subtotal.toFixed(2)}`,
        margin + contentWidth * 0.92,
        yPos,
        { align: 'right' }
      );
      yPos += 6;

      // Mostrar descuento global si existe
      if (quotation.discount_percentage > 0) {
        doc.setTextColor(220, 38, 38);
        doc.text(`Descuento Global (${quotation.discount_percentage}%):`, margin + contentWidth * 0.55, yPos);
        doc.text(
          `-${quotation.currency} $${quotation.discount_amount.toFixed(2)}`,
          margin + contentWidth * 0.92,
          yPos,
          { align: 'right' }
        );
        yPos += 6;

        doc.setTextColor(0, 0, 0);
        doc.text('Subtotal con Descuento:', margin + contentWidth * 0.55, yPos);
        doc.text(
          `${quotation.currency} $${(quotation.subtotal - quotation.discount_amount).toFixed(2)}`,
          margin + contentWidth * 0.92,
          yPos,
          { align: 'right' }
        );
        yPos += 6;
      }

      doc.setTextColor(100, 100, 100);
      doc.text(`IVA (${quotation.tax_rate}%):`, margin + contentWidth * 0.55, yPos);
      doc.text(
        `${quotation.currency} $${quotation.tax_amount.toFixed(2)}`,
        margin + contentWidth * 0.92,
        yPos,
        { align: 'right' }
      );
      yPos += 8;

      doc.setDrawColor(99, 102, 241);
      doc.line(margin + contentWidth * 0.55, yPos - 2, margin + contentWidth * 0.95, yPos - 2);

      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(99, 102, 241);
      doc.text('Total:', margin + contentWidth * 0.55, yPos);
      doc.text(
        `${quotation.currency} $${quotation.total.toFixed(2)}`,
        margin + contentWidth * 0.92,
        yPos,
        { align: 'right' }
      );

      // Notas y términos
      if (quotation.notes || quotation.terms_conditions) {
        yPos += 15;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');

        if (quotation.notes) {
          if (yPos > 250) {
            doc.addPage();
            yPos = 20;
          }
          doc.setFont(undefined, 'bold');
          doc.text('NOTAS:', margin, yPos);
          yPos += 6;
          doc.setFont(undefined, 'normal');
          doc.setFontSize(9);
          const notesLines = doc.splitTextToSize(quotation.notes, contentWidth);
          notesLines.forEach((line: string) => {
            if (yPos > 270) {
              doc.addPage();
              yPos = 20;
            }
            doc.text(line, margin, yPos);
            yPos += 5;
          });
          yPos += 5;
        }

        if (quotation.terms_conditions) {
          if (yPos > 250) {
            doc.addPage();
            yPos = 20;
          }
          doc.setFontSize(10);
          doc.setFont(undefined, 'bold');
          doc.text('TÉRMINOS Y CONDICIONES:', margin, yPos);
          yPos += 6;
          doc.setFont(undefined, 'normal');
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          const termsLines = doc.splitTextToSize(quotation.terms_conditions, contentWidth);
          termsLines.forEach((line: string) => {
            if (yPos > 270) {
              doc.addPage();
              yPos = 20;
            }
            doc.text(line, margin, yPos);
            yPos += 4;
          });
          doc.setTextColor(0, 0, 0);
        }
      }

      // Sección de Gastos (si existen)
      if (expenses.length > 0) {
        yPos += 15;
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('ANÁLISIS FINANCIERO', margin, yPos);
        yPos += 10;

        // Resumen financiero
        doc.setFillColor(248, 249, 250);
        doc.rect(margin, yPos - 5, contentWidth, 30, 'F');
        
        doc.setFontSize(10);
        doc.text('Ingresos Totales:', margin + 2, yPos);
        doc.text(`${quotation.currency} $${quotation.total.toFixed(2)}`, margin + contentWidth * 0.7, yPos, { align: 'right' });
        yPos += 7;

        doc.setTextColor(220, 38, 38);
        doc.text('Gastos Totales:', margin + 2, yPos);
        doc.text(`${quotation.currency} $${totalExpenses.toFixed(2)}`, margin + contentWidth * 0.7, yPos, { align: 'right' });
        yPos += 7;

        doc.setDrawColor(99, 102, 241);
        doc.line(margin + 2, yPos - 2, margin + contentWidth * 0.7, yPos - 2);
        yPos += 2;

        doc.setTextColor(netProfit >= 0 ? 34 : 220, netProfit >= 0 ? 197 : 38, netProfit >= 0 ? 94 : 38);
        doc.setFont(undefined, 'bold');
        doc.setFontSize(12);
        doc.text('Utilidad Neta:', margin + 2, yPos);
        doc.text(`${quotation.currency} $${netProfit.toFixed(2)}`, margin + contentWidth * 0.7, yPos, { align: 'right' });
        yPos += 7;

        const profitMargin = quotation.total > 0 ? (netProfit / quotation.total) * 100 : 0;
        doc.setFontSize(9);
        doc.setTextColor(99, 102, 241);
        doc.text(`Margen: ${profitMargin.toFixed(1)}%`, margin + 2, yPos);
        yPos += 10;

        // Lista de gastos
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text('DETALLE DE GASTOS:', margin, yPos);
        yPos += 7;

        doc.setFontSize(8);
        doc.setFillColor(248, 249, 250);
        doc.rect(margin, yPos - 5, contentWidth, 6, 'F');
        doc.text('Fecha', margin + 2, yPos);
        doc.text('Descripción', margin + contentWidth * 0.2, yPos);
        doc.text('Monto', margin + contentWidth * 0.85, yPos);
        yPos += 6;

        doc.setFont(undefined, 'normal');
        expenses.forEach((expense) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }

          doc.text(format(new Date(expense.expense_date), 'dd/MM/yyyy'), margin + 2, yPos);
          const descText = expense.description.substring(0, 50);
          doc.text(descText, margin + contentWidth * 0.2, yPos);
          doc.text(`$${parseFloat(expense.amount.toString()).toFixed(2)}`, margin + contentWidth * 0.85, yPos);
          yPos += 5;
        });
      }

      // Footer con información de la empresa
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        // Línea separadora
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, pageHeight - 30, pageWidth - margin, pageHeight - 30);
        
        // Información de la empresa
        doc.setFontSize(8);
        doc.setTextColor(80, 80, 80);
        doc.setFont(undefined, 'bold');
        doc.text('B3TA', margin, pageHeight - 23);
        
        doc.setFont(undefined, 'normal');
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        doc.text('consulting@b3ta.us | b3ta.us | +1 435 534 8065', margin, pageHeight - 18);
        doc.text('Consultoría en infraestructura, automatización y soluciones digitales', margin, pageHeight - 14);
        
        // Número de página y agradecimiento
        doc.setTextColor(150, 150, 150);
        doc.text('Gracias por su preferencia', pageWidth / 2, pageHeight - 10, { align: 'center' });
        doc.text(`Página ${i} de ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
      }

      doc.save(`Cotizacion-${quotation.quotation_number}.pdf`);

      toast({
        title: 'PDF descargado',
        description: 'La cotización se ha descargado exitosamente',
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: 'Error',
        description:
          'No se pudo descargar el PDF. Asegúrate de no tener bloqueadores y vuelve a intentar.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl mb-2">{quotation.quotation_number}</DialogTitle>
              <Badge>
                {quotation.status === 'draft' ? 'Borrador' :
                 quotation.status === 'sent' ? 'Enviada' :
                 quotation.status === 'accepted' ? 'Aceptada' :
                 quotation.status === 'rejected' ? 'Rechazada' : 'Expirada'}
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">Total</div>
              <div className="text-3xl font-bold text-primary">
                ${quotation.total.toFixed(2)} {quotation.currency}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Cliente */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Cliente</h3>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-foreground">{quotation.customer_name}</p>
              {quotation.customer_company && (
                <p className="text-muted-foreground">{quotation.customer_company}</p>
              )}
              <p className="text-muted-foreground">{quotation.customer_email}</p>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fecha de creación:</span>
                <span>{format(new Date(quotation.created_at), "PPP", { locale: es })}</span>
              </div>
              {quotation.valid_until && (
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-muted-foreground">Válida hasta:</span>
                  <span className="font-medium">
                    {format(new Date(quotation.valid_until), "PPP", { locale: es })}
                  </span>
                </div>
              )}
              
              {/* Tracking Number */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-muted-foreground">Número de Tracking:</Label>
                  {!isEditingTracking ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {quotation.tracking_number || "No asignado"}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditingTracking(true)}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Input
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="TRK-12345"
                        className="h-8 w-40"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={updateTrackingNumber}
                      >
                        <Save className="h-3 w-3 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setTrackingNumber(quotation.tracking_number || "");
                          setIsEditingTracking(false);
                        }}
                      >
                        <X className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Tabs para Detalles y Gastos */}
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">
                <FileText className="mr-2 h-4 w-4" />
                Detalles
              </TabsTrigger>
              <TabsTrigger value="expenses">
                <TrendingDown className="mr-2 h-4 w-4" />
                Gastos y Utilidad
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              {/* Items */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Detalles</h3>
                {isLoading ? (
                  <p className="text-center text-muted-foreground">Cargando items...</p>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between items-start pb-3 border-b last:border-0">
                        <div className="flex-1">
                          <p className="font-medium">{item.item_name}</p>
                          {item.description && (
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          )}
                          <p className="text-sm text-muted-foreground mt-1">
                            Cantidad: {item.quantity} × ${item.unit_price.toFixed(2)}
                            {item.discount_percentage > 0 && (
                              <span className="text-destructive ml-2">
                                (-{item.discount_percentage}% desc.)
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="text-right font-semibold">
                          ${item.total.toFixed(2)}
                        </div>
                      </div>
                    ))}

                    <Separator className="my-4" />

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-semibold">${quotation.subtotal.toFixed(2)}</span>
                      </div>
                      {quotation.discount_percentage > 0 && (
                        <div className="flex justify-between text-destructive">
                          <span>Descuento Global ({quotation.discount_percentage}%):</span>
                          <span>-${quotation.discount_amount.toFixed(2)}</span>
                        </div>
                      )}
                      {quotation.discount_percentage > 0 && (
                        <div className="flex justify-between">
                          <span>Subtotal con Descuento:</span>
                          <span className="font-semibold">${(quotation.subtotal - quotation.discount_amount).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-muted-foreground">
                        <span>IVA ({quotation.tax_rate}%):</span>
                        <span>${quotation.tax_amount.toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-primary">${quotation.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </Card>

              {/* Notas y términos */}
              {quotation.notes && (
                <Card className="p-6">
                  <h3 className="font-semibold mb-2">Notas</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {quotation.notes}
                  </p>
                </Card>
              )}

              {quotation.terms_conditions && (
                <Card className="p-6">
                  <h3 className="font-semibold mb-2">Términos y Condiciones</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {quotation.terms_conditions}
                  </p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="expenses">
              <ExpensesList
                quotationId={quotation.id}
                currency={quotation.currency}
                totalRevenue={quotation.total}
              />
            </TabsContent>
          </Tabs>

          {/* Acciones */}
          <div className="space-y-3">
            <div className="flex gap-3">
              {quotation.stripe_payment_link ? (
                <Button
                  className="flex-1"
                  onClick={() => window.open(quotation.stripe_payment_link!, '_blank')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Ver Link de Pago
                </Button>
              ) : (
                <Button
                  className="flex-1"
                  onClick={createStripePaymentLink}
                  disabled={isCreatingPaymentLink}
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  {isCreatingPaymentLink ? 'Creando...' : 'Crear Link de Pago'}
                </Button>
              )}
              
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={sendQuotationEmail}
                disabled={quotation.status === 'sent'}
              >
                <Send className="mr-2 h-4 w-4" />
                {quotation.status === 'sent' ? 'Email Enviado' : 'Enviar al Cliente'}
              </Button>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                className="flex-1"
                onClick={downloadPDF}
                disabled={isDownloadingPDF}
              >
                <Download className="mr-2 h-4 w-4" />
                {isDownloadingPDF ? 'Generando PDF...' : 'Descargar PDF'}
              </Button>

              {relatedInvoice ? (
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => setShowInvoice(true)}
                >
                  <Receipt className="mr-2 h-4 w-4" />
                  Ver Factura
                </Button>
              ) : (
                <Button 
                  className="flex-1"
                  onClick={createInvoice}
                  disabled={isCreatingInvoice}
                >
                  <Receipt className="mr-2 h-4 w-4" />
                  {isCreatingInvoice ? 'Generando...' : 'Generar Factura'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>

      {showInvoice && relatedInvoice && (
        <InvoiceDetailModal
          invoice={relatedInvoice}
          onClose={() => setShowInvoice(false)}
          onUpdate={() => {
            loadRelatedInvoice();
            onUpdate();
          }}
        />
      )}
    </Dialog>
  );
};
