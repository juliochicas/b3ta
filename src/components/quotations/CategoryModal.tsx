import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
}

interface Props {
  category?: Category;
  onClose: () => void;
  onSuccess: () => void;
}

export const CategoryModal = ({ category, onClose, onSuccess }: Props) => {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    description: category?.description || "",
    is_active: category?.is_active ?? true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const data = {
        name: formData.name,
        description: formData.description || null,
        is_active: formData.is_active,
      };

      if (category) {
        const { error } = await supabase
          .from('expense_categories')
          .update(data)
          .eq('id', category.id);

        if (error) throw error;

        toast({
          title: "Categoría actualizada",
          description: "La categoría se actualizó correctamente",
        });
      } else {
        const { error } = await supabase
          .from('expense_categories')
          .insert([data]);

        if (error) throw error;

        toast({
          title: "Categoría creada",
          description: "La categoría se creó correctamente",
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error("Error saving category:", error);
      toast({
        title: "Error",
        description: error.message?.includes('duplicate') 
          ? "Ya existe una categoría con ese nombre"
          : "No se pudo guardar la categoría",
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
          <DialogTitle>{category ? "Editar Categoría" : "Nueva Categoría"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Materiales de construcción"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción de la categoría..."
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="is_active">Categoría activa</Label>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Guardando..." : category ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};