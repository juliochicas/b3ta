import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { VideoModal } from "@/components/videos/VideoModal";
import { VideoPlayerModal } from "@/components/videos/VideoPlayerModal";
import { VideoCard } from "@/components/videos/VideoCard";
import { useUserRole } from "@/hooks/useUserRole";
import { CRMNavigation } from "@/components/crm/CRMNavigation";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

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
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { role } = useUserRole();
  const navigate = useNavigate();

  const canManageVideos = role === 'admin';

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setUser(session.user);
        checkUserRoleData(session.user.id);
      }
    };

    checkAuth();
    fetchVideos();
  }, []);

  const checkUserRoleData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (!error) {
        setUserRole(data?.role || null);
      }
    } catch (error) {
      console.error('Error checking role:', error);
    }
  };

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
    <div className="min-h-screen bg-muted/30">
      <CRMNavigation userEmail={user?.email} userRole={userRole} />

      <main className="pt-8 pb-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Showcase de Videos</h1>
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
