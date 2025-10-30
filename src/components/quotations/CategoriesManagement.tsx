import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, FolderOpen } from "lucide-react";
import { CategoryModal } from "./CategoryModal";

interface Category {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
}

export const CategoriesManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('expense_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las categorías",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta categoría? Los gastos asociados perderán la categoría.")) return;

    try {
      const { error } = await supabase
        .from('expense_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Categoría eliminada",
        description: "La categoría se eliminó correctamente",
      });
      loadCategories();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la categoría",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando categorías...</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-semibold text-lg">Categorías de Gastos</h3>
            <p className="text-sm text-muted-foreground">
              Gestiona las categorías disponibles para clasificar los gastos
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingCategory(undefined);
              setShowModal(true);
            }}
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nueva Categoría
          </Button>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{category.name}</h4>
                    {!category.is_active && (
                      <Badge variant="secondary">Inactiva</Badge>
                    )}
                  </div>
                  {category.description && (
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditingCategory(category);
                      setShowModal(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteCategory(category.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {categories.length === 0 && (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay categorías registradas</p>
              <p className="text-sm mt-2">Crea tu primera categoría para comenzar</p>
            </div>
          )}
        </div>
      </Card>

      {showModal && (
        <CategoryModal
          category={editingCategory}
          onClose={() => {
            setShowModal(false);
            setEditingCategory(undefined);
          }}
          onSuccess={() => {
            setShowModal(false);
            setEditingCategory(undefined);
            loadCategories();
          }}
        />
      )}
    </>
  );
};