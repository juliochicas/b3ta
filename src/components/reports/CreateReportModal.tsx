import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  reportToEdit?: {
    id: string;
    report_number: string;
    customer_name: string;
    customer_email: string;
    customer_company: string | null;
    customer_phone: string | null;
    consultant_name: string;
    consultant_signature: string | null;
    sections_config: any;
    current_situation: string | null;
    findings: string | null;
    recommendations: string | null;
    conclusions: string | null;
    lead_id: string | null;
    status?: string;
  };
}

export const CreateReportModal = ({ onClose, onSuccess, leadId, leadData, reportToEdit }: Props) => {
  const [saving, setSaving] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);
  const { toast } = useToast();
  const isEditMode = !!reportToEdit;

  const [formData, setFormData] = useState({
    selectedLeadId: reportToEdit?.lead_id || leadId || "",
    customerName: reportToEdit?.customer_name || leadData?.name || "",
    customerEmail: reportToEdit?.customer_email || leadData?.email || "",
    customerCompany: reportToEdit?.customer_company || leadData?.company || "",
    customerPhone: reportToEdit?.customer_phone || leadData?.phone || "",
    consultantName: reportToEdit?.consultant_name || "",
    currentSituation: reportToEdit?.current_situation || "",
    findings: reportToEdit?.findings || "",
    recommendations: reportToEdit?.recommendations || "",
    conclusions: reportToEdit?.conclusions || "",
    status: (reportToEdit as any)?.status || 'draft',
  });

  const [sectionsConfig, setSectionsConfig] = useState(
    reportToEdit?.sections_config || {
      current_situation: true,
      findings: true,
      multimedia: true,
      recommendations: true,
      conclusions: true,
    }
  );

  const [mediaFiles, setMediaFiles] = useState<Array<{ type: 'photo' | 'video', file?: File, url?: string, caption: string }>>([]);
  const [signature, setSignature] = useState<string>(reportToEdit?.consultant_signature || "");

  useEffect(() => {
    if (!leadId && !isEditMode) loadLeads();
    if (isEditMode) loadExistingMedia();
  }, [leadId, isEditMode]);

  const loadExistingMedia = async () => {
    if (!reportToEdit) return;
    
    const { data, error } = await supabase
      .from('report_media')
      .select('*')
      .eq('report_id', reportToEdit.id);

    if (!error && data) {
      setMediaFiles(data.map(m => ({
        type: m.type as 'photo' | 'video',
        url: m.url,
        caption: m.caption || '',
      })));
    }
  };

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
      console.log('🚀 Iniciando creación de informe...');

      // Verificar autenticación
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error('❌ Error de autenticación:', authError);
        throw new Error('No estás autenticado. Por favor inicia sesión.');
      }
      console.log('✅ Usuario autenticado:', user.email);

      // Verificar roles
      const { data: userRoles, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      
      if (roleError || !userRoles) {
        console.error('❌ Error verificando rol:', roleError);
        throw new Error('Tu usuario no tiene permisos para crear informes. Contacta al administrador.');
      }
      console.log('✅ Rol del usuario:', userRoles.role);

      let report: any;

      if (isEditMode && reportToEdit) {
        // MODO EDICIÓN: Actualizar informe existente
        console.log('✏️ Actualizando informe existente...');
        const { data: updatedReport, error: updateError } = await supabase
          .from('consultation_reports')
          .update({
            lead_id: formData.selectedLeadId || null,
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
            status: formData.status,
          })
          .eq('id', reportToEdit.id)
          .select()
          .single();

        if (updateError) {
          console.error('❌ Error actualizando informe:', updateError);
          throw new Error(`Error actualizando informe: ${updateError.message}`);
        }
        report = updatedReport;
        console.log('✅ Informe actualizado:', report.id);

        // Eliminar media anterior para reemplazar con nueva
        await supabase
          .from('report_media')
          .delete()
          .eq('report_id', report.id);

      } else {
        // MODO CREACIÓN: Crear nuevo informe
        console.log('📝 Generando número de informe...');
        const { data: reportNumber, error: numberError } = await supabase.rpc('generate_report_number');
        if (numberError) {
          console.error('❌ Error generando número:', numberError);
          throw new Error(`Error generando número de informe: ${numberError.message}`);
        }
        console.log('✅ Número generado:', reportNumber);

        console.log('🔗 Generando slug público...');
        const { data: reportSlug, error: slugError } = await supabase.rpc('generate_report_slug');
        if (slugError) {
          console.error('❌ Error generando slug:', slugError);
          throw new Error(`Error generando slug: ${slugError.message}`);
        }
        console.log('✅ Slug generado:', reportSlug);

        console.log('💾 Guardando informe en base de datos...');
        const { data: newReport, error: reportError } = await supabase
          .from('consultation_reports')
          .insert({
            report_number: reportNumber,
            public_slug: reportSlug,
            lead_id: formData.selectedLeadId || null,
            created_by: user.id,
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

        if (reportError) {
          console.error('❌ Error insertando informe:', reportError);
          if (reportError.code === 'PGRST301') {
            throw new Error('No tienes permisos para crear informes. Verifica que tu usuario tenga rol de Admin o Sales.');
          }
          throw new Error(`Error guardando informe: ${reportError.message}`);
        }
        report = newReport;
        console.log('✅ Informe creado:', report.id);
      }

      // Upload media files (continue even if one fails, but log errors)
      const mediaUploadPromises = mediaFiles.map(async (media) => {
        try {
          if (media.file) {
            const fileExt = media.file.name.split('.').pop();
            const fileName = `${report.id}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
            
            const { error: uploadError } = await supabase.storage
              .from('consultation-reports')
              .upload(fileName, media.file, {
                cacheControl: '3600',
                upsert: false,
              });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
              .from('consultation-reports')
              .getPublicUrl(fileName);

            return supabase.from('report_media').insert({
              report_id: report.id,
              type: media.type,
              url: publicUrl,
              is_external: false,
              caption: media.caption || null,
              file_size: media.file.size,
            });
          } else if (media.url) {
            return supabase.from('report_media').insert({
              report_id: report.id,
              type: media.type,
              url: media.url,
              is_external: true,
              caption: media.caption || null,
            });
          }
        } catch (error) {
          console.error('Error uploading media:', error);
          return null;
        }
      });

      await Promise.allSettled(mediaUploadPromises);

      console.log(`✅ ¡Informe ${isEditMode ? 'actualizado' : 'creado'} exitosamente!`);
      toast({
        title: "Éxito",
        description: `Informe ${isEditMode ? 'actualizado' : 'creado'} correctamente`,
      });
      onSuccess();
    } catch (error: any) {
      console.error('❌ Error completo:', error);
      toast({
        title: "Error al crear informe",
        description: error.message || "Ocurrió un error inesperado",
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
          <DialogTitle>
            {isEditMode ? 'Editar Informe de Consultoría' : 'Nuevo Informe de Consultoría'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? 'Modifica el informe existente con análisis, hallazgos y recomendaciones actualizadas.'
              : 'Crea un nuevo informe completo con análisis, hallazgos y recomendaciones para tu cliente.'
            }
          </DialogDescription>
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

          {isEditMode && (
            <div className="space-y-2">
              <Label htmlFor="status">Estado del Informe *</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Borrador</SelectItem>
                  <SelectItem value="completed">Completado</SelectItem>
                  <SelectItem value="sent">Enviado</SelectItem>
                </SelectContent>
              </Select>
              {formData.status === 'sent' && (
                <p className="text-sm text-amber-600 dark:text-amber-500">
                  ⚠️ Al cambiar a "Enviado", el enlace público se activará y será accesible para cualquiera que tenga el link.
                </p>
              )}
            </div>
          )}

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
              {isEditMode ? 'Guardar Cambios' : 'Crear Informe'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
