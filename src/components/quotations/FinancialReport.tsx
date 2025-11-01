import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FileSpreadsheet, Download, TrendingUp, DollarSign, TrendingDown, Percent, Link2, Send, CheckCircle, XCircle, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ReportData {
  quotation_id: string;
  quotation_number: string;
  customer_name: string;
  created_at: string;
  total_revenue: number;
  total_expenses: number;
  net_profit: number;
  profit_margin: number;
  currency: string;
  customers: {
    name: string;
  };
}

interface ReportStats {
  totalQuotations: number;
  quotationsWithLinks: number;
  sentQuotations: number;
  paidQuotations: number;
  unpaidQuotations: number;
  leadsWithoutQuotations: number;
}

export const FinancialReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [reportStats, setReportStats] = useState<ReportStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const { toast } = useToast();

  const generateReport = async () => {
    if (!startDate || !endDate) {
      toast({
        title: "Fechas requeridas",
        description: "Por favor selecciona un periodo de tiempo",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Obtener cotizaciones del periodo con JOIN a customers
      const { data: quotations, error: quotationsError } = await supabase
        .from('quotations')
        .select(`
          *,
          customers!fk_quotations_customer (
            name
          )
        `)
        .gte('created_at', startDate)
        .lte('created_at', endDate + 'T23:59:59')
        .order('created_at', { ascending: false });

      if (quotationsError) throw quotationsError;

      // Para cada cotización, obtener sus gastos
      const reportPromises = (quotations || []).map(async (quotation) => {
        const { data: expenses } = await supabase
          .from('quotation_expenses')
          .select('amount')
          .eq('quotation_id', quotation.id);

        const totalExpenses = (expenses || []).reduce(
          (sum, exp) => sum + parseFloat(exp.amount.toString()),
          0
        );

        const netProfit = quotation.total - totalExpenses;
        const profitMargin = quotation.total > 0 ? (netProfit / quotation.total) * 100 : 0;

        return {
          quotation_id: quotation.id,
          quotation_number: quotation.quotation_number,
          customer_name: (quotation as any).customers.name,
          created_at: quotation.created_at,
          total_revenue: quotation.total,
          total_expenses: totalExpenses,
          net_profit: netProfit,
          profit_margin: profitMargin,
          currency: quotation.currency,
          customers: (quotation as any).customers,
        };
      });

      const report = await Promise.all(reportPromises);
      setReportData(report);
      setCurrentPage(1); // Reset a la primera página cuando se genera un nuevo reporte

      // Calcular estadísticas adicionales
      const quotationsWithLinks = quotations?.filter(q => q.stripe_payment_link).length || 0;
      const sentQuotations = quotations?.filter(q => q.sent_at).length || 0;
      
      // Obtener facturas pagadas en el periodo
      const { data: invoices } = await supabase
        .from('invoices')
        .select('quotation_id')
        .eq('payment_status', 'paid')
        .in('quotation_id', quotations?.map(q => q.id) || []);
      
      const paidQuotationIds = new Set(invoices?.map(inv => inv.quotation_id) || []);
      const paidQuotations = quotations?.filter(q => paidQuotationIds.has(q.id)).length || 0;
      const unpaidQuotations = sentQuotations - paidQuotations;

      // Contar leads sin cotizaciones
      const { data: leadsWithoutQuotations, error: leadsError } = await supabase
        .from('leads_b3ta')
        .select('id')
        .is('id', null)
        .not('id', 'in', `(SELECT lead_id FROM quotations WHERE lead_id IS NOT NULL)`);

      const { count: leadsCount } = await supabase
        .from('leads_b3ta')
        .select('id', { count: 'exact', head: true })
        .filter('id', 'not.in', `(SELECT lead_id FROM quotations WHERE lead_id IS NOT NULL)`);

      setReportStats({
        totalQuotations: report.length,
        quotationsWithLinks,
        sentQuotations,
        paidQuotations,
        unpaidQuotations,
        leadsWithoutQuotations: leadsCount || 0,
      });

      toast({
        title: "Reporte generado",
        description: `Se encontraron ${report.length} cotizaciones en el periodo`,
      });
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Error",
        description: "No se pudo generar el reporte",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportToExcel = async () => {
    try {
      const XLSX = await import('xlsx');

      // Resumen general
      const totalRevenue = reportData.reduce((sum, item) => sum + item.total_revenue, 0);
      const totalExpenses = reportData.reduce((sum, item) => sum + item.total_expenses, 0);
      const totalNetProfit = totalRevenue - totalExpenses;
      const averageMargin = reportData.length > 0
        ? reportData.reduce((sum, item) => sum + item.profit_margin, 0) / reportData.length
        : 0;

      const summaryData = [
        ['REPORTE FINANCIERO'],
        ['Periodo:', `${format(new Date(startDate), 'dd/MM/yyyy')} - ${format(new Date(endDate), 'dd/MM/yyyy')}`],
        [],
        ['RESUMEN GENERAL'],
        ['Total Ingresos', totalRevenue.toFixed(2)],
        ['Total Gastos', totalExpenses.toFixed(2)],
        ['Utilidad Neta Total', totalNetProfit.toFixed(2)],
        ['Margen Promedio (%)', averageMargin.toFixed(1)],
        ['Cotizaciones Procesadas', reportData.length],
        [],
      ];

      // Detalle por cotización
      const detailData = [
        ['DETALLE POR COTIZACIÓN'],
        [],
        ['Fecha', 'Cotización', 'Cliente', 'Ingresos', 'Gastos', 'Utilidad Neta', 'Margen %', 'Moneda'],
        ...reportData.map(item => [
          format(new Date(item.created_at), 'dd/MM/yyyy'),
          item.quotation_number,
          item.customer_name,
          item.total_revenue.toFixed(2),
          item.total_expenses.toFixed(2),
          item.net_profit.toFixed(2),
          item.profit_margin.toFixed(1),
          item.currency,
        ])
      ];

      const allData = [...summaryData, ...detailData];

      const ws = XLSX.utils.aoa_to_sheet(allData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Reporte Financiero');

      const colWidths = [
        { wch: 15 },
        { wch: 20 },
        { wch: 30 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 12 },
        { wch: 10 },
      ];
      ws['!cols'] = colWidths;

      XLSX.writeFile(wb, `Reporte-Financiero-${startDate}-${endDate}.xlsx`);

      toast({
        title: "Excel exportado",
        description: "El reporte financiero se ha exportado exitosamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo exportar a Excel",
        variant: "destructive",
      });
    }
  };

  // Calcular totales
  const totalRevenue = reportData.reduce((sum, item) => sum + item.total_revenue, 0);
  const totalExpenses = reportData.reduce((sum, item) => sum + item.total_expenses, 0);
  const totalNetProfit = totalRevenue - totalExpenses;
  const averageMargin = reportData.length > 0
    ? reportData.reduce((sum, item) => sum + item.profit_margin, 0) / reportData.length
    : 0;

  // Paginación
  const totalPages = Math.ceil(reportData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = reportData.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* Filtros de fecha */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Periodo de Análisis</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="start_date">Fecha Inicio</Label>
            <Input
              id="start_date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="end_date">Fecha Fin</Label>
            <Input
              id="end_date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="flex items-end gap-2">
            <Button
              onClick={generateReport}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "Generando..." : "Generar Reporte"}
            </Button>
            {reportData.length > 0 && (
              <Button
                onClick={exportToExcel}
                variant="outline"
              >
                <FileSpreadsheet className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Estadísticas de cotizaciones */}
      {reportStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950 dark:to-cyan-900">
            <div className="flex items-center gap-2 mb-2">
              <Link2 className="h-6 w-6 text-cyan-600" />
              <div>
                <p className="text-xs text-muted-foreground">Links Generados</p>
                <p className="text-xl font-bold text-cyan-600">
                  {reportStats.quotationsWithLinks}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900">
            <div className="flex items-center gap-2 mb-2">
              <Send className="h-6 w-6 text-indigo-600" />
              <div>
                <p className="text-xs text-muted-foreground">Enviadas</p>
                <p className="text-xl font-bold text-indigo-600">
                  {reportStats.sentQuotations}
                </p>
              </div>
            </div>
          </Card>

           <Card className="p-4 bg-gradient-to-br from-success/10 to-success/20">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-6 w-6 text-status-paid" />
              <div>
                <p className="text-xs text-muted-foreground">Pagadas</p>
                <p className="text-xl font-bold text-status-paid">
                  {reportStats.paidQuotations}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-6 w-6 text-orange-600" />
              <div>
                <p className="text-xs text-muted-foreground">No Pagadas</p>
                <p className="text-xl font-bold text-orange-600">
                  {reportStats.unpaidQuotations}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-6 w-6 text-amber-600" />
              <div>
                <p className="text-xs text-muted-foreground">Leads Sin Cotizar</p>
                <p className="text-xl font-bold text-amber-600">
                  {reportStats.leadsWithoutQuotations}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            <div className="flex items-center gap-2 mb-2">
              <FileSpreadsheet className="h-6 w-6 text-slate-600" />
              <div>
                <p className="text-xs text-muted-foreground">Total Cotizaciones</p>
                <p className="text-xl font-bold text-slate-600">
                  {reportStats.totalQuotations}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Resumen general */}
      {reportData.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6 bg-gradient-to-br from-info-bg to-info/10">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="h-8 w-8 text-info" />
                <div>
                  <p className="text-sm text-muted-foreground">Ingresos Totales</p>
                  <p className="text-2xl font-bold text-info">
                    ${totalRevenue.toFixed(2)}
                  </p>
                </div>
              </div>
...
            </Card>

            <Card className="p-6 bg-gradient-to-br from-error-bg to-error/10">
              <div className="flex items-center gap-3 mb-2">
                <TrendingDown className="h-8 w-8 text-error" />
                <div>
                  <p className="text-sm text-muted-foreground">Gastos Totales</p>
                  <p className="text-2xl font-bold text-error">
                    ${totalExpenses.toFixed(2)}
                  </p>
                </div>
              </div>
...
            </Card>

            <Card className={`p-6 bg-gradient-to-br ${totalNetProfit >= 0 ? 'from-success/10 to-success/20' : 'from-destructive/10 to-destructive/20'}`}>
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className={`h-8 w-8 ${totalNetProfit >= 0 ? 'text-profit-positive' : 'text-profit-negative'}`} />
                <div>
                  <p className="text-sm text-muted-foreground">Utilidad Neta</p>
                  <p className={`text-2xl font-bold ${totalNetProfit >= 0 ? 'text-profit-positive' : 'text-profit-negative'}`}>
                    ${totalNetProfit.toFixed(2)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Ingresos - Gastos
              </p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
              <div className="flex items-center gap-3 mb-2">
                <Percent className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Margen Promedio</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {averageMargin.toFixed(1)}%
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Promedio de utilidad
              </p>
            </Card>
          </div>

          {/* Tabla detallada */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Detalle por Cotización</h3>
              <Button onClick={exportToExcel} variant="outline" size="sm">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Exportar a Excel
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Fecha</th>
                    <th className="text-left p-3 font-medium">Cotización</th>
                    <th className="text-left p-3 font-medium">Cliente</th>
                    <th className="text-right p-3 font-medium">Ingresos</th>
                    <th className="text-right p-3 font-medium">Gastos</th>
                    <th className="text-right p-3 font-medium">Utilidad Neta</th>
                    <th className="text-right p-3 font-medium">Margen %</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item) => (
                    <tr key={item.quotation_id} className="border-b hover:bg-muted/50">
                      <td className="p-3 text-sm">
                        {format(new Date(item.created_at), 'dd MMM yyyy', { locale: es })}
                      </td>
                      <td className="p-3 text-sm font-medium">{item.quotation_number}</td>
                      <td className="p-3 text-sm">{item.customer_name}</td>
                      <td className="p-3 text-sm text-right font-medium text-info">
                        {item.currency} ${item.total_revenue.toFixed(2)}
                      </td>
                      <td className="p-3 text-sm text-right text-error">
                        {item.currency} ${item.total_expenses.toFixed(2)}
                      </td>
                      <td className={`p-3 text-sm text-right font-bold ${item.net_profit >= 0 ? 'text-profit-positive' : 'text-profit-negative'}`}>
                        {item.currency} ${item.net_profit.toFixed(2)}
                      </td>
                      <td className={`p-3 text-sm text-right font-medium ${item.profit_margin >= 0 ? 'text-profit-positive' : 'text-profit-negative'}`}>
                        {item.profit_margin.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 font-bold">
                    <td colSpan={3} className="p-3 text-right">TOTALES:</td>
                    <td className="p-3 text-right text-info">
                      ${totalRevenue.toFixed(2)}
                    </td>
                    <td className="p-3 text-right text-error">
                      ${totalExpenses.toFixed(2)}
                    </td>
                    <td className={`p-3 text-right ${totalNetProfit >= 0 ? 'text-profit-positive' : 'text-profit-negative'}`}>
                      ${totalNetProfit.toFixed(2)}
                    </td>
                    <td className="p-3 text-right text-purple-600">
                      {averageMargin.toFixed(1)}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Controles de paginación */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Mostrando {startIndex + 1} - {Math.min(endIndex, reportData.length)} de {reportData.length} cotizaciones
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Página {currentPage} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </>
      )}

      {reportData.length === 0 && startDate && endDate && !isLoading && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            No se encontraron cotizaciones en el periodo seleccionado
          </p>
        </Card>
      )}
    </div>
  );
};