import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Building2, MessageSquare, Star, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

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

interface LeadCardProps {
  lead: Lead;
  onClick: () => void;
}

export const LeadCard = ({ lead, onClick }: LeadCardProps) => {
  const statusColors = {
    new: "bg-status-new",
    contacted: "bg-status-contacted",
    qualified: "bg-status-qualified",
    converted: "bg-status-converted",
    lost: "bg-status-lost"
  };

  const priorityColors = {
    high: "border-priority-high bg-priority-high-bg",
    medium: "border-priority-medium bg-priority-medium-bg",
    low: "border-priority-low bg-priority-low-bg"
  };

  const serviceLabels: Record<string, string> = {
    sap: "Procesos",
    web: "Páginas Web",
    mvp: "MVP",
    ecommerce: "E-commerce",
    automation: "Automatización",
    ia: "IA Corporativa",
    "china-imports": "Importaciones China",
    multiple: "Múltiples"
  };

  return (
    <Card
      className={`p-6 cursor-pointer hover:shadow-lg transition-all ${
        priorityColors[lead.priority as keyof typeof priorityColors] || ''
      } border-l-4`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-bold">{lead.name}</h3>
            <Badge className={`${statusColors[lead.status as keyof typeof statusColors]} text-primary-foreground`}>
              {lead.status}
            </Badge>
            {lead.ai_score && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-warning text-warning" />
                {lead.ai_score}/100
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {lead.email}
            </div>
            
            {lead.company && (
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                {lead.company}
              </div>
            )}

            {lead.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {lead.phone}
              </div>
            )}

            {lead.service_interest && (
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                {serviceLabels[lead.service_interest] || lead.service_interest}
              </div>
            )}
          </div>
        </div>

        <div className="text-right text-sm text-muted-foreground">
          <div className="flex items-center gap-1 mb-1">
            <Clock className="h-3 w-3" />
            {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true, locale: es })}
          </div>
          {lead.last_contact && (
            <div className="text-xs text-status-completed">
              Contactado
            </div>
          )}
        </div>
      </div>

      {lead.ai_summary && (() => {
        try {
          const analysis = JSON.parse(lead.ai_summary);
          return (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {analysis.summary || lead.ai_summary}
              </p>
            </div>
          );
        } catch (e) {
          return (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {lead.ai_summary}
              </p>
            </div>
          );
        }
      })()}
    </Card>
  );
};