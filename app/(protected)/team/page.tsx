"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { CRMNavigation } from "@/components/crm/CRMNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Copy, Shield, User as UserIcon, Briefcase } from "lucide-react";

interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
}

export default function Team() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    checkAuthData();
  }, []);

  const checkAuthData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) return;

      setCurrentUser(session.user);

      // Check current user role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (!roleError && roleData) {
        setCurrentUserRole(roleData.role);

        // If it's an admin, load team
        if (roleData.role === 'admin') {
          await loadTeamMembers();
        } else {
          toast({
            title: "Acceso Restringido",
            description: "Solo los administradores pueden gestionar el equipo",
            variant: "destructive"
          });
          router.push('/crm');
        }
      } else {
        router.push('/crm');
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTeamMembers = async () => {
    try {
      // 1. Fetch profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // 2. Fetch roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      // Merge data
      const merged: UserProfile[] = (profilesData || []).map(profile => {
        const userRole = rolesData?.find(r => r.user_id === profile.id);
        return {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          role: userRole?.role || 'user'
        };
      });

      setProfiles(merged);
    } catch (error) {
      console.error("Error loading team:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar la lista del equipo",
        variant: "destructive"
      });
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      setIsUpdating(userId);

      // Upsert the role
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: newRole as any
        }, { onConflict: 'user_id' });

      if (error) throw error;

      toast({
        title: "Rol actualizado",
        description: "Los permisos del usuario han sido guardados"
      });

      // Update local state
      setProfiles(profiles.map(p =>
        p.id === userId ? { ...p, role: newRole } : p
      ));

    } catch (error: any) {
      console.error("Error updating role:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el rol",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const copyInviteLink = () => {
    const link = `${window.location.origin}/auth`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Enlace copiado",
      description: "Envía este enlace a tus técnicos para que se registren"
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <CRMNavigation userEmail={currentUser?.email} userRole={currentUserRole} />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Equipo de Trabajo</h1>
            <p className="text-muted-foreground mt-1">
              Administra los accesos y roles (técnicos, ventas, administradores)
            </p>
          </div>

          <Button onClick={copyInviteLink} className="shrink-0 gap-2">
            <Copy className="h-4 w-4" />
            Copiar Enlace de Invitación
          </Button>
        </div>

        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle>Miembros del Sistema</CardTitle>
            <CardDescription>
              A cada miembro puedes asignarle un rol que define a qué pantallas tiene acceso.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {profiles.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No se encontraron usuarios
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {profiles.map(profile => (
                  <div key={profile.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold uppercase">
                        {profile.full_name?.substring(0,2) || profile.email?.substring(0,2)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{profile.full_name || 'Usuario B3TA'}</p>
                        <p className="text-sm text-muted-foreground">{profile.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground hidden sm:flex">
                        {profile.role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
                        {profile.role === 'sales' && <Briefcase className="h-3 w-3 mr-1" />}
                        {profile.role === 'user' && <UserIcon className="h-3 w-3 mr-1" />}
                        {profile.role === 'admin' ? 'Administrador' : profile.role === 'sales' ? 'Técnico / Ventas' : 'Básico'}
                      </div>

                      <Select
                        disabled={isUpdating === profile.id || profile.id === currentUser?.id}
                        value={profile.role}
                        onValueChange={(val) => updateUserRole(profile.id, val)}
                      >
                        <SelectTrigger className="w-[160px]">
                          {isUpdating === profile.id ? (
                            <Loader2 className="h-4 w-4 animate-spin ml-2" />
                          ) : (
                            <SelectValue />
                          )}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrador</SelectItem>
                          <SelectItem value="sales">Técnico/Ventas</SelectItem>
                          <SelectItem value="user">Básico</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Guía de Roles
              </h4>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Administrador:</strong> Acceso total al CRM, reportes, cotizaciones y gestión de equipo.</li>
                <li><strong>Técnico / Ventas:</strong> Puede crear y editar reportes de consultoría, gestionar leads y ver cotizaciones.</li>
                <li><strong>Básico:</strong> Rol por defecto. Solo puede ver información pública si se le comparte un enlace.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
