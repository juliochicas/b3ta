-- Add password column to client_pages
ALTER TABLE public.client_pages ADD COLUMN page_password TEXT DEFAULT NULL;

-- Add comment for clarity
COMMENT ON COLUMN public.client_pages.page_password IS 'Optional password to protect the client page';