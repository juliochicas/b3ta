import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

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
  item: QuotationItem;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditQuotationItemModal = ({ item, onClose, onSuccess }: Props) => {
  const [itemName, setItemName] = useState(item.item_name);
  const [description, setDescription] = useState(item.description || "");
  const [quantity, setQuantity] = useState(item.quantity.toString());
  const [unitPrice, setUnitPrice] = useState(item.unit_price.toString());
  const [discountPercentage, setDiscountPercentage] = useState(item.discount_percentage.toString());
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const calculateTotal = () => {
    const qty = parseFloat(quantity) || 0;
    const price = parseFloat(unitPrice) || 0;
    const discount = parseFloat(discountPercentage) || 0;
    const subtotal = qty * price;
    return subtotal - (subtotal * (discount / 100));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!itemName.trim()) {
      toast({
        title: "Error",
        description: "El nombre del item es requerido",
        variant: "destructive",
      });
      return;
    }

    const qty = parseFloat(quantity);
    const price = parseFloat(unitPrice);
    const discount = parseFloat(discountPercentage) || 0;

    if (isNaN(qty) || qty <= 0) {
      toast({
        title: "Error",
        description: "La cantidad debe ser mayor a 0",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(price) || price < 0) {
      toast({
        title: "Error",
        description: "El precio unitario debe ser válido",
        variant: "destructive",
      });
      return;
    }

    if (discount < 0 || discount > 100) {
      toast({
        title: "Error",
        description: "El descuento debe estar entre 0 y 100",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const total = calculateTotal();

      const { error } = await supabase
        .from('quotation_items')
        .update({
          item_name: itemName.trim(),
          description: description.trim() || null,
          quantity: qty,
          unit_price: price,
          discount_percentage: discount,
          total: total,
        })
        .eq('id', item.id);

      if (error) throw error;

      toast({
        title: "Item actualizado",
        description: "El item se ha actualizado exitosamente",
      });

      onSuccess();
    } catch (error) {
      console.error("Error updating item:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el item",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Item</DialogTitle>
          <DialogDescription>
            Modifica los detalles del item de la cotización
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="itemName">Nombre del Item *</Label>
            <Input
              id="itemName"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Nombre del producto o servicio"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción detallada (opcional)"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="quantity">Cantidad *</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="1"
                required
              />
            </div>

            <div>
              <Label htmlFor="unitPrice">Precio Unitario *</Label>
              <Input
                id="unitPrice"
                type="number"
                step="0.01"
                min="0"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <Label htmlFor="discount">Descuento (%)</Label>
              <Input
                id="discount"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="bg-muted p-4 rounded-md">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total del Item:</span>
              <span className="text-2xl font-bold text-primary">
                ${calculateTotal().toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Cambios
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
