"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, Send } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: string;
  customers: {
    name: string;
    email: string;
    company: string | null;
  };
  payment_status: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  currency: string;
  invoice_date: string;
  payment_date: string | null;
  due_date: string | null;
  notes: string | null;
  terms_conditions: string | null;
  created_at: string;
  sent_at: string | null;
}

interface InvoiceItem {
  id: string;
  item_name: string;
  description: string | null;
  quantity: number;
  unit_price: number;
  total: number;
}

interface Props {
  invoice: Invoice;
  onClose: () => void;
  onUpdate: () => void;
}

export const InvoiceDetailModal = ({ invoice, onClose, onUpdate }: Props) => {
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadItems();
  }, [invoice.id]);

  const loadItems = async () => {
    try {
      const { data, error } = await supabase
        .from('invoice_items')
        .select('*')
        .eq('invoice_id', invoice.id);

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

  const sendInvoiceEmail = async () => {
    setIsSending(true);
    try {
      const { error } = await supabase.functions.invoke('send-invoice-email', {
        body: { invoice_id: invoice.id }
      });

      if (error) throw error;

      toast({
        title: "Email enviado",
        description: `La factura ha sido enviada a ${invoice.customers.email}`,
      });
      
      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el email",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const downloadPDF = async () => {
    setIsDownloadingPDF(true);
    try {
      const { jsPDF } = await import('jspdf');

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let yPos = 20;

      // Header
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, pageWidth, 45, 'F');
      
      doc.setTextColor(99, 102, 241);
      doc.setFontSize(20);
      doc.setFont(undefined, 'bold');
      doc.text('B3TA', margin, 15);
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(24);
      doc.text(`Factura ${invoice.invoice_number}`, margin, 28);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Fecha: ${format(new Date(invoice.invoice_date), 'PPP', { locale: es })}`, margin, 36);
      if (invoice.due_date) {
        doc.text(`Vencimiento: ${format(new Date(invoice.due_date), 'PPP', { locale: es })}`, margin, 41);
      }
      
      yPos = 55;
      doc.setTextColor(0, 0, 0);
      yPos += 20;

      // Customer data
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('CLIENTE', margin, yPos);
      yPos += 7;
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(invoice.customers.name, margin, yPos);
      yPos += 5;
      if (invoice.customers.company) {
        doc.text(invoice.customers.company, margin, yPos);
        yPos += 5;
      }
      doc.text(invoice.customers.email, margin, yPos);
      yPos += 15;

      // Payment status
      doc.setFont(undefined, 'bold');
      doc.text('ESTADO: ', margin, yPos);
      doc.setFont(undefined, 'normal');
      const statusText = invoice.payment_status === 'paid' ? 'PAGADA' : 'PENDIENTE';
      const statusColor = invoice.payment_status === 'paid' ? [16, 185, 129] : [245, 158, 11];
      doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
      doc.text(statusText, margin + 20, yPos);
      doc.setTextColor(0, 0, 0);
      yPos += 15;

      // Items title
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('DETALLE DE PRODUCTOS/SERVICIOS', margin, yPos);
      yPos += 7;

      // Table header
      doc.setFillColor(248, 249, 250);
      doc.rect(margin, yPos - 5, contentWidth, 8, 'F');
      doc.setFontSize(9);
      doc.text('Producto/Servicio', margin + 2, yPos);
      doc.text('Cant.', margin + contentWidth * 0.6, yPos);
      doc.text('P. Unit.', margin + contentWidth * 0.75, yPos);
      doc.text('Total', margin + contentWidth * 0.9, yPos);
      yPos += 8;

      // Items
      doc.setFont(undefined, 'normal');
      doc.setFontSize(9);
      items.forEach((item) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(item.item_name.substring(0, 40), margin + 2, yPos);
        doc.text(String(item.quantity), margin + contentWidth * 0.6, yPos);
        doc.text(`$${item.unit_price.toFixed(2)}`, margin + contentWidth * 0.75, yPos);
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

      // Totals
      yPos += 10;
      doc.setFillColor(248, 249, 250);
      doc.rect(margin + contentWidth * 0.5, yPos - 5, contentWidth * 0.5, 30, 'F');

      doc.setFontSize(10);
      doc.text('Subtotal:', margin + contentWidth * 0.55, yPos);
      doc.text(
        `${invoice.currency} $${invoice.subtotal.toFixed(2)}`,
        margin + contentWidth * 0.92,
        yPos,
        { align: 'right' }
      );
      yPos += 6;

      doc.setTextColor(100, 100, 100);
      doc.text(`IVA (${invoice.tax_rate}%):`, margin + contentWidth * 0.55, yPos);
      doc.text(
        `${invoice.currency} $${invoice.tax_amount.toFixed(2)}`,
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
        `${invoice.currency} $${invoice.total.toFixed(2)}`,
        margin + contentWidth * 0.92,
        yPos,
        { align: 'right' }
      );

      // Notes
      if (invoice.notes) {
        yPos += 15;
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'bold');
        doc.setFontSize(10);
        doc.text('NOTAS:', margin, yPos);
        yPos += 6;
        doc.setFont(undefined, 'normal');
        doc.setFontSize(9);
        const notesLines = doc.splitTextToSize(invoice.notes, contentWidth);
        notesLines.forEach((line: string) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(line, margin, yPos);
          yPos += 5;
        });
      }

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, pageHeight - 30, pageWidth - margin, pageHeight - 30);
        
        doc.setFontSize(8);
        doc.setTextColor(80, 80, 80);
        doc.setFont(undefined, 'bold');
        doc.text('B3TA', margin, pageHeight - 23);
        
        doc.setFont(undefined, 'normal');
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        doc.text('hi@b3ta.us | consulting@b3ta.us | b3ta.us | +1 435 534 8065', margin, pageHeight - 18);
        doc.text('Consultoría en infraestructura, automatización y soluciones digitales', margin, pageHeight - 14);
        
        doc.setTextColor(150, 150, 150);
        doc.text('Gracias por su preferencia', pageWidth / 2, pageHeight - 10, { align: 'center' });
        doc.text(`Página ${i} de ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
      }

      doc.save(`Factura-${invoice.invoice_number}.pdf`);

      toast({
        title: 'PDF descargado',
        description: 'La factura se ha descargado exitosamente',
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: 'Error',
        description: 'No se pudo descargar el PDF',
        variant: 'destructive',
      });
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  const getStatusBadge = () => {
    switch (invoice.payment_status) {
      case 'paid':
        return <Badge className="bg-status-paid">Pagada</Badge>;
      case 'pending':
        return <Badge className="bg-status-pending">Pendiente</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Vencida</Badge>;
      default:
        return <Badge>{invoice.payment_status}</Badge>;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl mb-2">{invoice.invoice_number}</DialogTitle>
              {getStatusBadge()}
            </div>
            <span className="sr-only">Detalles de la factura y opciones de envío</span>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">Total</div>
              <div className="text-3xl font-bold text-primary">
                ${invoice.total.toFixed(2)} {invoice.currency}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Cliente</h3>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-foreground">{invoice.customers.name}</p>
              {invoice.customers.company && (
                <p className="text-muted-foreground">{invoice.customers.company}</p>
              )}
              <p className="text-muted-foreground">{invoice.customers.email}</p>
            </div>
            <div className="mt-4 pt-4 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fecha de emisión:</span>
                <span>{format(new Date(invoice.invoice_date), "PPP", { locale: es })}</span>
              </div>
              {invoice.due_date && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fecha de vencimiento:</span>
                  <span className="font-medium">
                    {format(new Date(invoice.due_date), "PPP", { locale: es })}
                  </span>
                </div>
              )}
              {invoice.payment_date && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fecha de pago:</span>
                  <span className="text-status-paid font-medium">
                    {format(new Date(invoice.payment_date), "PPP", { locale: es })}
                  </span>
                </div>
              )}
            </div>
          </Card>

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
                    <span className="font-semibold">${invoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>IVA ({invoice.tax_rate}%):</span>
                    <span>${invoice.tax_amount.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-primary">${invoice.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Notes */}
          {invoice.notes && (
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Notas</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {invoice.notes}
              </p>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={sendInvoiceEmail}
              disabled={isSending}
            >
              <Send className="mr-2 h-4 w-4" />
              {isSending ? 'Enviando...' : invoice.sent_at ? 'Reenviar Email' : 'Enviar al Cliente'}
            </Button>
            
            <Button 
              variant="secondary" 
              className="flex-1"
              onClick={downloadPDF}
              disabled={isDownloadingPDF}
            >
              <Download className="mr-2 h-4 w-4" />
              {isDownloadingPDF ? 'Generando PDF...' : 'Descargar PDF'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
