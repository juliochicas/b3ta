import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Edit, Trash2, Eye, Star } from "lucide-react";
import { AlertDeleteDialog } from "@/components/ui/alert-delete-dialog";
import { useState } from "react";

interface Video {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string | null;
  category: string;
  duration: string | null;
  views_count: number;
  is_featured: boolean;
}

interface VideoCardProps {
  video: Video;
  canManage: boolean;
  onEdit: (video: Video) => void;
  onDelete: (videoId: string) => void;
  onPlay: (video: Video) => void;
}

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    shopify: 'Shopify',
    sap: 'Procesos',
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

export const VideoCard = ({ video, canManage, onEdit, onDelete, onPlay }: VideoCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handlePlayVideo = () => {
    onPlay(video);
  };

  return (
    <>
      <Card className="group relative overflow-hidden hover:shadow-xl transition-all">
        <div className="relative h-48 bg-muted overflow-hidden">
          {video.thumbnail_url ? (
            <img
              src={video.thumbnail_url}
              alt={video.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <Play className="h-16 w-16 text-primary/30" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <button
            onClick={handlePlayVideo}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
              <Play className="h-8 w-8 text-primary-foreground ml-1" fill="currentColor" />
            </div>
          </button>

          {video.is_featured && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-yellow-500 text-white">
                <Star className="h-3 w-3 mr-1" fill="currentColor" />
                Destacado
              </Badge>
            </div>
          )}

          <div className="absolute top-2 right-2">
            <Badge className={`${getCategoryColor(video.category)} text-white`}>
              {getCategoryLabel(video.category)}
            </Badge>
          </div>

          {video.duration && (
            <div className="absolute bottom-2 right-2">
              <Badge variant="secondary" className="bg-black/60 text-white">
                {video.duration}
              </Badge>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{video.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Eye className="h-3 w-3" />
              <span>{video.views_count.toLocaleString()} vistas</span>
            </div>

            {canManage && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(video)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      <AlertDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={() => {
          onDelete(video.id);
          setShowDeleteDialog(false);
        }}
        title="¿Eliminar video?"
        description="Esta acción no se puede deshacer. El video será eliminado permanentemente."
      />
    </>
  );
};
