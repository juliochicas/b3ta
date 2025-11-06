import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Eye, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Video {
  id: string;
  title: string;
  description: string;
  video_url: string;
  category: string;
  duration: string | null;
  views_count: number;
  is_featured: boolean;
  seo_keywords: string[] | null;
}

interface VideoPlayerModalProps {
  video: Video | null;
  onClose: () => void;
}

const getEmbedUrl = (url: string): string | null => {
  // YouTube
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1`;
  }

  // Loom
  const loomRegex = /loom\.com\/share\/([a-zA-Z0-9]+)/;
  const loomMatch = url.match(loomRegex);
  if (loomMatch) {
    return `https://www.loom.com/embed/${loomMatch[1]}?autoplay=1`;
  }

  // Vimeo
  const vimeoRegex = /vimeo\.com\/(\d+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }

  return null;
};

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    shopify: 'Shopify',
    sap: 'SAP',
    automation: 'Automatización',
    ai: 'IA',
    'landing-pages': 'Landing Pages',
    websites: 'Sitios Web',
    other: 'Otro'
  };
  return labels[category] || category;
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    shopify: 'bg-green-500',
    sap: 'bg-blue-500',
    automation: 'bg-purple-500',
    ai: 'bg-orange-500',
    'landing-pages': 'bg-cyan-500',
    websites: 'bg-indigo-500',
    other: 'bg-gray-500'
  };
  return colors[category] || 'bg-gray-500';
};

export const VideoPlayerModal = ({ video, onClose }: VideoPlayerModalProps) => {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (video) {
      const url = getEmbedUrl(video.video_url);
      setEmbedUrl(url);
      
      // Incrementar contador de vistas
      const incrementViews = async () => {
        await supabase
          .from('showcase_videos')
          .update({ views_count: video.views_count + 1 })
          .eq('id', video.id);
      };
      
      incrementViews();
    }
  }, [video]);

  if (!video) return null;

  return (
    <Dialog open={!!video} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4 mb-4">
            <DialogTitle className="text-2xl">{video.title}</DialogTitle>
            <div className="flex items-center gap-2">
              {video.is_featured && (
                <Badge className="bg-yellow-500 text-white">
                  <Star className="h-3 w-3 mr-1" fill="currentColor" />
                  Destacado
                </Badge>
              )}
              <Badge className={`${getCategoryColor(video.category)} text-white`}>
                {getCategoryLabel(video.category)}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Video Player */}
          {embedUrl ? (
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={embedUrl}
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">No se pudo cargar el video</p>
            </div>
          )}

          {/* Video Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{video.views_count.toLocaleString()} vistas</span>
              </div>
              {video.duration && (
                <Badge variant="secondary">{video.duration}</Badge>
              )}
            </div>

            <div>
              <h3 className="font-semibold mb-2">Descripción</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{video.description}</p>
            </div>

            {video.seo_keywords && video.seo_keywords.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {video.seo_keywords.map((keyword, index) => (
                    <Badge key={index} variant="outline">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
