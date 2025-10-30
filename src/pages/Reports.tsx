import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { ReportsList } from "@/components/reports/ReportsList";
import { CreateReportModal } from "@/components/reports/CreateReportModal";

export default function Reports() {
  const [showCreateReport, setShowCreateReport] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
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
              <h1 className="text-4xl font-bold text-foreground mb-2">Informes de Consultoría</h1>
              <p className="text-muted-foreground">
                Gestiona informes previos a las cotizaciones con evidencia multimedia
              </p>
            </div>
          </div>
          
          <Button onClick={() => setShowCreateReport(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Informe
          </Button>
        </div>

        <ReportsList />
      </div>

      {showCreateReport && (
        <CreateReportModal
          onClose={() => setShowCreateReport(false)}
          onSuccess={() => setShowCreateReport(false)}
        />
      )}
    </div>
  );
}
