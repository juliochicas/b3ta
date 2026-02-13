import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ClientPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [pageUrl, setPageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [pageData, setPageData] = useState<{ html_storage_path: string; page_password: string | null } | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('client_pages')
          .select('html_storage_path, page_password')
          .eq('slug', slug)
          .eq('is_active', true)
          .maybeSingle();

        if (fetchError || !data) {
          setError(true);
          return;
        }

        if ((data as any).page_password) {
          setPageData(data as any);
          setNeedsPassword(true);
          return;
        }

        loadPage(data.html_storage_path);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  const loadPage = (storagePath: string) => {
    const { data: urlData } = supabase.storage
      .from('client-pages')
      .getPublicUrl(storagePath);

    if (!urlData?.publicUrl) {
      setError(true);
      return;
    }

    // Use cache-busting to ensure latest version
    setPageUrl(urlData.publicUrl + `?t=${Date.now()}`);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageData) return;

    if (passwordInput === pageData.page_password) {
      setNeedsPassword(false);
      setLoading(true);
      loadPage(pageData.html_storage_path);
      setLoading(false);
    } else {
      setPasswordError(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando página...</p>
        </div>
      </div>
    );
  }

  if (needsPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-sm w-full">
          <CardContent className="py-8 text-center">
            <Lock className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-bold mb-2">Página protegida</h2>
            <p className="text-muted-foreground mb-6 text-sm">
              Ingresa la contraseña para acceder a este contenido.
            </p>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2 text-left">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={passwordInput}
                  onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }}
                  placeholder="••••••••"
                  autoFocus
                />
                {passwordError && (
                  <p className="text-sm text-destructive">Contraseña incorrecta</p>
                )}
              </div>
              <Button type="submit" className="w-full">Acceder</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !pageUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="py-12 text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Página no disponible</h2>
            <p className="text-muted-foreground mb-6">
              Esta página no existe o ha sido desactivada.
            </p>
            <div className="space-y-3">
              <Button onClick={() => navigate('/')} className="w-full">Ir al inicio</Button>
              <Button variant="outline" onClick={() => window.location.href = 'mailto:hi@b3ta.us'} className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Contactar soporte
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <iframe
      src={pageUrl}
      title="Página del cliente"
      className="w-full h-screen border-0"
      allow="downloads"
    />
  );
}