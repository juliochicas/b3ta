import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Mail, Star, Settings, Trash2 } from "lucide-react";
import { EmailAccountModal } from "./EmailAccountModal";

interface EmailAccount {
  id: string;
  email: string;
  display_name: string;
  smtp_host: string;
  smtp_port: number;
  imap_host: string;
  imap_port: number;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
}

interface EmailAccountsManagerProps {
  onSelectAccount?: (accountId: string) => void;
  selectedAccountId?: string;
}

export const EmailAccountsManager = ({ 
  onSelectAccount, 
  selectedAccountId 
}: EmailAccountsManagerProps) => {
  const [accounts, setAccounts] = useState<EmailAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<EmailAccount | null>(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from("email_accounts")
        .select("*")
        .eq("is_active", true)
        .order("is_default", { ascending: false })
        .order("email");

      if (error) throw error;
      setAccounts(data || []);

      // Auto-seleccionar la cuenta por defecto si no hay ninguna seleccionada
      if (!selectedAccountId && data && data.length > 0) {
        const defaultAccount = data.find(acc => acc.is_default) || data[0];
        onSelectAccount?.(defaultAccount.id);
      }
    } catch (error: any) {
      console.error("Error loading email accounts:", error);
      toast.error("Error al cargar las cuentas de correo");
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (accountId: string) => {
    try {
      const { error } = await supabase
        .from("email_accounts")
        .update({ is_default: true })
        .eq("id", accountId);

      if (error) throw error;
      toast.success("Cuenta predeterminada actualizada");
      loadAccounts();
    } catch (error: any) {
      console.error("Error setting default account:", error);
      toast.error("Error al establecer cuenta predeterminada");
    }
  };

  const handleDelete = async (accountId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta cuenta de correo?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("email_accounts")
        .update({ is_active: false })
        .eq("id", accountId);

      if (error) throw error;
      toast.success("Cuenta eliminada exitosamente");
      loadAccounts();
    } catch (error: any) {
      console.error("Error deleting account:", error);
      toast.error("Error al eliminar la cuenta");
    }
  };

  if (loading) {
    return <div className="p-4">Cargando cuentas...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Cuentas de Correo
        </h3>
        <Button onClick={() => setShowModal(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Cuenta
        </Button>
      </div>

      <div className="grid gap-3">
        {accounts.map((account) => (
          <Card
            key={account.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedAccountId === account.id ? "border-primary border-2 shadow-sm" : ""
            }`}
            onClick={() => onSelectAccount?.(account.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base flex items-center gap-2">
                    {account.display_name}
                    {account.is_default && (
                      <Badge variant="default" className="text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Predeterminada
                      </Badge>
                    )}
                    {selectedAccountId === account.id && (
                      <Badge variant="secondary" className="text-xs">
                        Activa
                      </Badge>
                    )}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {account.email}
                  </p>
                </div>
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  {!account.is_default && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefault(account.id)}
                      title="Establecer como predeterminada"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingAccount(account);
                      setShowModal(true);
                    }}
                    title="Configurar"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(account.id)}
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}

        {accounts.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No hay cuentas de correo configuradas</p>
              <Button onClick={() => setShowModal(true)} className="mt-4" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primera Cuenta
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <EmailAccountModal
        open={showModal}
        onOpenChange={(open) => {
          setShowModal(open);
          if (!open) setEditingAccount(null);
        }}
        account={editingAccount}
        onSuccess={() => {
          loadAccounts();
          setShowModal(false);
          setEditingAccount(null);
        }}
      />
    </div>
  );
};
