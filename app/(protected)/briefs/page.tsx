"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CRMNavigation } from "@/components/crm/CRMNavigation";
import { BriefsList } from "@/components/briefs/BriefsList";
import { FileText, ExternalLink } from "lucide-react";
import { User } from "@supabase/supabase-js";

export default function BriefsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string>("user");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .maybeSingle()
          .then(({ data }) => {
            if (data?.role) setUserRole(data.role);
          });
      }
    });
  }, []);

  return (
    <>
      <CRMNavigation userEmail={user?.email} userRole={userRole} />
      <main className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <FileText className="h-8 w-8" />
              Briefs Creativos
            </h1>
            <p className="text-muted-foreground">
              Requerimientos recibidos de clientes
            </p>
          </div>
          <a
            href="/brief"
            target="_blank"
            className="inline-flex items-center gap-2 text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Ver formulario publico
          </a>
        </div>
        <BriefsList />
      </main>
    </>
  );
}
