import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { VideoModal } from "@/components/videos/VideoModal";
import { VideoPlayerModal } from "@/components/videos/VideoPlayerModal";
import { VideoCard } from "@/components/videos/VideoCard";
import { useUserRole } from "@/hooks/useUserRole";

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
  display_order: number;
  seo_keywords: string[] | null;
  meta_description: string | null;
  created_at: string;
}

const Videos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null);
  const { role } = useUserRole();

  const canManageVideos = role === 'admin';

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('showcase_videos')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setVideos(data || []);
    } catch (error: any) {
      toast.error("Error al cargar videos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleDelete = async (videoId: string) => {
    try {
      const { error } = await supabase
        .from('showcase_videos')
        .delete()
        .eq('id', videoId);

      if (error) throw error;
      
      toast.success("Video eliminado exitosamente");
      fetchVideos();
    } catch (error: any) {
      toast.error("Error al eliminar video");
      console.error(error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
    fetchVideos();
  };

  const handlePlayVideo = (video: Video) => {
    setPlayingVideo(video);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-lg z-50 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent">
              B3TA
            </div>
            <span className="text-xs text-muted-foreground">.us</span>
          </div>
          
          <nav className="flex items-center gap-6">
            <a href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Inicio
            </a>
            <a href="/crm" className="text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors py-2 px-4 rounded-lg">
              CRM
            </a>
          </nav>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Showcase de Videos</h1>
              <p className="text-muted-foreground">
                Ejemplos de implementaciones y casos de éxito
              </p>
            </div>
            {canManageVideos && (
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Video
              </Button>
            )}
          </div>

          {videos.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No hay videos disponibles</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  canManage={canManageVideos}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onPlay={handlePlayVideo}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {isModalOpen && (
        <VideoModal
          video={selectedVideo}
          onClose={handleModalClose}
        />
      )}

      <VideoPlayerModal
        video={playingVideo}
        onClose={() => setPlayingVideo(null)}
      />
    </div>
  );
};

export default Videos;
