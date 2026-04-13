"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MeetingCalendar } from "@/components/meetings/MeetingCalendar";
import { AvailabilitySettings } from "@/components/meetings/AvailabilitySettings";
import { Calendar, Settings } from "lucide-react";
import { CRMNavigation } from "@/components/crm/CRMNavigation";
import { User } from "@supabase/supabase-js";

export default function Meetings() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setUser(session.user);
        checkUserRole(session.user.id);
      }
    };

    checkAuth();
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

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Gestión de Reuniones</h1>
          <p className="text-muted-foreground">Organiza y administra tus reuniones</p>
        </div>
        <Tabs defaultValue="calendar" className="space-y-6">
          <TabsList>
            <TabsTrigger value="calendar" className="gap-2">
              <Calendar className="h-4 w-4" />
              Calendario
            </TabsTrigger>
            <TabsTrigger value="availability" className="gap-2">
              <Settings className="h-4 w-4" />
              Disponibilidad
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <MeetingCalendar />
          </TabsContent>

          <TabsContent value="availability">
            <AvailabilitySettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
