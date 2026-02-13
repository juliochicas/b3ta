import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ClientPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [htmlUrl, setHtmlUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('client_pages')
          .select('html_storage_path')
          .eq('slug', slug)
          .eq('is_active', true)
          .single();

        if (fetchError || !data) {
          setError(true);
          return;
        }

        const { data: urlData } = supabase.storage
          .from('client-pages')
          .getPublicUrl(data.html_storage_path);

        setHtmlUrl(urlData.publicUrl);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

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

  if (error || !htmlUrl) {
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
      src={htmlUrl}
      title="Página del cliente"
      className="w-full h-screen border-0"
      sandbox="allow-scripts allow-same-origin allow-popups"
    />
  );
}
