import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, TrendingDown, Calendar, FileSpreadsheet } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ExpenseModal } from "./ExpenseModal";
import { formatCurrencyDisplay } from "@/lib/currency";

interface Expense {
  id: string;
  description: string;
  category_id: string;
  expense_categories: {
    name: string;
  } | null;
  amount: number;
  expense_date: string;
  notes: string | null;
}

interface Props {
  quotationId: string;
  currency: string;
  totalRevenue: number;
}

export const ExpensesList = ({ quotationId, currency, totalRevenue }: Props) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
  const { toast } = useToast();

  useEffect(() => {
    loadExpenses();
  }, [quotationId]);

  const loadExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('quotation_expenses')
        .select(`
          *,
          expense_categories (
            name
          )
        `)
        .eq('quotation_id', quotationId)
        .order('expense_date', { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error("Error loading expenses:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los gastos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteExpense = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este gasto?")) return;

    try {
      const { error } = await supabase
        .from('quotation_expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Gasto eliminado",
        description: "El gasto se eliminó correctamente",
      });
      loadExpenses();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el gasto",
        variant: "destructive",
      });
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount.toString()), 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  const exportToExcel = async () => {
    try {
      const XLSX = await import('xlsx');
      
      // Preparar datos del resumen
      const summaryData = [
        ['RESUMEN FINANCIERO'],
        [],
        ['Concepto', 'Monto (' + currency + ')'],
        ['Ingresos Totales', totalRevenue.toFixed(2)],
        ['Gastos Totales', totalExpenses.toFixed(2)],
        ['Utilidad Neta', netProfit.toFixed(2)],
        ['Margen de Utilidad', profitMargin.toFixed(1) + '%'],
        [],
      ];

      // Preparar datos de gastos
      const expensesData = [
        ['DETALLE DE GASTOS'],
        [],
        ['Fecha', 'Descripción', 'Categoría', 'Monto (' + currency + ')', 'Notas'],
        ...expenses.map(exp => [
          format(new Date(exp.expense_date), 'dd/MM/yyyy'),
          exp.description,
          exp.expense_categories?.name || 'Sin categoría',
          parseFloat(exp.amount.toString()).toFixed(2),
          exp.notes || ''
        ])
      ];

      // Combinar todos los datos
      const allData = [...summaryData, ...expensesData];

      // Crear libro y hoja
      const ws = XLSX.utils.aoa_to_sheet(allData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Análisis Financiero');

      // Aplicar estilos básicos (ancho de columnas)
      const colWidths = [
        { wch: 15 },  // Fecha/Concepto
        { wch: 30 },  // Descripción
        { wch: 20 },  // Categoría
        { wch: 15 },  // Monto
        { wch: 30 },  // Notas
      ];
      ws['!cols'] = colWidths;

      // Descargar archivo
      XLSX.writeFile(wb, `Analisis-Financiero-${quotationId.substring(0, 8)}.xlsx`);

      toast({
        title: "Excel exportado",
        description: "El análisis financiero se ha exportado exitosamente",
      });
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast({
        title: "Error",
        description: "No se pudo exportar a Excel",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-semibold text-lg">Gastos de la Cotización</h3>
          <p className="text-sm text-muted-foreground">
            Registra los gastos para calcular la utilidad neta
          </p>
        </div>
        <div className="flex gap-2">
          {expenses.length > 0 && (
            <Button
              onClick={exportToExcel}
              size="sm"
              variant="outline"
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Exportar a Excel
            </Button>
          )}
          <Button
            onClick={() => {
              setEditingExpense(undefined);
              setShowModal(true);
            }}
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar Gasto
          </Button>
        </div>
      </div>

      {/* Resumen Financiero */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-info-bg">
          <p className="text-sm text-muted-foreground">Ingresos Totales</p>
          <p className="text-2xl font-bold text-info">
            {formatCurrencyDisplay(totalRevenue, currency)}
          </p>
        </Card>

        <Card className="p-4 bg-error-bg">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            Gastos Totales
          </p>
          <p className="text-2xl font-bold text-error">
            {formatCurrencyDisplay(totalExpenses, currency)}
          </p>
        </Card>

        <Card className={`p-4 ${netProfit >= 0 ? 'bg-success/10' : 'bg-destructive/10'}`}>
          <p className="text-sm text-muted-foreground">Utilidad Neta</p>
          <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-profit-positive' : 'text-profit-negative'}`}>
            {formatCurrencyDisplay(netProfit, currency)}
          </p>
        </Card>

        <Card className="p-4 bg-purple-50 dark:bg-purple-950">
          <p className="text-sm text-muted-foreground">Margen de Utilidad</p>
          <p className="text-2xl font-bold text-purple-600">
            {profitMargin.toFixed(1)}%
          </p>
        </Card>
      </div>

      {/* Lista de Gastos */}
      {isLoading ? (
        <p className="text-center text-muted-foreground py-8">Cargando gastos...</p>
      ) : expenses.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <TrendingDown className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No hay gastos registrados</p>
          <p className="text-sm mt-2">Agrega gastos para calcular la utilidad neta</p>
        </div>
      ) : (
        <div className="space-y-3">
          {expenses.map((expense) => (
            <Card key={expense.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{expense.description}</h4>
                    <Badge variant="secondary">
                      {expense.expense_categories?.name || 'Sin categoría'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(expense.expense_date), 'PPP', { locale: es })}
                    </span>
                    <span className="text-lg font-bold text-destructive">
                      -{formatCurrencyDisplay(parseFloat(expense.amount.toString()), currency)}
                    </span>
                  </div>
                  {expense.notes && (
                    <p className="text-sm text-muted-foreground mt-2">{expense.notes}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditingExpense(expense);
                      setShowModal(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteExpense(expense.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showModal && (
        <ExpenseModal
          quotationId={quotationId}
          expense={editingExpense}
          onClose={() => {
            setShowModal(false);
            setEditingExpense(undefined);
          }}
          onSuccess={() => {
            setShowModal(false);
            setEditingExpense(undefined);
            loadExpenses();
          }}
        />
      )}
    </Card>
  );
};