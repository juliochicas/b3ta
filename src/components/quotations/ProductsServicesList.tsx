import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, DollarSign, Package } from "lucide-react";
import { ProductServiceModal } from "./ProductServiceModal";

interface ProductService {
  id: string;
  name: string;
  description: string | null;
  type: string;
  unit_price: number;
  currency: string;
  is_active: boolean;
}

export const ProductsServicesList = () => {
  const [items, setItems] = useState<ProductService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<ProductService | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const { data, error } = await supabase
        .from('products_services')
        .select('*')
        .order('name');

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este item?")) return;

    try {
      const { error } = await supabase
        .from('products_services')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Eliminado",
        description: "El item se eliminó correctamente",
      });
      loadItems();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el item",
        variant: "destructive",
      });
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      product: "Producto",
      service: "Servicio",
      hourly: "Por Hora",
    };
    return labels[type] || type;
  };

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                <Badge variant={item.is_active ? "default" : "secondary"}>
                  {getTypeLabel(item.type)}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingItem(item)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteItem(item.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>

            {item.description && (
              <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
            )}

            <div className="flex items-center gap-2 text-2xl font-bold text-primary">
              <DollarSign className="h-5 w-5" />
              {item.unit_price.toFixed(2)} {item.currency}
              {item.type === "hourly" && <span className="text-sm font-normal text-muted-foreground">/hora</span>}
            </div>

            {!item.is_active && (
              <Badge variant="secondary" className="mt-4">
                Inactivo
              </Badge>
            )}
          </Card>
        ))}

        {items.length === 0 && (
          <Card className="p-8 col-span-full">
            <div className="text-center text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay productos o servicios registrados</p>
              <p className="text-sm mt-2">Crea tu primer producto para comenzar</p>
            </div>
          </Card>
        )}
      </div>

      {editingItem && (
        <ProductServiceModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSuccess={() => {
            setEditingItem(null);
            loadItems();
          }}
        />
      )}
    </>
  );
};
