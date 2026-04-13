"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { LeadsList } from "@/components/crm/LeadsList";
import { CRMStats } from "@/components/crm/CRMStats";
import { useToast } from "@/hooks/use-toast";
import { CRMNavigation } from "@/components/crm/CRMNavigation";

export default function CRM() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        checkUserRole(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        checkUserRole(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        // Si no tiene rol, podría ser el primer usuario
      }

      setUserRole(data?.role || null);
    } catch (error) {
      console.error('Error checking role:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    });
    router.push('/auth');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando CRM...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <CRMNavigation userEmail={user?.email} userRole={userRole} />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Panel de Gestión de Leads</h1>
          <p className="text-muted-foreground">Administra y da seguimiento a tus leads</p>
        </div>
        <CRMStats />
        <LeadsList />
      </main>
    </div>
  );
}
