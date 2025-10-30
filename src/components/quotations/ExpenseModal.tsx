import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Expense {
  id: string;
  description: string;
  category: string;
  amount: number;
  expense_date: string;
  notes: string | null;
}

interface Props {
  quotationId: string;
  expense?: Expense;
  onClose: () => void;
  onSuccess: () => void;
}

const EXPENSE_CATEGORIES = [
  { value: "materials", label: "Materiales" },
  { value: "labor", label: "Mano de Obra" },
  { value: "equipment", label: "Equipo/Herramientas" },
  { value: "transport", label: "Transporte" },
  { value: "subcontractor", label: "Subcontratistas" },
  { value: "permits", label: "Permisos/Licencias" },
  { value: "software", label: "Software/Servicios" },
  { value: "marketing", label: "Marketing/Publicidad" },
  { value: "administrative", label: "Gastos Administrativos" },
  { value: "other", label: "Otros" },
];

export const ExpenseModal = ({ quotationId, expense, onClose, onSuccess }: Props) => {
  const [formData, setFormData] = useState({
    description: expense?.description || "",
    category: expense?.category || "",
    amount: expense?.amount?.toString() || "",
    expense_date: expense?.expense_date || new Date().toISOString().split('T')[0],
    notes: expense?.notes || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const data = {
        quotation_id: quotationId,
        description: formData.description,
        category: formData.category,
        amount: parseFloat(formData.amount),
        expense_date: formData.expense_date,
        notes: formData.notes || null,
      };

      if (expense) {
        const { error } = await supabase
          .from('quotation_expenses')
          .update(data)
          .eq('id', expense.id);

        if (error) throw error;

        toast({
          title: "Gasto actualizado",
          description: "El gasto se actualizó correctamente",
        });
      } else {
        const { error } = await supabase
          .from('quotation_expenses')
          .insert([data]);

        if (error) throw error;

        toast({
          title: "Gasto registrado",
          description: "El gasto se registró correctamente",
        });
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving expense:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar el gasto",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{expense ? "Editar Gasto" : "Registrar Gasto"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="description">Descripción *</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ej: Materiales de construcción"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Categoría *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              required
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {EXPENSE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="amount">Monto *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <Label htmlFor="expense_date">Fecha del Gasto *</Label>
            <Input
              id="expense_date"
              type="date"
              value={formData.expense_date}
              onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Notas adicionales..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Guardando..." : expense ? "Actualizar" : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};