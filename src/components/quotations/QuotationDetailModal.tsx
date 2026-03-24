import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Send, ExternalLink, FileText, Download, Edit2, Save, X, Receipt, TrendingDown, Edit, Trash2, Plus } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { InvoiceDetailModal } from "./InvoiceDetailModal";
import { ExpensesList } from "./ExpensesList";
import { TermsAIAssistant } from "./TermsAIAssistant";
import { EditQuotationItemModal } from "./EditQuotationItemModal";
import { AddQuotationItemModal } from "./AddQuotationItemModal";
import { formatCurrencyDisplay, formatCurrencyForPDF } from "@/lib/currency";

interface Quotation {
  id: string;
  quotation_number: string;
  customer_id: string;
  customers: {
    name: string;
    email: string;
    company: string | null;
  };
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
  tags: string[] | null;
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
  defaultEditMode?: boolean;
}

export const QuotationDetailModal = ({ quotation, onClose, onUpdate, defaultEditMode = false }: Props) => {
  const [items, setItems] = useState<QuotationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingPaymentLink, setIsCreatingPaymentLink] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [isDownloadingFinancialPDF, setIsDownloadingFinancialPDF] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  
  // States for Global Edit
  const initialExchangeTag = quotation.tags?.find(tag => tag.startsWith("exchange:"));
  const [initialExchangeRate, initialSecondaryCurrency] = initialExchangeTag ? initialExchangeTag.split(":").slice(1) : ["", ""];

  const [isEditingGlobals, setIsEditingGlobals] = useState(defaultEditMode);
  const [globalData, setGlobalData] = useState({
    customer_name: quotation.customers.name,
    customer_email: quotation.customers.email,
    customer_company: quotation.customers.company || "",
    valid_until: quotation.valid_until || "",
    currency: quotation.currency,
    tax_rate: quotation.tax_rate.toString(),
    discount_percentage: quotation.discount_percentage.toString(),
    exchange_rate: initialExchangeRate || "",
    secondary_currency: initialSecondaryCurrency || ""
  });

  const [isEditingTracking, setIsEditingTracking] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState(quotation.tracking_number || "");
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [tags, setTags] = useState((quotation.tags || []).join(", "));
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(quotation.notes || "");
  const [isEditingTerms, setIsEditingTerms] = useState(false);
  const [termsConditions, setTermsConditions] = useState(quotation.terms_conditions || "");
  const initialBankTag = quotation.tags?.find((t: string) => t.startsWith("bank:"));
  const initialBank = initialBankTag ? decodeURIComponent(initialBankTag.substring(5)) : "";
  const [bankAccounts, setBankAccounts] = useState(initialBank);
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [relatedInvoice, setRelatedInvoice] = useState<any>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [stripePaymentLink, setStripePaymentLink] = useState(quotation.stripe_payment_link);
  const [editingItem, setEditingItem] = useState<QuotationItem | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadItems();
    loadRelatedInvoice();
  }, [quotation.id]);

  useEffect(() => {
    setStripePaymentLink(quotation.stripe_payment_link);
  }, [quotation.stripe_payment_link]);

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
      // Error silencioso - no mostrar toast
    }
  };

  const createStripePaymentLink = async () => {
    setIsCreatingPaymentLink(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-quotation-payment-link', {
        body: { quotation_id: quotation.id }
      });

      if (error) throw error;

      // Actualizar el estado local inmediatamente con el nuevo link
      if (data?.url) {
        setStripePaymentLink(data.url);
      }

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

  const updateTags = async () => {
    try {
      const tagsArray = tags
        ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];

      const { error } = await supabase
        .from('quotations')
        .update({ tags: tagsArray })
        .eq('id', quotation.id);

      if (error) throw error;

      toast({
        title: "Tags actualizados",
        description: "Los tags se han actualizado exitosamente",
      });
      
      setIsEditingTags(false);
      onUpdate();
    } catch (error) {
      console.error("Error updating tags:", error);
      toast({
        title: "Error",
        description: "No se pudieron actualizar los tags",
        variant: "destructive",
      });
    }
  };

  const updateNotes = async () => {
    try {
      const { error } = await supabase
        .from('quotations')
        .update({ notes: notes || null })
        .eq('id', quotation.id);

      if (error) throw error;

      toast({
        title: "Comentarios actualizados",
        description: "Los comentarios se han actualizado exitosamente",
      });
      
      setIsEditingNotes(false);
      onUpdate();
    } catch (error) {
      console.error("Error updating notes:", error);
      toast({
        title: "Error",
        description: "No se pudieron actualizar los comentarios",
        variant: "destructive",
      });
    }
  };

  const updateTermsConditions = async () => {
    try {
      const { error } = await supabase
        .from('quotations')
        .update({ terms_conditions: termsConditions || null })
        .eq('id', quotation.id);

      if (error) throw error;

      toast({
        title: "Términos actualizados",
        description: "Los términos y condiciones se han actualizado exitosamente",
      });
      
      setIsEditingTerms(false);
      onUpdate();
    } catch (error) {
      console.error("Error updating terms:", error);
      toast({
        title: "Error",
        description: "No se pudieron actualizar los términos y condiciones",
        variant: "destructive",
      });
    }
  };

  const updateBankAccounts = async () => {
    try {
      const currentTags = quotation.tags || [];
      const nonBankTags = currentTags.filter((t: string) => !t.startsWith("bank:"));
      
      let newTags = [...nonBankTags];
      if (bankAccounts.trim()) {
        newTags.push(`bank:${encodeURIComponent(bankAccounts.trim())}`);
      }
      
      const { error } = await supabase
        .from('quotations')
        .update({ tags: newTags })
        .eq('id', quotation.id);
        
      if (error) throw error;
      
      toast({
        title: "Cuentas guardadas",
        description: "Las cuentas bancarias se han actualizado exitosamente.",
        className: "bg-success text-success-foreground"
      });
      setIsEditingBank(false);
      onUpdate();
    } catch (error) {
      console.error("Error updating bank accounts:", error);
      toast({
        title: "Error",
        description: "No se pudieron guardar las cuentas",
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
        description: `La cotización ha sido enviada a ${quotation.customers.email}`,
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
      // Generación 100% en el navegador con jsPDF (sin llamar funciones backend)
      const { jsPDF } = await import('jspdf');

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let yPos = 0;

      const brandBlue: [number, number, number] = [43, 79, 224];
      const brandCyan: [number, number, number] = [0, 201, 167];
      const brandDark: [number, number, number] = [26, 31, 46];

      // ── BRANDED HEADER ──
      doc.setFillColor(...brandDark);
      doc.rect(0, 0, pageWidth, 48, 'F');
      doc.setFillColor(...brandCyan);
      doc.rect(0, 48, pageWidth, 2, 'F');

      // Logo
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont(undefined!, 'bold');
      doc.text('B3TA', margin, 18);
      doc.setFontSize(8);
      doc.setFont(undefined!, 'normal');
      doc.setTextColor(180, 200, 220);
      doc.text('Tecnologia que escala contigo', margin, 24);

      // Quotation number
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont(undefined!, 'bold');
      doc.text(`Cotizacion ${quotation.quotation_number}`, margin, 35);
      doc.setFontSize(9);
      doc.setFont(undefined!, 'normal');
      doc.setTextColor(180, 200, 220);
      doc.text(
        `Valida hasta: ${quotation.valid_until ? format(new Date(quotation.valid_until), 'PPP', { locale: es }) : 'No especificado'}`,
        margin, 41
      );
      doc.text(`Fecha: ${format(new Date(quotation.created_at), 'PPP', { locale: es })}`, pageWidth - margin, 41, { align: 'right' });

      yPos = 60;

      // Client info
      doc.setTextColor(...brandBlue);
      doc.setFontSize(12);
      doc.setFont(undefined!, 'bold');
      doc.text('CLIENTE', margin, yPos);
      yPos += 7;
      doc.setFontSize(10);
      doc.setFont(undefined!, 'normal');
      doc.setTextColor(...brandDark);
      doc.text(quotation.customers.name, margin, yPos);
      yPos += 5;
      if (quotation.customers.company) {
        doc.text(quotation.customers.company, margin, yPos);
        yPos += 5;
      }
      doc.setTextColor(100, 100, 100);
      doc.text(quotation.customers.email, margin, yPos);
      yPos += 5;
      if (quotation.tracking_number) {
        doc.setFont(undefined!, 'bold');
        doc.setTextColor(...brandDark);
        doc.text('Tracking: ', margin, yPos);
        doc.setFont(undefined!, 'normal');
        doc.text(quotation.tracking_number, margin + 20, yPos);
        yPos += 5;
      }
      yPos += 8;

      // Items title with accent bar
      doc.setFillColor(...brandBlue);
      doc.rect(margin, yPos - 3, 3, 8, 'F');
      doc.setFontSize(12);
      doc.setFont(undefined!, 'bold');
      doc.setTextColor(...brandDark);
      doc.text('DETALLE DE PRODUCTOS/SERVICIOS', margin + 6, yPos + 2);
      yPos += 12;

      // Table header
      doc.setFillColor(235, 240, 255);
      doc.rect(margin, yPos - 5, contentWidth, 8, 'F');
      doc.setFontSize(9);
      doc.setFont(undefined!, 'bold');
      doc.setTextColor(...brandDark);
      doc.text('Producto/Servicio', margin + 2, yPos);
      doc.text('Cant.', margin + contentWidth * 0.55, yPos);
      doc.text('P. Unit.', margin + contentWidth * 0.68, yPos);
      doc.text('Desc.', margin + contentWidth * 0.8, yPos);
      doc.text('Total', margin + contentWidth * 0.9, yPos);
      yPos += 8;

      // Rows
      doc.setFont(undefined!, 'normal');
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      items.forEach((item) => {
        if (yPos > 255) { doc.addPage(); yPos = 20; }
        doc.text(item.item_name.substring(0, 35), margin + 2, yPos);
        doc.text(String(item.quantity), margin + contentWidth * 0.55, yPos);
        doc.text(`${formatCurrencyForPDF(item.unit_price, quotation.currency)}`, margin + contentWidth * 0.68, yPos);
        doc.text(item.discount_percentage > 0 ? `${item.discount_percentage}%` : '-', margin + contentWidth * 0.8, yPos);
        doc.text(`${formatCurrencyForPDF(item.total, quotation.currency)}`, margin + contentWidth * 0.9, yPos);
        yPos += 6;

        if (item.description) {
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          const descLines = doc.splitTextToSize(item.description, contentWidth * 0.55);
          descLines.forEach((line: string) => {
            if (yPos > 255) { doc.addPage(); yPos = 20; }
            doc.text(line, margin + 4, yPos);
            yPos += 4;
          });
          doc.setFontSize(9);
          doc.setTextColor(60, 60, 60);
        }
        yPos += 2;
      });

      // Totals
      yPos += 8;
      const totalsX = margin + contentWidth * 0.5;
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text('Subtotal:', totalsX + 5, yPos);
      doc.text(`${formatCurrencyForPDF(quotation.subtotal, quotation.currency)}`, margin + contentWidth * 0.92, yPos, { align: 'right' });
      yPos += 6;

      if (quotation.discount_percentage > 0) {
        doc.setTextColor(220, 38, 38);
        doc.text(`Descuento (${quotation.discount_percentage}%):`, totalsX + 5, yPos);
        doc.text(`-${formatCurrencyForPDF(quotation.discount_amount, quotation.currency)}`, margin + contentWidth * 0.92, yPos, { align: 'right' });
        yPos += 6;
        doc.setTextColor(60, 60, 60);
        doc.text('Subtotal con Descuento:', totalsX + 5, yPos);
        doc.text(`${formatCurrencyForPDF(quotation.subtotal - quotation.discount_amount, quotation.currency)}`, margin + contentWidth * 0.92, yPos, { align: 'right' });
        yPos += 6;
      }

      doc.setTextColor(100, 100, 100);
      doc.text(`IVA (${quotation.tax_rate}%):`, totalsX + 5, yPos);
      doc.text(`${formatCurrencyForPDF(quotation.tax_amount, quotation.currency)}`, margin + contentWidth * 0.92, yPos, { align: 'right' });
      yPos += 8;

      // Total box
      const exTag = quotation.tags?.find((tag: string) => tag.startsWith("exchange:"));
      let rate = 0;
      let targetCurrency = "";
      if (exTag) {
        const [, r, c] = exTag.split(":");
        rate = parseFloat(r);
        if (!isNaN(rate) && rate > 0 && c) {
          targetCurrency = c;
        }
      }

      const hasExchange = rate > 0 && targetCurrency !== "";
      const boxHeight = hasExchange ? 24 : 16;

      doc.setFillColor(...brandDark);
      doc.roundedRect(totalsX, yPos - 5, contentWidth * 0.5, boxHeight, 2, 2, 'F');
      doc.setFillColor(...brandCyan);
      doc.rect(totalsX, yPos - 5, 3, boxHeight, 'F');
      
      doc.setTextColor(180, 200, 220);
      doc.setFontSize(10);
      doc.setFont(undefined!, 'normal');
      doc.text('Total:', totalsX + 8, yPos + 2);
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont(undefined!, 'bold');
      doc.text(`${formatCurrencyForPDF(quotation.total, quotation.currency)}`, totalsX + 8, yPos + 9);

      if (hasExchange) {
        doc.setFontSize(9);
        doc.setTextColor(...brandCyan);
        doc.setFont(undefined!, 'bold');
        doc.text(`Equivalente: ${formatCurrencyForPDF(quotation.total * rate, targetCurrency)} (${rate} ${targetCurrency}/${quotation.currency})`, totalsX + 8, yPos + 16);
      }
      
      yPos += 24;

      // Notes & Terms
      if (quotation.notes || quotation.terms_conditions) {
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont(undefined!, 'normal');

        if (quotation.notes) {
          if (yPos > 240) { doc.addPage(); yPos = 20; }
          doc.setFillColor(...brandBlue);
          doc.rect(margin, yPos - 3, 3, 8, 'F');
          doc.setFont(undefined!, 'bold');
          doc.setTextColor(...brandDark);
          doc.text('NOTAS', margin + 6, yPos + 2);
          yPos += 10;
          doc.setFont(undefined!, 'normal');
          doc.setFontSize(9);
          doc.setTextColor(60, 60, 60);
          const notesLines = doc.splitTextToSize(quotation.notes, contentWidth);
          notesLines.forEach((line: string) => {
            if (yPos > 255) { doc.addPage(); yPos = 20; }
            doc.text(line, margin, yPos);
            yPos += 5;
          });
          yPos += 5;
        }

        if (quotation.terms_conditions) {
          if (yPos > 240) { doc.addPage(); yPos = 20; }
          doc.setFillColor(...brandBlue);
          doc.rect(margin, yPos - 3, 3, 8, 'F');
          doc.setFont(undefined!, 'bold');
          doc.setTextColor(...brandDark);
          doc.text('TERMINOS Y CONDICIONES', margin + 6, yPos + 2);
          yPos += 10;
          doc.setFont(undefined!, 'normal');
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          const termsLines = doc.splitTextToSize(quotation.terms_conditions, contentWidth);
          termsLines.forEach((line: string) => {
            if (yPos > 255) { doc.addPage(); yPos = 20; }
            doc.text(line, margin, yPos);
            yPos += 4;
          });
        }
      }

      const bankTag = quotation.tags?.find((tag: string) => tag.startsWith("bank:"));
      if (bankTag) {
        const banks = decodeURIComponent(bankTag.substring(5));
        if (banks.trim()) {
          yPos += 8;
          if (yPos > 240) { doc.addPage(); yPos = 20; }
          doc.setFillColor(...brandBlue);
          doc.rect(margin, yPos - 3, 3, 8, 'F');
          doc.setFont(undefined!, 'bold');
          doc.setTextColor(...brandDark);
          doc.text('DATOS DE DEPOSITO / CUENTAS BANCARIAS', margin + 6, yPos + 2);
          yPos += 10;
          doc.setFont(undefined!, 'normal');
          doc.setFontSize(9);
          doc.setTextColor(40, 40, 40);
          const bankLines = doc.splitTextToSize(banks, contentWidth);
          bankLines.forEach((line: string) => {
            if (yPos > 255) { doc.addPage(); yPos = 20; }
            doc.text(line, margin, yPos);
            yPos += 5;
          });
        }
      }

      // ── BRANDED FOOTER on all pages ──
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFillColor(...brandDark);
        doc.rect(0, pageHeight - 18, pageWidth, 18, 'F');
        doc.setFillColor(...brandCyan);
        doc.rect(0, pageHeight - 18, pageWidth, 1.5, 'F');
        doc.setTextColor(180, 200, 220);
        doc.setFontSize(7);
        doc.setFont(undefined!, 'normal');
        doc.text('consulting@b3ta.us | b3ta.us | +1 435 534 8065', margin, pageHeight - 9);
        doc.text(`Pagina ${i} de ${pageCount}`, pageWidth - margin, pageHeight - 9, { align: 'right' });
        doc.setFontSize(6);
        doc.setTextColor(120, 140, 160);
        doc.text('Consultoria en infraestructura, automatizacion y soluciones digitales', margin, pageHeight - 5);
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

  const downloadFinancialAnalysisPDF = async () => {
    setIsDownloadingFinancialPDF(true);
    try {
      // Cargar gastos con categorías
      const { data: expensesData } = await supabase
        .from('quotation_expenses')
        .select(`
          *,
          expense_categories (
            name
          )
        `)
        .eq('quotation_id', quotation.id)
        .order('expense_date', { ascending: false });
      
      const expenses = expensesData || [];
      const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount.toString()), 0);
      const netProfit = quotation.total - totalExpenses;

      // Generación del PDF de análisis financiero
      const { jsPDF } = await import('jspdf');

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let yPos = 20;

      // Encabezado
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, pageWidth, 45, 'F');
      
      doc.setTextColor(99, 102, 241);
      doc.setFontSize(20);
      doc.setFont(undefined, 'bold');
      doc.text('B3TA', margin, 15);
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(24);
      doc.text('Análisis Financiero', margin, 28);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Cotización: ${quotation.quotation_number}`, margin, 36);
      doc.text(`Fecha: ${format(new Date(), 'PPP', { locale: es })}`, margin, 41);
      
      yPos = 60;

      // Cliente
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('CLIENTE', margin, yPos);
      yPos += 7;
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(quotation.customers.name, margin, yPos);
      yPos += 5;
      if (quotation.customers.company) {
        doc.text(quotation.customers.company, margin, yPos);
        yPos += 5;
      }
      yPos += 10;

      // Resumen financiero destacado
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(99, 102, 241);
      doc.text('RESUMEN FINANCIERO', margin, yPos);
      yPos += 10;

      doc.setFillColor(248, 249, 250);
      doc.rect(margin, yPos - 5, contentWidth, 35, 'F');
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.text('Ingresos Totales:', margin + 2, yPos);
      doc.text(`${formatCurrencyForPDF(quotation.total, quotation.currency)}`, margin + contentWidth * 0.75, yPos, { align: 'right' });
      
      const finExTag = quotation.tags?.find(tag => tag.startsWith("exchange:"));
      if (finExTag) {
        const [, r, c] = finExTag.split(":");
        const rate = parseFloat(r);
        if (!isNaN(rate) && rate > 0 && c) {
          yPos += 5;
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.text(`Aprx. ${formatCurrencyForPDF(quotation.total * rate, c)}`, margin + contentWidth * 0.75, yPos, { align: 'right' });
          doc.setFontSize(11);
        }
      }
      
      yPos += 8;

      doc.setTextColor(220, 38, 38);
      doc.text('Gastos Totales:', margin + 2, yPos);
      doc.text(`${formatCurrencyForPDF(totalExpenses, quotation.currency)}`, margin + contentWidth * 0.75, yPos, { align: 'right' });
      yPos += 8;

      doc.setDrawColor(99, 102, 241);
      doc.setLineWidth(0.5);
      doc.line(margin + 2, yPos - 2, margin + contentWidth * 0.75, yPos - 2);
      yPos += 4;

      doc.setTextColor(netProfit >= 0 ? 34 : 220, netProfit >= 0 ? 197 : 38, netProfit >= 0 ? 94 : 38);
      doc.setFont(undefined, 'bold');
      doc.setFontSize(13);
      doc.text('Utilidad Neta:', margin + 2, yPos);
      doc.text(`${formatCurrencyForPDF(netProfit, quotation.currency)}`, margin + contentWidth * 0.75, yPos, { align: 'right' });
      yPos += 7;

      const profitMargin = quotation.total > 0 ? (netProfit / quotation.total) * 100 : 0;
      doc.setFontSize(10);
      doc.setTextColor(99, 102, 241);
      doc.text(`Margen de Utilidad: ${profitMargin.toFixed(1)}%`, margin + 2, yPos);
      yPos += 15;

      // Detalle de gastos
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('DETALLE DE GASTOS', margin, yPos);
      yPos += 8;

      if (expenses.length === 0) {
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text('No hay gastos registrados para esta cotización', margin, yPos);
      } else {
        // Header de tabla
        doc.setFontSize(9);
        doc.setFillColor(240, 240, 240);
        doc.rect(margin, yPos - 5, contentWidth, 7, 'F');
        doc.setFont(undefined, 'bold');
        doc.text('Fecha', margin + 2, yPos);
        doc.text('Categoría', margin + contentWidth * 0.15, yPos);
        doc.text('Descripción', margin + contentWidth * 0.35, yPos);
        doc.text('Monto', margin + contentWidth * 0.87, yPos);
        yPos += 8;

        // Filas
        doc.setFont(undefined, 'normal');
        doc.setFontSize(8);
        expenses.forEach((expense, index) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }

          // Fondo alternado
          if (index % 2 === 0) {
            doc.setFillColor(252, 252, 252);
            doc.rect(margin, yPos - 4, contentWidth, 6, 'F');
          }

          doc.setTextColor(0, 0, 0);
          doc.text(format(new Date(expense.expense_date), 'dd/MM/yyyy'), margin + 2, yPos);
          
          const categoryName = expense.expense_categories?.name || 'Sin categoría';
          doc.text(categoryName.substring(0, 20), margin + contentWidth * 0.15, yPos);
          
          const descText = expense.description.substring(0, 40);
          doc.text(descText, margin + contentWidth * 0.35, yPos);
          
          doc.text(`$${parseFloat(expense.amount.toString()).toFixed(2)}`, margin + contentWidth * 0.87, yPos);
          yPos += 6;
        });

        // Total de gastos
        yPos += 5;
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPos - 2, margin + contentWidth, yPos - 2);
        yPos += 5;
        doc.setFont(undefined, 'bold');
        doc.setFontSize(10);
        doc.text('Total de Gastos:', margin + contentWidth * 0.7, yPos);
        doc.text(`$${totalExpenses.toFixed(2)}`, margin + contentWidth * 0.87, yPos);
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
        doc.text('consulting@b3ta.us | b3ta.us | +1 435 534 8065', margin, pageHeight - 18);
        doc.text('Consultoría en infraestructura, automatización y soluciones digitales', margin, pageHeight - 14);
        
        doc.setTextColor(150, 150, 150);
        doc.text('Documento confidencial', pageWidth / 2, pageHeight - 10, { align: 'center' });
        doc.text(`Página ${i} de ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
      }

      doc.save(`Analisis-Financiero-${quotation.quotation_number}.pdf`);

      toast({
        title: 'PDF descargado',
        description: 'El análisis financiero se ha descargado exitosamente',
      });
    } catch (error) {
      console.error('Error downloading financial analysis PDF:', error);
      toast({
        title: 'Error',
        description: 'No se pudo descargar el análisis financiero',
        variant: 'destructive',
      });
    } finally {
      setIsDownloadingFinancialPDF(false);
    }
  };

  const updateGlobals = async () => {
    try {
      // 1. Update Customer
      const { error: customerError } = await supabase
        .from('customers')
        .update({
          name: globalData.customer_name,
          email: globalData.customer_email,
          company: globalData.customer_company || null
        })
        .eq('id', quotation.customer_id);
      
      if (customerError) throw customerError;

      // 2. Recalculate Totals based on new tax and discount
      const taxRateNum = parseFloat(globalData.tax_rate) || 0;
      const discountPercentageNum = parseFloat(globalData.discount_percentage) || 0;
      
      // Calculate Subtotal from existing items
      const { data: allItems } = await supabase
        .from('quotation_items')
        .select('total')
        .eq('quotation_id', quotation.id);
        
      const subtotal = allItems ? allItems.reduce((sum, i) => sum + i.total, 0) : quotation.subtotal;
      
      const globalDiscount = subtotal * (discountPercentageNum / 100);
      const subtotalAfterDiscount = subtotal - globalDiscount;
      const taxAmount = subtotalAfterDiscount * (taxRateNum / 100);
      const totalAmount = subtotalAfterDiscount + taxAmount;

      // Handle Exchange Rate tag
      let currentTags = quotation.tags || [];
      currentTags = currentTags.filter(tag => !tag.startsWith("exchange:"));
      
      const newRate = parseFloat(globalData.exchange_rate);
      if (!isNaN(newRate) && newRate > 0 && globalData.secondary_currency) {
        currentTags.push(`exchange:${newRate}:${globalData.secondary_currency}`);
      }

      // 3. Update Quotation
      const { error: quotationError } = await supabase
        .from('quotations')
        .update({
          valid_until: globalData.valid_until || null,
          currency: globalData.currency,
          tax_rate: taxRateNum,
          discount_percentage: discountPercentageNum,
          discount_amount: globalDiscount,
          tax_amount: taxAmount,
          total: totalAmount,
          tags: currentTags
        })
        .eq('id', quotation.id);

      if (quotationError) throw quotationError;

      toast({
        title: "Datos actuales",
        description: "La cotización ha sido actualizada exitosamente",
      });
      setIsEditingGlobals(false);
      onUpdate();
    } catch (e) {
      toast({ title: "Error", description: "No se pudieron actualizar los datos", variant: "destructive" });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl mb-2">{quotation.quotation_number}</DialogTitle>
              <DialogDescription className="mb-2">
                Detalle completo de la cotización con items, totales y opciones de pago.
              </DialogDescription>
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
                {formatCurrencyDisplay(quotation.total, quotation.currency)}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Datos Principales (Cliente, Fechas, Moneda, Impuestos) */}
          <Card className="p-6 border-2 border-primary/20">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Datos Principales
              </h3>
              {!isEditingGlobals ? (
                <Button variant="ghost" size="sm" onClick={() => setIsEditingGlobals(true)}>
                  <Edit2 className="h-4 w-4 mr-2" /> Editar Datos
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditingGlobals(false)}>
                    Cancelar
                  </Button>
                  <Button size="sm" onClick={updateGlobals}>
                    <Save className="h-4 w-4 mr-2" /> Guardar
                  </Button>
                </div>
              )}
            </div>
            
            {!isEditingGlobals ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-semibold text-primary mb-2">Cliente</p>
                    <div className="space-y-1 text-sm">
                      <p className="font-medium text-foreground">{quotation.customers.name}</p>
                      {quotation.customers.company && (
                        <p className="text-muted-foreground">{quotation.customers.company}</p>
                      )}
                      <p className="text-muted-foreground">{quotation.customers.email}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary mb-2">Configuración</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Moneda:</span>
                        <span className="font-medium">{quotation.currency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">IVA:</span>
                        <span className="font-medium">{quotation.tax_rate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Descuento Global:</span>
                        <span className="font-medium">{quotation.discount_percentage}%</span>
                      </div>
                      {initialExchangeRate && initialSecondaryCurrency && (
                        <div className="flex justify-between mt-2 pt-2 border-t border-border/50">
                          <span className="text-muted-foreground">Tasa Conv. ({initialSecondaryCurrency}):</span>
                          <span className="font-medium text-primary">x {initialExchangeRate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Fecha de creación:</span>
                    <span>{format(new Date(quotation.created_at), "PPP", { locale: es })}</span>
                  </div>
                  {quotation.valid_until && (
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-muted-foreground">Válida hasta:</span>
                      <span className="font-medium text-amber-600">
                        {format(new Date(quotation.valid_until), "PPP", { locale: es })}
                      </span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Nombre del Cliente</Label>
                    <Input value={globalData.customer_name} onChange={(e) => setGlobalData({...globalData, customer_name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Email del Cliente</Label>
                    <Input value={globalData.customer_email} onChange={(e) => setGlobalData({...globalData, customer_email: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Empresa (Opcional)</Label>
                    <Input value={globalData.customer_company} onChange={(e) => setGlobalData({...globalData, customer_company: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Válida hasta</Label>
                    <Input type="date" value={globalData.valid_until} onChange={(e) => setGlobalData({...globalData, valid_until: e.target.value})} />
                  </div>
                </div>
                
                <Separator />
                
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Moneda</Label>
                    <select 
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={globalData.currency} 
                      onChange={(e) => setGlobalData({...globalData, currency: e.target.value})}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="GTQ">GTQ (Q)</option>
                      <option value="MXN">MXN ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="COP">COP ($)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">IVA / Impuestos (%)</Label>
                    <Input type="number" step="0.1" value={globalData.tax_rate} onChange={(e) => setGlobalData({...globalData, tax_rate: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Descuento Global (%)</Label>
                    <Input type="number" step="0.1" value={globalData.discount_percentage} onChange={(e) => setGlobalData({...globalData, discount_percentage: e.target.value})} />
                  </div>
                </div>

                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-md border border-border/50">
                  <div className="space-y-2">
                    <Label className="text-xs text-primary font-medium">Equivalencia: Tasa de Cambio (Opcional)</Label>
                    <Input placeholder="Ej. 7.80" type="number" step="0.01" value={globalData.exchange_rate} onChange={(e) => setGlobalData({...globalData, exchange_rate: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-primary font-medium">Moneda Secundaria</Label>
                    <select 
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={globalData.secondary_currency} 
                      onChange={(e) => setGlobalData({...globalData, secondary_currency: e.target.value})}
                    >
                      <option value="">Ninguna</option>
                      <option value="GTQ">Quetzales (GTQ)</option>
                      <option value="MXN">Pesos Mexicanos (MXN)</option>
                      <option value="COP">Pesos Colombianos (COP)</option>
                      <option value="USD">Dólares (USD)</option>
                      <option value="EUR">Euros (EUR)</option>
                    </select>
                  </div>
                  <p className="text-[10px] text-muted-foreground md:col-span-2">
                    Si ingresas una tasa, se mostrará el valor equivalente en esta moneda visible al lado del total real.
                  </p>
                </div>
              </div>
            )}
            
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
                        <Save className="h-3 w-3 text-success" />
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

              {/* Tags */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-start justify-between">
                  <Label className="text-sm text-muted-foreground">Tags:</Label>
                  {!isEditingTags ? (
                    <div className="flex items-center gap-2 flex-wrap max-w-md justify-end">
                      {quotation.tags && quotation.tags.length > 0 ? (
                        <>
                          {quotation.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary">{tag}</Badge>
                          ))}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditingTags(true)}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="text-sm text-muted-foreground">Sin tags</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditingTags(true)}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 flex-1 justify-end">
                      <Input
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="Tag1, Tag2, Tag3"
                        className="h-8 max-w-md"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={updateTags}
                      >
                        <Save className="h-3 w-3 text-success" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setTags((quotation.tags || []).join(", "));
                          setIsEditingTags(false);
                        }}
                      >
                        <X className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  )}
                </div>
                {isEditingTags && (
                  <p className="text-xs text-muted-foreground mt-2 text-right">
                    Separa los tags con comas
                  </p>
                )}
              </div>

              {/* Comentarios/Notas */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-start justify-between mb-2">
                  <Label className="text-sm text-muted-foreground">Comentarios:</Label>
                  {!isEditingNotes && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingNotes(true)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                {!isEditingNotes ? (
                  <p className="text-sm whitespace-pre-wrap">
                    {quotation.notes || "Sin comentarios"}
                  </p>
                ) : (
                  <div className="space-y-2">
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Agrega comentarios sobre esta cotización..."
                      rows={4}
                      className="text-sm"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setNotes(quotation.notes || "");
                          setIsEditingNotes(false);
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        size="sm"
                        onClick={updateNotes}
                      >
                        Guardar
                      </Button>
                    </div>
                  </div>
                )}
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
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Detalles</h3>
                  <Button variant="outline" size="sm" onClick={() => setIsAddingItem(true)}>
                    <Plus className="h-4 w-4 mr-2" /> Añadir Item
                  </Button>
                </div>
                {isLoading ? (
                  <p className="text-center text-muted-foreground">Cargando items...</p>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between items-start pb-3 border-b last:border-0 group">
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
                        <div className="flex items-center gap-2">
                          <div className="text-right font-semibold">
                            {formatCurrencyDisplay(item.total, quotation.currency)}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingItem(item)}
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Separator className="my-4" />

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-semibold">{formatCurrencyDisplay(quotation.subtotal, quotation.currency)}</span>
                      </div>
                      {quotation.discount_percentage > 0 && (
                        <div className="flex justify-between text-destructive">
                          <span>Descuento Global ({quotation.discount_percentage}%):</span>
                          <span>-{formatCurrencyDisplay(quotation.discount_amount, quotation.currency)}</span>
                        </div>
                      )}
                      {quotation.discount_percentage > 0 && (
                        <div className="flex justify-between">
                          <span>Subtotal con Descuento:</span>
                          <span className="font-semibold">{formatCurrencyDisplay((quotation.subtotal - quotation.discount_amount), quotation.currency)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-muted-foreground">
                        <span>IVA ({quotation.tax_rate}%):</span>
                        <span>{formatCurrencyDisplay(quotation.tax_amount, quotation.currency)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-start text-lg font-bold">
                        <span>Total:</span>
                        <div className="text-right">
                          <span className="text-primary">{formatCurrencyDisplay(quotation.total, quotation.currency)}</span>
                          
                          {initialExchangeRate && initialSecondaryCurrency && !isNaN(parseFloat(initialExchangeRate)) && (
                            <div className="mt-1 flex flex-col items-end">
                              <span className="text-sm font-medium text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                Aprox. {formatCurrencyDisplay(quotation.total * parseFloat(initialExchangeRate), initialSecondaryCurrency)}
                              </span>
                              <span className="text-[10px] text-muted-foreground mt-0.5">
                                Tasa: {initialExchangeRate} {initialSecondaryCurrency}/{quotation.currency}
                              </span>
                            </div>
                          )}
                        </div>
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

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Términos y Condiciones</h3>
                  {!isEditingTerms && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingTerms(true)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {isEditingTerms ? (
                  <div className="space-y-2">
                    <Textarea
                      value={termsConditions}
                      onChange={(e) => setTermsConditions(e.target.value)}
                      rows={8}
                      placeholder="Ingrese los términos y condiciones..."
                    />
                    <div className="flex gap-2">
                      <TermsAIAssistant
                        currentText={termsConditions}
                        onTextImproved={setTermsConditions}
                      />
                      <Button onClick={updateTermsConditions} size="sm">
                        <Save className="h-4 w-4 mr-2" />
                        Guardar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setTermsConditions(quotation.terms_conditions || "");
                          setIsEditingTerms(false);
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {quotation.terms_conditions || "Sin términos y condiciones"}
                  </p>
                )}
              </Card>

              {/* Cuentas Bancarias */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-primary">Cuentas Bancarias</h3>
                  {!isEditingBank && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingBank(true)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {isEditingBank ? (
                  <div className="space-y-4">
                    <p className="text-[11px] text-muted-foreground">
                      Estas cuentas aparecerán automáticamente al final de los PDFs descargados para que el cliente pueda realizar su depósito u orden de compra.
                    </p>
                    <Textarea
                      value={bankAccounts}
                      onChange={(e) => setBankAccounts(e.target.value)}
                      rows={4}
                      placeholder="Ej. BAC 12345678 Monetaria\nBanrural 09876543 Ahorro"
                    />
                    <div className="flex gap-2">
                      <Button onClick={updateBankAccounts} size="sm">
                        <Save className="h-4 w-4 mr-2" />
                        Guardar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setBankAccounts(initialBank);
                          setIsEditingBank(false);
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-primary/5 p-4 rounded-md border border-primary/10">
                    <p className="text-sm text-foreground whitespace-pre-wrap font-medium">
                      {initialBank || "No se han configurado datos de depósito para esta cotización."}
                    </p>
                  </div>
                )}
              </Card>
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
              {stripePaymentLink ? (
                <>
                  <Button
                    className="flex-1"
                    onClick={() => window.open(stripePaymentLink, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Ver Link de Pago
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={createStripePaymentLink}
                    disabled={isCreatingPaymentLink}
                  >
                    <DollarSign className="mr-2 h-4 w-4" />
                    {isCreatingPaymentLink ? 'Regenerando...' : 'Regenerar Link'}
                  </Button>
                </>
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
              >
                <Send className="mr-2 h-4 w-4" />
                {quotation.status === 'sent' ? 'Reenviar Email' : 'Enviar al Cliente'}
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

              <Button 
                variant="outline" 
                className="flex-1"
                onClick={downloadFinancialAnalysisPDF}
                disabled={isDownloadingFinancialPDF}
              >
                <TrendingDown className="mr-2 h-4 w-4" />
                {isDownloadingFinancialPDF ? 'Generando...' : 'Análisis Financiero'}
              </Button>
            </div>

            <div className="flex gap-3">
              {relatedInvoice ? (
                <Button 
                  className="flex-1 bg-success hover:bg-success-hover"
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

      {editingItem && (
        <EditQuotationItemModal
          item={editingItem}
          quotation={quotation}
          onClose={() => setEditingItem(null)}
          onSuccess={() => {
            setEditingItem(null);
            loadItems();
            onUpdate();
          }}
        />
      )}

      {isAddingItem && (
        <AddQuotationItemModal
          quotation={quotation}
          onClose={() => setIsAddingItem(false)}
          onSuccess={() => {
            setIsAddingItem(false);
            loadItems();
            onUpdate();
          }}
        />
      )}
    </Dialog>
  );
};
