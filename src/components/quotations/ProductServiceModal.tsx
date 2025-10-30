import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AITextHelper } from "@/components/reports/AITextHelper";

interface ProductService {
  id: string;
  name: string;
  description: string | null;
  type: string;
  unit_price: number;
  currency: string;
  is_active: boolean;
}

interface Props {
  item?: ProductService;
  onClose: () => void;
  onSuccess: () => void;
}

export const ProductServiceModal = ({ item, onClose, onSuccess }: Props) => {
  const [formData, setFormData] = useState({
    name: item?.name || "",
    description: item?.description || "",
    type: item?.type || "service",
    unit_price: item?.unit_price?.toString() || "",
    currency: item?.currency || "USD",
    is_active: item?.is_active ?? true,
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
        type: formData.type,
        unit_price: parseFloat(formData.unit_price),
        currency: formData.currency,
        is_active: formData.is_active,
      };

      if (item) {
        const { error } = await supabase
          .from('products_services')
          .update(data)
          .eq('id', item.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products_services')
          .insert([data]);

        if (error) throw error;
      }

      toast({
        title: item ? "Actualizado" : "Creado",
        description: `El producto/servicio se ${item ? 'actualizó' : 'creó'} correctamente`,
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el producto/servicio",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {item ? "Editar" : "Nuevo"} Producto/Servicio
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="description">Descripción</Label>
                <AITextHelper
                  text={formData.description}
                  section="product_description"
                  onTextImproved={(newText) => setFormData({ ...formData, description: newText })}
                />
              </div>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Tipo *</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  required
                >
                  <option value="product">Producto</option>
                  <option value="service">Servicio</option>
                  <option value="hourly">Por Hora</option>
                </select>
              </div>

              <div>
                <Label htmlFor="unit_price">Precio Unitario *</Label>
                <Input
                  id="unit_price"
                  type="number"
                  step="0.01"
                  value={formData.unit_price}
                  onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currency">Moneda *</Label>
                <select
                  id="currency"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  required
                >
                  <option value="USD">USD - Dólar</option>
                  <option value="MXN">MXN - Peso Mexicano</option>
                  <option value="EUR">EUR - Euro</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-8">
                <input
                  id="is_active"
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="is_active" className="cursor-pointer">
                  Activo
                </Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
