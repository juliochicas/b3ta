import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { MediaUploadSection } from "./MediaUploadSection";
import { SignatureCanvas } from "./SignatureCanvas";
import { AITextHelper } from "./AITextHelper";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  leadId?: string;
  leadData?: {
    name: string;
    email: string;
    company?: string;
    phone?: string;
  };
}

export const CreateReportModal = ({ onClose, onSuccess, leadId, leadData }: Props) => {
  const [saving, setSaving] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    selectedLeadId: leadId || "",
    customerName: leadData?.name || "",
    customerEmail: leadData?.email || "",
    customerCompany: leadData?.company || "",
    customerPhone: leadData?.phone || "",
    consultantName: "",
    currentSituation: "",
    findings: "",
    recommendations: "",
    conclusions: "",
  });

  const [sectionsConfig, setSectionsConfig] = useState({
    current_situation: true,
    findings: true,
    multimedia: true,
    recommendations: true,
    conclusions: true,
  });

  const [mediaFiles, setMediaFiles] = useState<Array<{ type: 'photo' | 'video', file?: File, url?: string, caption: string }>>([]);
  const [signature, setSignature] = useState<string>("");

  useEffect(() => {
    if (!leadId) loadLeads();
  }, [leadId]);

  const loadLeads = async () => {
    const { data } = await supabase
      .from('leads_b3ta')
      .select('id, name, email, company, phone')
      .order('created_at', { ascending: false })
      .limit(100);
    setLeads(data || []);
  };

  const handleLeadSelect = (selectedId: string) => {
    const lead = leads.find(l => l.id === selectedId);
    if (lead) {
      setFormData({
        ...formData,
        selectedLeadId: selectedId,
        customerName: lead.name,
        customerEmail: lead.email,
        customerCompany: lead.company || "",
        customerPhone: lead.phone || "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.consultantName || !formData.customerName || !formData.customerEmail) {
      toast({
        title: "Error",
        description: "Completa todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    if (!signature) {
      toast({
        title: "Error",
        description: "Por favor firma el informe",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);

      const { data: reportNumber, error: numberError } = await supabase.rpc('generate_report_number');
      if (numberError) throw numberError;

      const { data: reportSlug, error: slugError } = await supabase.rpc('generate_report_slug');
      if (slugError) throw slugError;

      const { data: { user } } = await supabase.auth.getUser();

      const { data: report, error: reportError } = await supabase
        .from('consultation_reports')
        .insert({
          report_number: reportNumber,
          public_slug: reportSlug,
          lead_id: formData.selectedLeadId || null,
          created_by: user?.id,
          customer_name: formData.customerName,
          customer_email: formData.customerEmail,
          customer_company: formData.customerCompany || null,
          customer_phone: formData.customerPhone || null,
          sections_config: sectionsConfig,
          current_situation: formData.currentSituation || null,
          findings: formData.findings || null,
          recommendations: formData.recommendations || null,
          conclusions: formData.conclusions || null,
          consultant_name: formData.consultantName,
          consultant_signature: signature,
          status: 'draft',
        })
        .select()
        .single();

      if (reportError) throw reportError;

      // Upload media files
      for (const media of mediaFiles) {
        if (media.file) {
          const fileExt = media.file.name.split('.').pop();
          const fileName = `${report.id}/${Date.now()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage
            .from('consultation-reports')
            .upload(fileName, media.file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('consultation-reports')
            .getPublicUrl(fileName);

          await supabase.from('report_media').insert({
            report_id: report.id,
            type: media.type,
            url: publicUrl,
            is_external: false,
            caption: media.caption,
            file_size: media.file.size,
          });
        } else if (media.url) {
          await supabase.from('report_media').insert({
            report_id: report.id,
            type: media.type,
            url: media.url,
            is_external: true,
            caption: media.caption,
          });
        }
      }

      toast({
        title: "Éxito",
        description: "Informe creado correctamente",
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo Informe de Consultoría</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!leadId && (
            <div className="space-y-2">
              <Label>Vincular a Lead (opcional)</Label>
              <Select value={formData.selectedLeadId} onValueChange={handleLeadSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar lead o crear manual" />
                </SelectTrigger>
                <SelectContent>
                  {leads.map((lead) => (
                    <SelectItem key={lead.id} value={lead.id}>
                      {lead.name} - {lead.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Nombre del Cliente *</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerEmail">Email del Cliente *</Label>
              <Input
                id="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerCompany">Empresa</Label>
              <Input
                id="customerCompany"
                value={formData.customerCompany}
                onChange={(e) => setFormData({ ...formData, customerCompany: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerPhone">Teléfono</Label>
              <Input
                id="customerPhone"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="consultantName">Nombre del Consultor *</Label>
            <Input
              id="consultantName"
              value={formData.consultantName}
              onChange={(e) => setFormData({ ...formData, consultantName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Secciones del Informe</h3>
            
            {sectionsConfig.current_situation && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="currentSituation">Análisis de Situación Actual</Label>
                  <div className="flex items-center gap-2">
                    <AITextHelper
                      text={formData.currentSituation}
                      section="current_situation"
                      onTextImproved={(newText) => setFormData({ ...formData, currentSituation: newText })}
                    />
                    <Switch
                      checked={sectionsConfig.current_situation}
                      onCheckedChange={(checked) => setSectionsConfig({ ...sectionsConfig, current_situation: checked })}
                    />
                  </div>
                </div>
                <Textarea
                  id="currentSituation"
                  value={formData.currentSituation}
                  onChange={(e) => setFormData({ ...formData, currentSituation: e.target.value })}
                  rows={4}
                  placeholder="Describe la situación actual del cliente..."
                />
              </div>
            )}

            {sectionsConfig.findings && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="findings">Hallazgos Principales</Label>
                  <div className="flex items-center gap-2">
                    <AITextHelper
                      text={formData.findings}
                      section="findings"
                      onTextImproved={(newText) => setFormData({ ...formData, findings: newText })}
                    />
                    <Switch
                      checked={sectionsConfig.findings}
                      onCheckedChange={(checked) => setSectionsConfig({ ...sectionsConfig, findings: checked })}
                    />
                  </div>
                </div>
                <Textarea
                  id="findings"
                  value={formData.findings}
                  onChange={(e) => setFormData({ ...formData, findings: e.target.value })}
                  rows={4}
                  placeholder="Describe los hallazgos más importantes..."
                />
              </div>
            )}

            {sectionsConfig.multimedia && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Evidencia Multimedia</Label>
                  <Switch
                    checked={sectionsConfig.multimedia}
                    onCheckedChange={(checked) => setSectionsConfig({ ...sectionsConfig, multimedia: checked })}
                  />
                </div>
                <MediaUploadSection mediaFiles={mediaFiles} setMediaFiles={setMediaFiles} />
              </div>
            )}

            {sectionsConfig.recommendations && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="recommendations">Recomendaciones</Label>
                  <div className="flex items-center gap-2">
                    <AITextHelper
                      text={formData.recommendations}
                      section="recommendations"
                      onTextImproved={(newText) => setFormData({ ...formData, recommendations: newText })}
                    />
                    <Switch
                      checked={sectionsConfig.recommendations}
                      onCheckedChange={(checked) => setSectionsConfig({ ...sectionsConfig, recommendations: checked })}
                    />
                  </div>
                </div>
                <Textarea
                  id="recommendations"
                  value={formData.recommendations}
                  onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
                  rows={4}
                  placeholder="Escribe las recomendaciones para el cliente..."
                />
              </div>
            )}

            {sectionsConfig.conclusions && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="conclusions">Conclusiones</Label>
                  <div className="flex items-center gap-2">
                    <AITextHelper
                      text={formData.conclusions}
                      section="conclusions"
                      onTextImproved={(newText) => setFormData({ ...formData, conclusions: newText })}
                    />
                    <Switch
                      checked={sectionsConfig.conclusions}
                      onCheckedChange={(checked) => setSectionsConfig({ ...sectionsConfig, conclusions: checked })}
                    />
                  </div>
                </div>
                <Textarea
                  id="conclusions"
                  value={formData.conclusions}
                  onChange={(e) => setFormData({ ...formData, conclusions: e.target.value })}
                  rows={4}
                  placeholder="Escribe las conclusiones del análisis..."
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Firma del Consultor *</Label>
            <SignatureCanvas signature={signature} setSignature={setSignature} />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear Informe
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
