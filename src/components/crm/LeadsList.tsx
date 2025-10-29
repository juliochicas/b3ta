import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Search, Filter, Sparkles } from "lucide-react";
import { LeadCard } from "./LeadCard";
import { LeadDetailModal } from "./LeadDetailModal";
import { useToast } from "@/hooks/use-toast";

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  service_interest: string | null;
  message: string | null;
  status: string;
  priority: string;
  ai_score: number | null;
  ai_summary: string | null;
  created_at: string;
  last_contact: string | null;
  notes: string | null;
}

export const LeadsList = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    loadLeads();

    // Suscripción a cambios en tiempo real
    const channel = supabase
      .channel('leads-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads_b3ta' }, (payload) => {
        console.log('Lead change:', payload);
        loadLeads();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    // Filtrar leads
    let filtered = leads;

    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(lead => lead.status === filterStatus);
    }

    setFilteredLeads(filtered);
  }, [searchTerm, filterStatus, leads]);

  const loadLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads_b3ta')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setLeads(data || []);
      setFilteredLeads(data || []);
    } catch (error) {
      console.error('Error loading leads:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los leads",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeAllLeads = async () => {
    toast({
      title: "Analizando leads...",
      description: "La IA está analizando todos los leads sin calificar",
    });

    const unanalyzedLeads = leads.filter(lead => !lead.ai_score);

    for (const lead of unanalyzedLeads) {
      try {
        await supabase.functions.invoke('ai-lead-scorer', {
          body: { leadId: lead.id }
        });
      } catch (error) {
        console.error(`Error analyzing lead ${lead.id}:`, error);
      }
    }

    toast({
      title: "Análisis completado",
      description: `Se analizaron ${unanalyzedLeads.length} leads`,
    });

    loadLeads();
  };

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando leads...</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, email o empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-background"
            >
              <option value="all">Todos</option>
              <option value="new">Nuevos</option>
              <option value="contacted">Contactados</option>
              <option value="qualified">Calificados</option>
              <option value="converted">Convertidos</option>
              <option value="lost">Perdidos</option>
            </select>

            <Button
              variant="outline"
              onClick={analyzeAllLeads}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Analizar Todos con IA
            </Button>
          </div>
        </div>

        <div className="text-sm text-muted-foreground mb-4">
          Mostrando {filteredLeads.length} de {leads.length} leads
        </div>

        <div className="space-y-4">
          {filteredLeads.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No se encontraron leads</p>
            </div>
          ) : (
            filteredLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onClick={() => setSelectedLead(lead)}
              />
            ))
          )}
        </div>
      </Card>

      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={loadLeads}
        />
      )}
    </>
  );
};