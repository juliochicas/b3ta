import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EmailComposer } from "@/components/email/EmailComposer";
import { EmailList } from "@/components/email/EmailList";
import { EmailViewer } from "@/components/email/EmailViewer";
import { EmailSetupGuide } from "@/components/email/EmailSetupGuide";
import { EmailAccountsManager } from "@/components/email/EmailAccountsManager";
import {
  Inbox,
  Send,
  Star,
  Trash2,
  Mail,
  Search,
  RefreshCw,
  HelpCircle,
  AlertOctagon,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CRMNavigation } from "@/components/crm/CRMNavigation";
import { User } from "@supabase/supabase-js";

const Email = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showComposer, setShowComposer] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("inbox");
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);
      checkUserRole(session.user.id);
    };

    checkAuth();
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

  const handleSync = async () => {
    if (!selectedAccountId) {
      toast.error("Por favor selecciona una cuenta de correo primero");
      return;
    }

    try {
      toast.info("Sincronizando correos...");
      
      const { data, error } = await supabase.functions.invoke("poll-emails-imap", {
        body: { accountId: selectedAccountId }
      });
      
      if (error) throw error;
      
      if (data?.saved > 0) {
        toast.success(`${data.saved} correos nuevos recibidos`);
        window.location.reload(); // Recargar para mostrar los nuevos correos
      } else {
        toast.info("No hay correos nuevos");
      }
    } catch (error: any) {
      console.error("Error syncing emails:", error);
      toast.error(error.message || "Error al sincronizar. Verifica la configuración IMAP.");
    }
  };

  const handleReply = (email: any) => {
    setShowComposer(true);
  };

  const folders = [
    { id: "inbox", label: "Bandeja de entrada", icon: Inbox },
    { id: "sent", label: "Enviados", icon: Send },
    { id: "starred", label: "Destacados", icon: Star },
    { id: "spam", label: "Spam", icon: AlertOctagon },
    { id: "trash", label: "Papelera", icon: Trash2 },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <CRMNavigation userEmail={user?.email} userRole={userRole} />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Correo Electrónico</h1>
          <p className="text-muted-foreground">Gestiona tus correos electrónicos</p>
        </div>
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-180px)]">
          {/* Sidebar */}
          <div className="col-span-3 space-y-4 overflow-y-auto">
            <Button 
              onClick={() => setShowComposer(true)} 
              className="w-full"
              disabled={!selectedAccountId}
            >
              <Mail className="mr-2 h-4 w-4" />
              Nuevo Correo
            </Button>

            {/* Gestor de Cuentas */}
            <Card className="p-4">
              <EmailAccountsManager 
                selectedAccountId={selectedAccountId}
                onSelectAccount={setSelectedAccountId}
              />
            </Card>

            <Separator />

            {/* Carpetas */}
            <Card className="p-2">
              <div className="space-y-1">
                {folders.map((folder) => (
                  <Button
                    key={folder.id}
                    variant={selectedFolder === folder.id ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      setSelectedFolder(folder.id);
                      setSelectedEmail(null);
                    }}
                  >
                    <folder.icon className="mr-2 h-4 w-4" />
                    {folder.label}
                  </Button>
                ))}
              </div>
            </Card>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleSync}
              disabled={!selectedAccountId}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Sincronizar
            </Button>

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setShowSetupGuide(true)}
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              Guía de Configuración
            </Button>
          </div>

          {/* Email List */}
          <div className="col-span-4 border-r">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar correos..."
                  className="pl-10"
                />
              </div>
            </div>

            <div className="overflow-y-auto h-[calc(100%-60px)]">
              <EmailList
                folder={selectedFolder}
                onEmailSelect={setSelectedEmail}
                selectedEmail={selectedEmail}
                accountId={selectedAccountId}
              />
            </div>
          </div>

          {/* Email Viewer */}
          <div className="col-span-5 border-l">
            <EmailViewer
              email={selectedEmail}
              onBack={() => setSelectedEmail(null)}
              onReply={handleReply}
              onEmailChange={() => window.location.reload()}
            />
          </div>
        </div>
      </main>

      <EmailComposer
        open={showComposer}
        onOpenChange={setShowComposer}
        accountId={selectedAccountId}
        onSuccess={() => {
          toast.success("Correo enviado");
          setSelectedFolder("sent");
        }}
      />

      <Dialog open={showSetupGuide} onOpenChange={setShowSetupGuide}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configuración del Correo Electrónico</DialogTitle>
          </DialogHeader>
          <EmailSetupGuide />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Email;
