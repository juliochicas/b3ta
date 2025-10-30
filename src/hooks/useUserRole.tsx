import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

type UserRole = 'admin' | 'sales' | 'user' | null;

export const useUserRole = () => {
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserRole();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      loadUserRole();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const loadUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error loading user role:', error);
        setRole(null);
      } else {
        setRole(data?.role as UserRole);
      }
    } catch (error) {
      console.error('Error in loadUserRole:', error);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = role === 'admin';
  const isSales = role === 'sales';
  const hasAccess = isAdmin || isSales;

  return {
    role,
    loading,
    isAdmin,
    isSales,
    hasAccess,
    refetch: loadUserRole,
  };
};
