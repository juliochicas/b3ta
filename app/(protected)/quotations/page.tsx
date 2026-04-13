"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, Package, FolderOpen, BarChart3 } from "lucide-react";
import { ProductsServicesList } from "@/components/quotations/ProductsServicesList";
import { QuotationsList } from "@/components/quotations/QuotationsList";
import { CreateQuotationModal } from "@/components/quotations/CreateQuotationModal";
import { ProductServiceModal } from "@/components/quotations/ProductServiceModal";
import { CategoriesManagement } from "@/components/quotations/CategoriesManagement";
import { FinancialReport } from "@/components/quotations/FinancialReport";
import { CRMNavigation } from "@/components/crm/CRMNavigation";
import { User } from "@supabase/supabase-js";

export default function Quotations() {
  const [activeTab, setActiveTab] = useState("quotations");
  const [showCreateQuotation, setShowCreateQuotation] = useState(false);
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        checkUserRole(session.user.id);
      }
    });
  }, []);

  const checkUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (!error) {
        setUserRole(data?.role || null);
      }
    } catch (error) {
      console.error('Error checking role:', error);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <CRMNavigation userEmail={user?.email} userRole={userRole} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Cotizaciones</h1>
          <p className="text-muted-foreground">
            Gestiona productos, servicios y genera cotizaciones profesionales
          </p>
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
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Reportes Financieros
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
              disabled={activeTab === "categories" || activeTab === "reports"}
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

          <TabsContent value="reports" className="space-y-4">
            <FinancialReport />
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
