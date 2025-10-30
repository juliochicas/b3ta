import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Search, Eye, Send, DollarSign, Calendar, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { QuotationDetailModal } from "./QuotationDetailModal";

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

export const QuotationsList = () => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [filteredQuotations, setFilteredQuotations] = useState<Quotation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;
  const { toast } = useToast();

  useEffect(() => {
    loadQuotations();
  }, [currentPage]);

  useEffect(() => {
    if (searchTerm) {
      setFilteredQuotations(
        quotations.filter(q =>
          q.quotation_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredQuotations(quotations);
    }
  }, [searchTerm, quotations]);

  const loadQuotations = async () => {
    try {
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;

      const { count } = await supabase
        .from('quotations')
        .select('*', { count: 'exact', head: true });

      const { data, error } = await supabase
        .from('quotations')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      setTotalCount(count || 0);
      setQuotations(data || []);
      setFilteredQuotations(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las cotizaciones",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      draft: { variant: "secondary", label: "Borrador" },
      sent: { variant: "default", label: "Enviada" },
      accepted: { variant: "default", label: "Aceptada" },
      rejected: { variant: "destructive", label: "Rechazada" },
      expired: { variant: "secondary", label: "Expirada" },
    };
    const config = variants[status] || { variant: "secondary", label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando cotizaciones...</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar por número, cliente o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredQuotations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay cotizaciones disponibles</p>
            </div>
          ) : (
            filteredQuotations.map((quotation) => (
              <Card key={quotation.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{quotation.quotation_number}</h3>
                      {getStatusBadge(quotation.status)}
                    </div>
                    
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p className="font-medium text-foreground">{quotation.customer_name}</p>
                      {quotation.customer_company && (
                        <p>{quotation.customer_company}</p>
                      )}
                      <p>{quotation.customer_email}</p>
                    </div>

                    <div className="flex items-center gap-4 mt-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(new Date(quotation.created_at), "PPP", { locale: es })}
                        </span>
                      </div>
                      {quotation.valid_until && (
                        <div className="flex items-center gap-1 text-amber-600">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Válida hasta: {format(new Date(quotation.valid_until), "PP", { locale: es })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary mb-4">
                      {quotation.currency} ${quotation.total.toFixed(2)}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setSelectedQuotation(quotation)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {totalCount > pageSize && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              Mostrando {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalCount)} de {totalCount} cotizaciones
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage * pageSize >= totalCount}
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {selectedQuotation && (
        <QuotationDetailModal
          quotation={selectedQuotation}
          onClose={() => setSelectedQuotation(null)}
          onUpdate={loadQuotations}
        />
      )}
    </>
  );
};
