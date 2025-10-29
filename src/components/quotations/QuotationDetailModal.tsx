import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Send, ExternalLink, FileText } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Quotation {
  id: string;
  quotation_number: string;
  customer_name: string;
  customer_email: string;
  customer_company: string | null;
  status: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  currency: string;
  valid_until: string | null;
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
  const { toast } = useToast();

  useEffect(() => {
    loadItems();
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

  const createStripePaymentLink = async () => {
    setIsCreatingPaymentLink(true);
    try {
      // Aquí integraremos Stripe para crear el payment link
      toast({
        title: "En desarrollo",
        description: "La integración con Stripe estará disponible pronto",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el link de pago",
        variant: "destructive",
      });
    } finally {
      setIsCreatingPaymentLink(false);
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
                    <span className="font-semibold">${quotation.subtotal.toFixed(2)}</span>
                  </div>
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

          {/* Acciones */}
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
            
            <Button variant="outline" className="flex-1">
              <Send className="mr-2 h-4 w-4" />
              Enviar al Cliente
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
