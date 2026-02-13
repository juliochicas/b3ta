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
import { Plus, Trash2, ExternalLink, Copy, ArrowLeft, Upload, Globe, Eye, RefreshCw, Lock, LockOpen, Sparkles, FileUp } from "lucide-react";
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
  customers?: { name: string; company: string | null } | null;
}

interface Customer {
  id: string;
  name: string;
  company: string | null;
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
    const [pagesRes, customersRes] = await Promise.all([
      supabase.from('client_pages').select('*, customers(name, company)').order('created_at', { ascending: false }),
      supabase.from('customers').select('id, name, company').order('name'),
    ]);
    setPages((pagesRes.data as any[]) || []);
    setCustomers(customersRes.data || []);
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
        } as any);

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
                <Label>Cliente (opcional)</Label>
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
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Switch
                        checked={page.is_active}
                        onCheckedChange={() => toggleActive(page)}
                      />
                      {/* Replace file button */}
                      <label title="Reemplazar archivo HTML" className="cursor-pointer">
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
                        <div className="inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent hover:text-accent-foreground">
                          {replacingPageId === page.id ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <FileUp className="h-4 w-4" />
                          )}
                        </div>
                      </label>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditPassword(page)}
                        title="Editar contraseña"
                      >
                        {page.page_password ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyUrl(page.slug)}
                        title="Copiar URL"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openGrandSlam(page)}
                        title="Generar Cotización Grand Slam"
                        className="text-primary"
                      >
                        <Sparkles className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(`/p/${page.slug}`, '_blank')}
                        title="Ver página"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      {isAdmin && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar página?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Se eliminará "{page.title}" permanentemente.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deletePage(page)}>
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
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
          onClose={() => { setGrandSlamPage(null); setGrandSlamHtml(null); }}
          onApply={handleGrandSlamApply}
          htmlContent={grandSlamHtml}
          customerName={grandSlamPage?.customers?.name}
          customerCompany={grandSlamPage?.customers?.company || undefined}
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
      </div>
    </div>
  );
}
