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
import { Plus, Trash2, ExternalLink, Copy, ArrowLeft, Upload, Globe } from "lucide-react";
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

interface ClientPage {
  id: string;
  slug: string;
  title: string;
  customer_id: string | null;
  html_storage_path: string;
  is_active: boolean;
  created_at: string;
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
        });

      if (insertError) throw insertError;

      toast.success("Página creada exitosamente");
      setShowForm(false);
      setNewTitle("");
      setNewSlug("");
      setSelectedCustomer("");
      setSelectedFile(null);
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
    const url = `${window.location.origin}/p/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("URL copiada al portapapeles");
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
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleUpload} disabled={uploading}>
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
      </div>
    </div>
  );
}
