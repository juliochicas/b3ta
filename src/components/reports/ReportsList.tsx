import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Search, Calendar, User, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ReportDetailModal } from "./ReportDetailModal";

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

export const ReportsList = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const ITEMS_PER_PAGE = 10;
  const { toast } = useToast();

  useEffect(() => {
    loadReports();
  }, [currentPage, searchTerm]);

  const loadReports = async () => {
    try {
      setLoading(true);
      
      // Build query with JOIN to customers table
      let query = supabase
        .from('consultation_reports')
        .select(`
          *,
          customers (
            name,
            email,
            company,
            phone
          )
        `, { count: 'exact' });

      // Apply search filter if exists
      if (searchTerm) {
        query = query.or(`report_number.ilike.%${searchTerm}%,customers.name.ilike.%${searchTerm}%,customers.company.ilike.%${searchTerm}%`);
      }

      // Apply pagination
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      setReports(data || []);
      setTotalCount(count || 0);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los informes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Search is now handled server-side, so just use reports directly
  const filteredReports = reports;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: "Borrador", variant: "secondary" as const },
      completed: { label: "Completado", variant: "default" as const },
      sent: { label: "Enviado", variant: "outline" as const },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return <div className="text-center py-8">Cargando informes...</div>;
  }

  return (
    <>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número, cliente o empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredReports.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {searchTerm ? "No se encontraron informes" : "No hay informes aún"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredReports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {report.report_number}
                      {getStatusBadge(report.status)}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {report.customers.name}
                      {report.customers.company && ` - ${report.customers.company}`}
                    </p>
                  </div>
                  <Button onClick={() => setSelectedReport(report)}>
                    Ver Detalle
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(report.created_at).toLocaleDateString('es-ES')}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {report.consultant_name}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {filteredReports.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-muted-foreground">
            Mostrando {((currentPage - 1) * ITEMS_PER_PAGE) + 1} a {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} de {totalCount} informes
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-md">
              <span className="text-sm">Página {currentPage} de {Math.ceil(totalCount / ITEMS_PER_PAGE)}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage >= Math.ceil(totalCount / ITEMS_PER_PAGE)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onUpdate={loadReports}
        />
      )}
    </>
  );
};
