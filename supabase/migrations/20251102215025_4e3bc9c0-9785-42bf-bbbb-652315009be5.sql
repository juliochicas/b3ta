-- Create showcase_videos table for dynamic video management
CREATE TABLE public.showcase_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT NOT NULL, -- 'shopify', 'sap', 'automation', 'ai', 'other'
  duration TEXT, -- e.g., "3:24"
  views_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  seo_keywords TEXT[], -- Array of keywords for SEO
  meta_description TEXT, -- SEO meta description
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.showcase_videos ENABLE ROW LEVEL SECURITY;

-- Public can view published videos
CREATE POLICY "Videos are viewable by everyone" 
ON public.showcase_videos 
FOR SELECT 
USING (true);

-- Only authenticated users can insert videos
CREATE POLICY "Authenticated users can insert videos" 
ON public.showcase_videos 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own videos or admins can update any
CREATE POLICY "Users can update videos" 
ON public.showcase_videos 
FOR UPDATE 
USING (
  auth.uid() = created_by OR 
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Users can delete their own videos or admins can delete any
CREATE POLICY "Users can delete videos" 
ON public.showcase_videos 
FOR DELETE 
USING (
  auth.uid() = created_by OR 
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_showcase_videos_updated_at
BEFORE UPDATE ON public.showcase_videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_showcase_videos_category ON public.showcase_videos(category);
CREATE INDEX idx_showcase_videos_featured ON public.showcase_videos(is_featured);
CREATE INDEX idx_showcase_videos_order ON public.showcase_videos(display_order);