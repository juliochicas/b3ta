import { Card } from "@/components/ui/card";
import { Play, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Video {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string | null;
  category: string;
  duration: string | null;
  is_featured: boolean;
}

export const VideoSection = () => {
  const [featuredVideo, setFeaturedVideo] = useState<Video | null>(null);
  const [recentVideos, setRecentVideos] = useState<Video[]>([]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data: featured } = await supabase
        .from('showcase_videos')
        .select('*')
        .eq('is_featured', true)
        .order('display_order', { ascending: true })
        .limit(1)
        .single();

      if (featured) {
        setFeaturedVideo(featured);
      }

      const { data: recent } = await supabase
        .from('showcase_videos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      setRecentVideos(recent || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const handlePlay = (url: string) => {
    window.open(url, '_blank');
  };

  if (!featuredVideo && recentVideos.length === 0) {
    return null;
  }

  const displayVideo = featuredVideo || recentVideos[0];
  const additionalVideos = featuredVideo ? recentVideos.slice(0, 3) : recentVideos.slice(1, 4);

  return (
    <section className="py-28 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Conoce Cómo Trabajamos
            </h2>
            <p className="text-xl text-muted-foreground">
              Casos reales de implementación y resultados
            </p>
          </div>

          <Card 
            className="relative overflow-hidden cursor-pointer group border-2 border-border hover:border-primary transition-all shadow-2xl"
            onClick={() => handlePlay(displayVideo.video_url)}
          >
            <div className="relative h-[500px]">
              {displayVideo.thumbnail_url ? (
                <img 
                  src={displayVideo.thumbnail_url} 
                  alt={`Video: ${displayVideo.title} - Consultoría B3TA`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Play className="h-32 w-32 text-primary/30" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                  <Play className="h-12 w-12 text-primary-foreground ml-1" fill="currentColor" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8 text-primary-foreground">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-primary text-primary-foreground">
                      {displayVideo.category.toUpperCase()}
                    </Badge>
                    {displayVideo.duration && (
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        {displayVideo.duration}
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    {displayVideo.title}
                  </h3>
                  <p className="text-primary-foreground/80 line-clamp-2">
                    {displayVideo.description}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {additionalVideos.length > 0 && (
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              {additionalVideos.map((video) => (
                <Card 
                  key={video.id} 
                  className="p-0 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
                  onClick={() => handlePlay(video.video_url)}
                >
                  <div className="relative h-40 bg-muted">
                    {video.thumbnail_url ? (
                      <img 
                        src={video.thumbnail_url} 
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <Play className="h-12 w-12 text-primary/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-primary/0 group-hover:bg-primary flex items-center justify-center transition-all">
                        <Play className="h-6 w-6 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-1" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <Badge className="mb-2 text-xs">{video.category}</Badge>
                    <h4 className="font-semibold text-foreground mb-1 line-clamp-2">{video.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <a href="/videos">
                Ver Todos los Videos
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};