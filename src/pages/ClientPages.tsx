import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2, ExternalLink, Copy, ArrowLeft, Upload, Globe, Eye, RefreshCw, Lock, LockOpen, Sparkles, FileUp, History, UserPen, UserPlus, Settings2, CalendarDays, DollarSign, RotateCw, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { GrandSlamGenerator } from "@/components/quotations/GrandSlamGenerator";
import { useUserRole } from "@/hooks/useUserRole";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface ClientPage {
  id: string;
  slug: string;
  title: string;
  customer_id: string | null;
  html_storage_path: string;
  is_active: boolean;
  created_at: string;
  page_password: string | null;
  service_type: string;
  service_start_date: string | null;
  service_expiration_date: string | null;
  monthly_fee: number | null;
  currency: string;
  renewal_conditions: string | null;
  auto_renew: boolean;
  last_payment_date: string | null;
  next_payment_date: string | null;
  custom_domain: string | null;
  domain_status: string;
  customers?: { name: string; company: string | null } | null;
}

interface Customer {
  id: string;
  name: string;
  company: string | null;
}

export default function ClientPages() {
  const navigate = useNavigate();
  const { isAdmin, isSales, loading: roleLoading } = useUserRole();
  const [pages, setPages] = useState<ClientPage[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [htmlPreview, setHtmlPreview] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [pagePassword, setPagePassword] = useState("");
  const [usePassword, setUsePassword] = useState(false);
  const [grandSlamPage, setGrandSlamPage] = useState<ClientPage | null>(null);
  const [grandSlamHtml, setGrandSlamHtml] = useState<string | null>(null);
  const [editPasswordPage, setEditPasswordPage] = useState<ClientPage | null>(null);
  const [editPassword, setEditPassword] = useState("");
  const [editUsePassword, setEditUsePassword] = useState(false);
  const [replacingPageId, setReplacingPageId] = useState<string | null>(null);
  const [savedQuotations, setSavedQuotations] = useState<any[]>([]);
  const [viewingSavedResult, setViewingSavedResult] = useState<any | null>(null);
  const [viewingSavedId, setViewingSavedId] = useState<string | null>(null);
  const [editCustomerPage, setEditCustomerPage] = useState<ClientPage | null>(null);
  const [editCustomerId, setEditCustomerId] = useState<string>("");
  const [showQuickCustomer, setShowQuickCustomer] = useState(false);
  const [quickName, setQuickName] = useState("");
  const [quickEmail, setQuickEmail] = useState("");
  const [quickCompany, setQuickCompany] = useState("");
  const [quickPhone, setQuickPhone] = useState("");
  const [creatingCustomer, setCreatingCustomer] = useState(false);
  const [deleteConfirmPage, setDeleteConfirmPage] = useState<ClientPage | null>(null);
  // Service management state
  const [servicePageEdit, setServicePageEdit] = useState<ClientPage | null>(null);
  const [svcType, setSvcType] = useState("test");
  const [svcStartDate, setSvcStartDate] = useState("");
  const [svcExpirationDate, setSvcExpirationDate] = useState("");
  const [svcMonthlyFee, setSvcMonthlyFee] = useState("");
  const [svcCurrency, setSvcCurrency] = useState("USD");
  const [svcRenewalConditions, setSvcRenewalConditions] = useState("");
  const [svcAutoRenew, setSvcAutoRenew] = useState(false);
  const [svcLastPayment, setSvcLastPayment] = useState("");
  const [svcNextPayment, setSvcNextPayment] = useState("");
  const [svcCustomDomain, setSvcCustomDomain] = useState("");
  const [svcDomainStatus, setSvcDomainStatus] = useState("none");

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let pwd = '';
    for (let i = 0; i < 8; i++) pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    setPagePassword(pwd);
    setUsePassword(true);
  };

  const generateEditPassword = () => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let pwd = '';
    for (let i = 0; i < 8; i++) pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    setEditPassword(pwd);
    setEditUsePassword(true);
  };

  const openEditPassword = (page: ClientPage) => {
    setEditPasswordPage(page);
    setEditPassword(page.page_password || "");
    setEditUsePassword(!!page.page_password);
  };

  const savePassword = async () => {
    if (!editPasswordPage) return;
    const newPwd = editUsePassword && editPassword ? editPassword : null;
    const { error } = await supabase
      .from('client_pages')
      .update({ page_password: newPwd })
      .eq('id', editPasswordPage.id);
    if (error) {
      toast.error("Error al actualizar contraseña");
    } else {
      toast.success(newPwd ? "Contraseña actualizada" : "Protección removida");
      setEditPasswordPage(null);
      loadData();
    }
  };

  useEffect(() => {
    if (!roleLoading && !isAdmin && !isSales) {
      navigate('/auth');
      return;
    }
    if (!roleLoading) {
      loadData();
    }
  }, [roleLoading, isAdmin, isSales]);

  const loadData = async () => {
    setLoading(true);
    const [pagesRes, customersRes, savedRes] = await Promise.all([
      supabase.from('client_pages').select('*, customers(name, company)').order('created_at', { ascending: false }),
      supabase.from('customers').select('id, name, company').order('name'),
      supabase.from('generated_quotations').select('*').order('created_at', { ascending: false }),
    ]);
    setPages((pagesRes.data as ClientPage[]) || []);
    setCustomers(customersRes.data || []);
    setSavedQuotations(savedRes.data || []);
    setLoading(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleTitleChange = (val: string) => {
    setNewTitle(val);
    setNewSlug(generateSlug(val));
  };

  const handleUpload = async () => {
    if (!selectedFile || !newTitle || !newSlug) {
      toast.error("Completa título y archivo HTML");
      return;
    }

    // Check slug uniqueness
    const { data: existing } = await supabase
      .from('client_pages')
      .select('id')
      .eq('slug', newSlug)
      .maybeSingle();

    if (existing) {
      toast.error("Ya existe una página con ese slug");
      return;
    }

    setUploading(true);
    try {
      const storagePath = `${newSlug}/${selectedFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from('client-pages')
        .upload(storagePath, selectedFile, {
          contentType: 'text/html',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase
        .from('client_pages')
        .insert({
          slug: newSlug,
          title: newTitle,
          customer_id: selectedCustomer || null,
          html_storage_path: storagePath,
          page_password: usePassword && pagePassword ? pagePassword : null,
        });

      if (insertError) throw insertError;

      toast.success("Página creada exitosamente");
      setShowForm(false);
      setNewTitle("");
      setNewSlug("");
      setSelectedCustomer("");
      setSelectedFile(null);
      setPagePassword("");
      setUsePassword(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Error al subir la página");
    } finally {
      setUploading(false);
    }
  };

  const toggleActive = async (page: ClientPage) => {
    const { error } = await supabase
      .from('client_pages')
      .update({ is_active: !page.is_active })
      .eq('id', page.id);

    if (error) {
      toast.error("Error al actualizar");
    } else {
      toast.success(page.is_active ? "Página desactivada" : "Página activada");
      loadData();
    }
  };

  const deletePage = async (page: ClientPage) => {
    // Delete storage file
    await supabase.storage.from('client-pages').remove([page.html_storage_path]);
    // Delete record
    const { error } = await supabase.from('client_pages').delete().eq('id', page.id);
    if (error) {
      toast.error("Error al eliminar");
    } else {
      toast.success("Página eliminada");
      loadData();
    }
  };

  const copyUrl = (slug: string) => {
    const publishedDomain = 'https://www.b3ta.us';
    const url = `${publishedDomain}/p/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("URL copiada al portapapeles");
  };

  const replaceFile = async (page: ClientPage, file: File) => {
    setReplacingPageId(page.id);
    try {
      // Delete old file
      await supabase.storage.from('client-pages').remove([page.html_storage_path]);

      // Upload new file with same path
      const storagePath = `${page.slug}/${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('client-pages')
        .upload(storagePath, file, { contentType: 'text/html', upsert: true });
      if (uploadError) throw uploadError;

      // Update path in DB if filename changed
      if (storagePath !== page.html_storage_path) {
        const { error: updateError } = await supabase
          .from('client_pages')
          .update({ html_storage_path: storagePath })
          .eq('id', page.id);
        if (updateError) throw updateError;
      }

      toast.success("Archivo HTML reemplazado exitosamente");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Error al reemplazar archivo");
    } finally {
      setReplacingPageId(null);
    }
  };

  const openGrandSlam = async (page: ClientPage) => {
    // Download HTML content for the page
    const { data: fileData, error } = await supabase.storage
      .from('client-pages')
      .download(page.html_storage_path);

    if (error || !fileData) {
      toast.error("No se pudo cargar el HTML de la página");
      return;
    }

    const text = await fileData.text();
    setGrandSlamHtml(text);
    setGrandSlamPage(page);
  };

  const openEditCustomer = (page: ClientPage) => {
    setEditCustomerPage(page);
    setEditCustomerId(page.customer_id || "");
  };

  const saveCustomer = async () => {
    if (!editCustomerPage) return;
    const { error } = await supabase
      .from('client_pages')
      .update({ customer_id: editCustomerId && editCustomerId !== "none" ? editCustomerId : null })
      .eq('id', editCustomerPage.id);
    if (error) {
      toast.error("Error al actualizar cliente");
    } else {
      toast.success("Cliente actualizado");
      setEditCustomerPage(null);
      loadData();
    }
  };

  const createQuickCustomer = async () => {
    if (!quickName || !quickEmail) {
      toast.error("Nombre y email son requeridos");
      return;
    }
    setCreatingCustomer(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("No autenticado");

      const { data, error } = await supabase
        .from('customers')
        .insert({
          name: quickName,
          email: quickEmail,
          company: quickCompany || null,
          phone: quickPhone || null,
          created_by: user.user.id,
        })
        .select('id')
        .single();
      if (error) throw error;

      toast.success("Cliente creado");
      if (editCustomerPage) {
        setEditCustomerId(data.id);
      } else {
        setSelectedCustomer(data.id);
      }
      setShowQuickCustomer(false);
      setQuickName(""); setQuickEmail(""); setQuickCompany(""); setQuickPhone("");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Error al crear cliente");
    } finally {
      setCreatingCustomer(false);
    }
  };

  const openServiceEdit = (page: ClientPage) => {
    setServicePageEdit(page);
    setSvcType(page.service_type || "test");
    setSvcStartDate(page.service_start_date || "");
    setSvcExpirationDate(page.service_expiration_date || "");
    setSvcMonthlyFee(page.monthly_fee?.toString() || "");
    setSvcCurrency(page.currency || "USD");
    setSvcRenewalConditions(page.renewal_conditions || "");
    setSvcAutoRenew(page.auto_renew || false);
    setSvcLastPayment(page.last_payment_date || "");
    setSvcNextPayment(page.next_payment_date || "");
    setSvcCustomDomain(page.custom_domain || "");
    setSvcDomainStatus(page.domain_status || "none");
  };

  const saveService = async () => {
    if (!servicePageEdit) return;
    const { error } = await supabase
      .from('client_pages')
      .update({
        service_type: svcType,
        service_start_date: svcStartDate || null,
        service_expiration_date: svcExpirationDate || null,
        monthly_fee: svcMonthlyFee ? parseFloat(svcMonthlyFee) : 0,
        currency: svcCurrency,
        renewal_conditions: svcRenewalConditions || null,
        auto_renew: svcAutoRenew,
        last_payment_date: svcLastPayment || null,
        next_payment_date: svcNextPayment || null,
        custom_domain: svcCustomDomain || null,
        domain_status: svcDomainStatus,
      })
      .eq('id', servicePageEdit.id);
    if (error) {
      toast.error("Error al actualizar servicio");
    } else {
      toast.success("Información de servicio actualizada");
      setServicePageEdit(null);
      loadData();
    }
  };

  const getServiceBadge = (type: string) => {
    switch (type) {
      case 'active': return <Badge className="bg-primary text-primary-foreground">Servicio Activo</Badge>;
      case 'expired': return <Badge variant="destructive">Expirado</Badge>;
      case 'cancelled': return <Badge variant="secondary">Cancelado</Badge>;
      default: return <Badge variant="outline">Prueba</Badge>;
    }
  };

  const handleGrandSlamApply = (result: any) => {
    // Navigate to quotations with the grand slam data
    setGrandSlamPage(null);
    setGrandSlamHtml(null);
    navigate('/quotations', { state: { grandSlamResult: result, fromClientPage: true } });
    toast.success("Redirigiendo a cotizaciones con la oferta Grand Slam...");
  };

  if (roleLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/reports')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Globe className="h-6 w-6" />
                Páginas de Clientes
              </h1>
              <p className="text-sm text-muted-foreground">
                Sube archivos HTML para que tus clientes vean sus proyectos
              </p>
            </div>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Página
          </Button>
        </div>

        {/* Upload Form */}
        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Subir nueva página HTML</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input
                    value={newTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Ej: Reporte IM Producciones"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slug (URL)</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">/p/</span>
                    <Input
                      value={newSlug}
                      onChange={(e) => setNewSlug(e.target.value)}
                      placeholder="reporte-im-producciones"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Cliente (opcional)</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowQuickCustomer(true)} className="h-7 text-xs gap-1">
                    <UserPlus className="h-3 w-3" />
                    Crear nuevo
                  </Button>
                </div>
                <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cliente..." />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} {c.company ? `(${c.company})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Archivo HTML</Label>
                <Input
                  type="file"
                  accept=".html,.htm"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setSelectedFile(file);
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setHtmlPreview(event.target?.result as string);
                      };
                      reader.readAsText(file);
                    }
                  }}
                />
              </div>

              {/* Password protection */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Switch checked={usePassword} onCheckedChange={(v) => { setUsePassword(v); if (v && !pagePassword) generatePassword(); }} />
                  <Label className="flex items-center gap-2">
                    {usePassword ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />}
                    Proteger con contraseña
                  </Label>
                </div>
                {usePassword && (
                  <div className="flex items-center gap-2">
                    <Input
                      value={pagePassword}
                      onChange={(e) => setPagePassword(e.target.value)}
                      placeholder="Contraseña"
                      className="font-mono"
                    />
                    <Button type="button" variant="outline" size="icon" onClick={generatePassword} title="Generar nueva contraseña">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(pagePassword); toast.success("Contraseña copiada"); }}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => setShowPreview(true)} 
                  disabled={uploading || !selectedFile}
                  variant="outline"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Previsualizar
                </Button>
                <Button onClick={handleUpload} disabled={uploading || !selectedFile}>
                  <Upload className="mr-2 h-4 w-4" />
                  {uploading ? "Subiendo..." : "Subir Página"}
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pages List */}
        {pages.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">No hay páginas aún</p>
              <p className="text-muted-foreground">Sube tu primer archivo HTML para comenzar</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {pages.map((page) => (
              <Card key={page.id}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{page.title}</h3>
                        <Badge variant={page.is_active ? "default" : "secondary"}>
                          {page.is_active ? "Activa" : "Inactiva"}
                        </Badge>
                        {getServiceBadge(page.service_type)}
                        {page.custom_domain && (
                          <Badge variant="outline" className="gap-1">
                            <Globe className="h-3 w-3" />
                            {page.custom_domain}
                          </Badge>
                        )}
                      {page.page_password && (
                        <Badge variant="outline" className="gap-1 cursor-pointer" onClick={() => { navigator.clipboard.writeText(page.page_password!); toast.success("Contraseña copiada"); }} title="Clic para copiar contraseña">
                          <Lock className="h-3 w-3" />
                          Protegida
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">/p/{page.slug}</p>
                      {page.customers && (
                        <p className="text-sm text-muted-foreground">
                          Cliente: {page.customers.name}
                          {page.customers.company ? ` (${page.customers.company})` : ''}
                        </p>
                      )}
                      {!page.customers && (
                        <p className="text-sm text-muted-foreground italic">Sin cliente asignado</p>
                      )}
                      {page.service_type === 'active' && page.next_payment_date && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <CalendarDays className="h-3 w-3" />
                          Próximo cobro: {new Date(page.next_payment_date).toLocaleDateString('es-GT')}
                          {page.monthly_fee ? ` — $${page.monthly_fee} ${page.currency}` : ''}
                        </p>
                      )}
                      {page.service_type === 'expired' && page.service_expiration_date && (
                        <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                          <CalendarDays className="h-3 w-3" />
                          Expiró: {new Date(page.service_expiration_date).toLocaleDateString('es-GT')}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Primary: Toggle active */}
                      <Switch
                        checked={page.is_active}
                        onCheckedChange={() => toggleActive(page)}
                      />
                      {/* Primary: View page */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(`https://www.b3ta.us/p/${page.slug}`, '_blank')}
                        title="Ver página"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      {/* Primary: Copy URL */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyUrl(page.slug)}
                        title="Copiar URL"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      {/* Dropdown for all other actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuItem onClick={() => openServiceEdit(page)}>
                            <Settings2 className="h-4 w-4 mr-2" />
                            Gestionar servicio
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditCustomer(page)}>
                            <UserPen className="h-4 w-4 mr-2" />
                            Editar cliente
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditPassword(page)}>
                            {page.page_password ? <Lock className="h-4 w-4 mr-2" /> : <LockOpen className="h-4 w-4 mr-2" />}
                            {page.page_password ? "Cambiar contraseña" : "Agregar contraseña"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <label className="cursor-pointer flex items-center">
                              <FileUp className="h-4 w-4 mr-2" />
                              {replacingPageId === page.id ? "Subiendo..." : "Reemplazar HTML"}
                              <input
                                type="file"
                                accept=".html,.htm"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) replaceFile(page, file);
                                  e.target.value = '';
                                }}
                              />
                            </label>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openGrandSlam(page)}>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Generar cotización
                          </DropdownMenuItem>
                          {savedQuotations.filter(sq => sq.client_page_id === page.id).length > 0 && (
                            <DropdownMenuItem onClick={() => {
                              const saved = savedQuotations.filter(sq => sq.client_page_id === page.id);
                              const latest = saved[0];
                              setViewingSavedResult(latest.result_json);
                              setViewingSavedId(latest.id);
                              setGrandSlamPage(page);
                            }}>
                              <History className="h-4 w-4 mr-2" />
                              Ver cotizaciones ({savedQuotations.filter(sq => sq.client_page_id === page.id).length})
                            </DropdownMenuItem>
                          )}
                          {isAdmin && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => setDeleteConfirmPage(page)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar página
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Preview Modal */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl h-[80vh] p-0">
            <DialogHeader className="px-6 pt-6 pb-4 border-b">
              <DialogTitle>Previsualizar HTML</DialogTitle>
              <DialogDescription>
                Verifica cómo se verá tu página antes de publicarla
              </DialogDescription>
            </DialogHeader>
            {htmlPreview ? (
              <iframe
                srcDoc={htmlPreview}
                title="Preview HTML"
                className="w-full flex-1 border-0"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            ) : (
              <div className="flex items-center justify-center h-96">
                <p className="text-muted-foreground">No hay contenido para previsualizar</p>
              </div>
            )}
            <DialogFooter className="px-6 py-4 border-t">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Grand Slam Generator Modal */}
        <GrandSlamGenerator
          open={!!grandSlamPage}
          onClose={() => { setGrandSlamPage(null); setGrandSlamHtml(null); setViewingSavedResult(null); setViewingSavedId(null); loadData(); }}
          onApply={handleGrandSlamApply}
          htmlContent={grandSlamHtml}
          customerName={grandSlamPage?.customers?.name}
          customerCompany={grandSlamPage?.customers?.company || undefined}
          clientPageId={grandSlamPage?.id}
          savedResult={viewingSavedResult}
          savedId={viewingSavedId}
        />
        {/* Edit Password Modal */}
        <Dialog open={!!editPasswordPage} onOpenChange={(open) => !open && setEditPasswordPage(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Contraseña de página</DialogTitle>
              <DialogDescription>
                {editPasswordPage?.title} — Configura o cambia la contraseña de acceso
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3">
                <Switch checked={editUsePassword} onCheckedChange={(v) => { setEditUsePassword(v); if (v && !editPassword) generateEditPassword(); }} />
                <Label className="flex items-center gap-2">
                  {editUsePassword ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />}
                  Proteger con contraseña
                </Label>
              </div>
              {editUsePassword && (
                <div className="flex items-center gap-2">
                  <Input
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="Contraseña"
                    className="font-mono"
                  />
                  <Button type="button" variant="outline" size="icon" onClick={generateEditPassword} title="Generar nueva">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(editPassword); toast.success("Contraseña copiada"); }}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditPasswordPage(null)}>Cancelar</Button>
              <Button onClick={savePassword}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Edit Customer Modal */}
        <Dialog open={!!editCustomerPage} onOpenChange={(open) => !open && setEditCustomerPage(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar cliente asignado</DialogTitle>
              <DialogDescription>
                {editCustomerPage?.title} — Selecciona o cambia el cliente
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between">
                <Label>Cliente</Label>
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowQuickCustomer(true)} className="h-7 text-xs gap-1">
                  <UserPlus className="h-3 w-3" />
                  Crear nuevo
                </Button>
              </div>
              <Select value={editCustomerId} onValueChange={setEditCustomerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cliente..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin cliente</SelectItem>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} {c.company ? `(${c.company})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditCustomerPage(null)}>Cancelar</Button>
              <Button onClick={saveCustomer}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Quick Customer Creation Modal */}
        <Dialog open={showQuickCustomer} onOpenChange={setShowQuickCustomer}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Crear cliente rápido
              </DialogTitle>
              <DialogDescription>
                Agrega un nuevo cliente al sistema
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="space-y-1">
                <Label>Nombre *</Label>
                <Input value={quickName} onChange={(e) => setQuickName(e.target.value)} placeholder="Nombre completo" />
              </div>
              <div className="space-y-1">
                <Label>Email *</Label>
                <Input type="email" value={quickEmail} onChange={(e) => setQuickEmail(e.target.value)} placeholder="email@ejemplo.com" />
              </div>
              <div className="space-y-1">
                <Label>Empresa</Label>
                <Input value={quickCompany} onChange={(e) => setQuickCompany(e.target.value)} placeholder="Nombre de la empresa" />
              </div>
              <div className="space-y-1">
                <Label>Teléfono</Label>
                <Input value={quickPhone} onChange={(e) => setQuickPhone(e.target.value)} placeholder="+502 1234 5678" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowQuickCustomer(false)}>Cancelar</Button>
              <Button onClick={createQuickCustomer} disabled={creatingCustomer}>
                {creatingCustomer ? "Creando..." : "Crear Cliente"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Service Management Modal */}
        <Dialog open={!!servicePageEdit} onOpenChange={(open) => !open && setServicePageEdit(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings2 className="h-5 w-5" />
                Gestión de Servicio
              </DialogTitle>
              <DialogDescription>
                {servicePageEdit?.title}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto space-y-6 py-2 pr-1">
              {/* Section 1: Service Type & Status */}
              <div className="rounded-lg border p-4 space-y-4">
                <h4 className="text-sm font-semibold text-foreground">Estado del Servicio</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Tipo</Label>
                    <Select value={svcType} onValueChange={setSvcType}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="test">Prueba / Demo</SelectItem>
                        <SelectItem value="active">Servicio Activo</SelectItem>
                        <SelectItem value="expired">Expirado</SelectItem>
                        <SelectItem value="cancelled">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Inicio</Label>
                    <Input type="date" value={svcStartDate} onChange={(e) => setSvcStartDate(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Expiración</Label>
                    <Input type="date" value={svcExpirationDate} onChange={(e) => setSvcExpirationDate(e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Section 2: Billing */}
              <div className="rounded-lg border p-4 space-y-4">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Facturación
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Cuota mensual</Label>
                    <Input type="number" step="0.01" value={svcMonthlyFee} onChange={(e) => setSvcMonthlyFee(e.target.value)} placeholder="0.00" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Moneda</Label>
                    <Select value={svcCurrency} onValueChange={setSvcCurrency}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="GTQ">GTQ</SelectItem>
                        <SelectItem value="MXN">MXN</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Último pago</Label>
                    <Input type="date" value={svcLastPayment} onChange={(e) => setSvcLastPayment(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Próximo cobro</Label>
                    <Input type="date" value={svcNextPayment} onChange={(e) => setSvcNextPayment(e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Section 3: Renewal */}
              <div className="rounded-lg border p-4 space-y-4">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <RotateCw className="h-4 w-4" />
                  Renovación
                </h4>
                <div className="flex items-center gap-3">
                  <Switch checked={svcAutoRenew} onCheckedChange={setSvcAutoRenew} />
                  <Label className="text-sm">Renovación automática</Label>
                </div>
                <Textarea
                  value={svcRenewalConditions}
                  onChange={(e) => setSvcRenewalConditions(e.target.value)}
                  placeholder="Ej: Pago mensual de $50 USD. Renovación cada 12 meses. Incluye hosting y mantenimiento básico."
                  rows={2}
                  className="text-sm"
                />
              </div>

              {/* Section 4: Custom Domain */}
              <div className="rounded-lg border p-4 space-y-4">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Dominio Personalizado
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Dominio</Label>
                    <Input
                      value={svcCustomDomain}
                      onChange={(e) => setSvcCustomDomain(e.target.value)}
                      placeholder="micliente.com"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Estado</Label>
                    <Select value={svcDomainStatus} onValueChange={setSvcDomainStatus}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sin dominio</SelectItem>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="active">Activo</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {svcCustomDomain && (
                  <div className="rounded-md bg-muted p-3 text-xs space-y-1.5">
                    <p className="font-semibold">Instrucciones DNS:</p>
                    <p>Crear registro <strong>CNAME</strong> o <strong>redirect</strong> hacia:</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-background p-1.5 rounded text-xs font-mono truncate">
                        https://www.b3ta.us/p/{servicePageEdit?.slug}
                      </code>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="shrink-0 h-7 text-xs"
                        onClick={() => {
                          navigator.clipboard.writeText(`https://www.b3ta.us/p/${servicePageEdit?.slug}`);
                          toast.success("URL copiada");
                        }}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copiar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter className="pt-4 border-t">
              <Button variant="outline" onClick={() => setServicePageEdit(null)}>Cancelar</Button>
              <Button onClick={saveService}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteConfirmPage} onOpenChange={(open) => !open && setDeleteConfirmPage(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar página?</AlertDialogTitle>
              <AlertDialogDescription>
                Se eliminará "{deleteConfirmPage?.title}" permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => { if (deleteConfirmPage) { deletePage(deleteConfirmPage); setDeleteConfirmPage(null); } }}>
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
