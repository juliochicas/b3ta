import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ReportsList } from "@/components/reports/ReportsList";
import { CreateReportModal } from "@/components/reports/CreateReportModal";
import { CRMNavigation } from "@/components/crm/CRMNavigation";
import { User } from "@supabase/supabase-js";

export default function Reports() {
  const [showCreateReport, setShowCreateReport] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
      checkUserRole(session.user.id);
    });
  }, [navigate]);

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Informes de Consultoría</h1>
            <p className="text-muted-foreground">
              Gestiona informes previos a las cotizaciones con evidencia multimedia
            </p>
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
