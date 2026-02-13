
-- Add custom domain field to client_pages
ALTER TABLE public.client_pages
ADD COLUMN custom_domain text NULL,
ADD COLUMN domain_status text NOT NULL DEFAULT 'none'; -- 'none', 'pending', 'active', 'offline'
