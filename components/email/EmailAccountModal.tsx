"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EmailAccount {
  id: string;
  email: string;
  display_name: string;
  smtp_host: string;
  smtp_port: number;
  imap_host: string;
  imap_port: number;
  is_default: boolean;
}

interface EmailAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account?: EmailAccount | null;
  onSuccess: () => void;
}

export const EmailAccountModal = ({
  open,
  onOpenChange,
  account,
  onSuccess,
}: EmailAccountModalProps) => {
  const [formData, setFormData] = useState({
    email: "",
    display_name: "",
    password: "",
    smtp_host: "smtp.hostinger.com",
    smtp_port: 465,
    imap_host: "imap.hostinger.com",
    imap_port: 993,
    is_default: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (account) {
      setFormData({
        email: account.email,
        display_name: account.display_name,
        password: "", // No mostramos la contraseña existente
        smtp_host: account.smtp_host,
        smtp_port: account.smtp_port,
        imap_host: account.imap_host,
        imap_port: account.imap_port,
        is_default: account.is_default,
      });
    } else {
      setFormData({
        email: "",
        display_name: "",
        password: "",
        smtp_host: "smtp.hostinger.com",
        smtp_port: 465,
        imap_host: "imap.hostinger.com",
        imap_port: 993,
        is_default: false,
      });
    }
  }, [account, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.display_name) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    if (!account && !formData.password) {
      toast.error("La contraseña es requerida para nuevas cuentas");
      return;
    }

    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No hay usuario autenticado");

      const accountData = {
        email: formData.email,
        display_name: formData.display_name,
        smtp_host: formData.smtp_host,
        smtp_port: formData.smtp_port,
        imap_host: formData.imap_host,
        imap_port: formData.imap_port,
        password_encrypted: formData.password, // En producción se debe encriptar
        is_default: formData.is_default,
        is_active: true,
        created_by: user.id,
      };

      if (account) {
        // Actualizar cuenta existente
        const updateData: any = { ...accountData };
        if (!formData.password) {
          delete updateData.password_encrypted; // No actualizar si está vacío
        }

        const { error } = await supabase
          .from("email_accounts")
          .update(updateData)
          .eq("id", account.id);

        if (error) throw error;
        toast.success("Cuenta actualizada exitosamente");
      } else {
        // Crear nueva cuenta
        const { error } = await supabase
          .from("email_accounts")
          .insert([accountData]);

        if (error) throw error;
        toast.success("Cuenta creada exitosamente");
      }

      onSuccess();
    } catch (error: any) {
      console.error("Error saving email account:", error);
      toast.error(error.message || "Error al guardar la cuenta");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {account ? "Editar Cuenta de Correo" : "Nueva Cuenta de Correo"}
          </DialogTitle>
        </DialogHeader>
        <span className="sr-only">Formulario para configurar cuenta de correo electrónico IMAP/SMTP</span>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="email">Correo Electrónico *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="correo@dominio.com"
                disabled={!!account}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="display_name">Nombre de Visualización *</Label>
              <Input
                id="display_name"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                placeholder="Ej: Ventas, Soporte, Personal"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="password">
                Contraseña {account && "(dejar vacío para no cambiar)"}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Contraseña del correo"
              />
            </div>

            <div>
              <Label htmlFor="smtp_host">Servidor SMTP</Label>
              <Input
                id="smtp_host"
                value={formData.smtp_host}
                onChange={(e) => setFormData({ ...formData, smtp_host: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="smtp_port">Puerto SMTP</Label>
              <Input
                id="smtp_port"
                type="number"
                value={formData.smtp_port}
                onChange={(e) => setFormData({ ...formData, smtp_port: parseInt(e.target.value) })}
              />
            </div>

            <div>
              <Label htmlFor="imap_host">Servidor IMAP</Label>
              <Input
                id="imap_host"
                value={formData.imap_host}
                onChange={(e) => setFormData({ ...formData, imap_host: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="imap_port">Puerto IMAP</Label>
              <Input
                id="imap_port"
                type="number"
                value={formData.imap_port}
                onChange={(e) => setFormData({ ...formData, imap_port: parseInt(e.target.value) })}
              />
            </div>

            <div className="col-span-2 flex items-center space-x-2">
              <Switch
                id="is_default"
                checked={formData.is_default}
                onCheckedChange={(checked) => setFormData({ ...formData, is_default: checked })}
              />
              <Label htmlFor="is_default">Establecer como cuenta predeterminada</Label>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Guardando..." : account ? "Actualizar" : "Crear Cuenta"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
