import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, Package, ArrowLeft, FolderOpen } from "lucide-react";
import { ProductsServicesList } from "@/components/quotations/ProductsServicesList";
import { QuotationsList } from "@/components/quotations/QuotationsList";
import { CreateQuotationModal } from "@/components/quotations/CreateQuotationModal";
import { ProductServiceModal } from "@/components/quotations/ProductServiceModal";
import { CategoriesManagement } from "@/components/quotations/CategoriesManagement";

export default function Quotations() {
  const [activeTab, setActiveTab] = useState("quotations");
  const [showCreateQuotation, setShowCreateQuotation] = useState(false);
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar autenticación
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/crm')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Cotizaciones</h1>
              <p className="text-muted-foreground">
                Gestiona productos, servicios y genera cotizaciones profesionales
              </p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="quotations" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Cotizaciones
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Productos y Servicios
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                Categorías de Gastos
              </TabsTrigger>
            </TabsList>

            <Button
              onClick={() => {
                if (activeTab === "quotations") {
                  setShowCreateQuotation(true);
                } else if (activeTab === "products") {
                  setShowCreateProduct(true);
                }
              }}
              disabled={activeTab === "categories"}
            >
              <Plus className="mr-2 h-4 w-4" />
              {activeTab === "quotations" ? "Nueva Cotización" : 
               activeTab === "products" ? "Nuevo Producto/Servicio" : 
               ""}
            </Button>
          </div>

          <TabsContent value="quotations" className="space-y-4">
            <QuotationsList />
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <ProductsServicesList />
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <CategoriesManagement />
          </TabsContent>
        </Tabs>
      </div>

      {showCreateQuotation && (
        <CreateQuotationModal
          onClose={() => setShowCreateQuotation(false)}
          onSuccess={() => {
            setShowCreateQuotation(false);
            setActiveTab("quotations");
          }}
        />
      )}

      {showCreateProduct && (
        <ProductServiceModal
          onClose={() => setShowCreateProduct(false)}
          onSuccess={() => setShowCreateProduct(false)}
        />
      )}
    </div>
  );
}
