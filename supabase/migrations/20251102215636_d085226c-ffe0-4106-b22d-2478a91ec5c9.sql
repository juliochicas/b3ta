-- Add meeting_link column to meetings table for video conferencing links
ALTER TABLE public.meetings 
ADD COLUMN meeting_link TEXT;