-- Run this script in your Supabase SQL Editor to update your database for the new features.

-- 1. Add magic link token to projects
ALTER TABLE public.projects 
ADD COLUMN magic_link_token UUID DEFAULT gen_random_uuid();

-- 2. Create line_items table
CREATE TABLE public.line_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Enable RLS and setup policy
ALTER TABLE public.line_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for authenticated users" ON public.line_items FOR ALL TO authenticated USING (true);
