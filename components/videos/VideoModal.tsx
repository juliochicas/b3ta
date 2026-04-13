"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles, Wand2 } from "lucide-react";

interface Video {
  id?: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string | null;
  category: string;
  duration: string | null;
  is_featured: boolean;
  display_order: number;
  seo_keywords: string[] | null;
  meta_description: string | null;
}

interface VideoModalProps {
  video: Video | null;
  onClose: () => void;
}

export const VideoModal = ({ video, onClose }: VideoModalProps) => {
  const [formData, setFormData] = useState<Video>({
    title: '',
    description: '',
    video_url: '',
    thumbnail_url: null,
    category: 'other',
    duration: null,
    is_featured: false,
    display_order: 0,
    seo_keywords: null,
    meta_description: null,
  });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [thumbnailLoading, setThumbnailLoading] = useState(false);

  useEffect(() => {
    if (video) {
      setFormData(video);
    }
  }, [video]);

  const handleGenerateThumbnail = async () => {
    if (!formData.title.trim()) {
      toast.error("Agrega un título primero");
      return;
    }

    setThumbnailLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-video-thumbnail', {
        body: { 
          title: formData.title,
          description: formData.description,
          category: formData.category
        }
      });

      if (error) throw error;
      
      if (data?.imageUrl) {
        setFormData(prev => ({
          ...prev,
          thumbnail_url: data.imageUrl
        }));
        toast.success("Thumbnail generado con IA");
      } else {
        throw new Error('No se recibió la imagen');
      }
    } catch (error: any) {
      console.error('Error generating thumbnail:', error);
      toast.error(error.message || "Error al generar thumbnail");
    } finally {
      setThumbnailLoading(false);
    }
  };

  const handleAIImprove = async (field: 'title' | 'description' | 'meta_description' | 'seo_keywords', action: 'improve' | 'persuasive' | 'seo' | 'keywords') => {
    let textToImprove = '';
    
    if (field === 'seo_keywords') {
      // Para keywords, enviamos el título y descripción como contexto
      textToImprove = `Título: ${formData.title}\nDescripción: ${formData.description}`;
    } else {
      textToImprove = field === 'title' ? formData.title : field === 'description' ? formData.description : formData.meta_description || '';
    }
    
    if (!textToImprove.trim()) {
      toast.error("No hay texto para mejorar");
      return;
    }

    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('improve-video-text', {
        body: { 
          text: textToImprove, 
          action,
          videoTitle: formData.title,
          category: formData.category
        }
      });

      if (error) throw error;
      
      if (field === 'seo_keywords') {
        // Para keywords, convertimos el texto mejorado en array
        const keywordsArray = data.improvedText
          .split(',')
          .map((k: string) => k.trim())
          .filter((k: string) => k);
        setFormData(prev => ({
          ...prev,
          seo_keywords: keywordsArray
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [field]: data.improvedText
        }));
      }
      
      toast.success("Texto mejorado con IA");
    } catch (error: any) {
      toast.error(error.message || "Error al mejorar texto");
      console.error(error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSave = {
        ...formData,
        seo_keywords: formData.seo_keywords || [],
      };

      if (video?.id) {
        const { error } = await supabase
          .from('showcase_videos')
          .update(dataToSave)
          .eq('id', video.id);

        if (error) throw error;
        toast.success("Video actualizado exitosamente");
      } else {
        const { error } = await supabase
          .from('showcase_videos')
          .insert([dataToSave]);

        if (error) throw error;
        toast.success("Video agregado exitosamente");
      }

      onClose();
    } catch (error: any) {
      toast.error(error.message || "Error al guardar video");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{video ? 'Editar Video' : 'Nuevo Video'}</DialogTitle>
        </DialogHeader>
        <span className="sr-only">Formulario para gestionar videos de showcase con optimización SEO</span>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="title">Título del Video *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAIImprove('title', 'seo')}
                  disabled={aiLoading}
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Mejorar Título
                </Button>
              </div>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="ej: Implementación de Shopify Plus para..."
              />
            </div>

            <div className="col-span-2">
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="description">Descripción *</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAIImprove('description', 'improve')}
                    disabled={aiLoading}
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    Mejorar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAIImprove('description', 'persuasive')}
                    disabled={aiLoading}
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    Persuasivo
                  </Button>
                </div>
              </div>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                placeholder="Descripción detallada del video y lo que aprenderán..."
              />
            </div>

            <div>
              <Label htmlFor="category">Categoría *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shopify">Shopify</SelectItem>
                  <SelectItem value="sap">Procesos</SelectItem>
                  <SelectItem value="automation">Automatización</SelectItem>
                  <SelectItem value="ai">Inteligencia Artificial</SelectItem>
                  <SelectItem value="landing-pages">Landing Pages</SelectItem>
                  <SelectItem value="websites">Sitios Web</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="duration">Duración (ej: 3:24)</Label>
              <Input
                id="duration"
                value={formData.duration || ''}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="3:24"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="video_url">URL del Video (YouTube/Loom/Vimeo) *</Label>
              <Input
                id="video_url"
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                required
                placeholder="https://youtube.com/watch?v=... o https://loom.com/share/..."
              />
            </div>

            <div className="col-span-2">
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="thumbnail_url">URL de Miniatura</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateThumbnail}
                  disabled={thumbnailLoading || !formData.title.trim()}
                >
                  <Wand2 className="h-3 w-3 mr-1" />
                  {thumbnailLoading ? 'Generando...' : 'Generar con IA'}
                </Button>
              </div>
              <Input
                id="thumbnail_url"
                value={formData.thumbnail_url || ''}
                onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                placeholder="https://... o genera uno con IA"
              />
              {formData.thumbnail_url && (
                <div className="mt-2">
                  <img 
                    src={formData.thumbnail_url} 
                    alt="Preview" 
                    className="w-full h-32 object-cover rounded border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="col-span-2">
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="meta_description">Meta Descripción SEO</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAIImprove('meta_description', 'seo')}
                  disabled={aiLoading}
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Optimizar SEO
                </Button>
              </div>
              <Textarea
                id="meta_description"
                value={formData.meta_description || ''}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                rows={2}
                placeholder="Descripción optimizada para SEO (150-160 caracteres)"
                maxLength={160}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.meta_description?.length || 0}/160 caracteres
              </p>
            </div>

            <div className="col-span-2">
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="seo_keywords">Keywords SEO (separadas por coma)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAIImprove('seo_keywords', 'keywords')}
                  disabled={aiLoading || !formData.title}
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Generar Keywords
                </Button>
              </div>
              <Input
                id="seo_keywords"
                value={formData.seo_keywords?.join(', ') || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  seo_keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k) 
                })}
                placeholder="shopify, e-commerce, implementación, b3ta"
              />
            </div>

            <div>
              <Label htmlFor="display_order">Orden de Visualización</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
              />
              <Label htmlFor="is_featured">Video Destacado</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : video ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
