import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, TrendingUp, Clock, Star } from "lucide-react";

export const CRMStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    avgScore: 0
  });

  useEffect(() => {
    loadStats();

    // Suscribirse a cambios en tiempo real
    const channel = supabase
      .channel('leads-stats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads_b3ta' }, () => {
        loadStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadStats = async () => {
    try {
      // Total de leads
      const { count: total } = await supabase
        .from('leads_b3ta')
        .select('*', { count: 'exact', head: true });

      // Leads nuevos (últimos 7 días)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { count: newLeads } = await supabase
        .from('leads_b3ta')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString());

      // Leads contactados
      const { count: contacted } = await supabase
        .from('leads_b3ta')
        .select('*', { count: 'exact', head: true })
        .not('last_contact', 'is', null);

      // Score promedio
      const { data: scoresData } = await supabase
        .from('leads_b3ta')
        .select('ai_score')
        .not('ai_score', 'is', null);

      const avgScore = scoresData && scoresData.length > 0
        ? Math.round(scoresData.reduce((sum, l) => sum + (l.ai_score || 0), 0) / scoresData.length)
        : 0;

      setStats({
        total: total || 0,
        new: newLeads || 0,
        contacted: contacted || 0,
        avgScore
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const statCards = [
    {
      icon: Users,
      label: "Total Leads",
      value: stats.total,
      color: "text-blue-600"
    },
    {
      icon: TrendingUp,
      label: "Nuevos (7 días)",
      value: stats.new,
      color: "text-green-600"
    },
    {
      icon: Clock,
      label: "Contactados",
      value: stats.contacted,
      color: "text-orange-600"
    },
    {
      icon: Star,
      label: "Score Promedio",
      value: `${stats.avgScore}/100`,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, idx) => (
        <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <stat.icon className={`h-8 w-8 ${stat.color}`} />
          </div>
          <div className="text-3xl font-bold mb-1">{stat.value}</div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
        </Card>
      ))}
    </div>
  );
};