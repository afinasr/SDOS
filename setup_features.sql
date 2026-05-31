-- Run this script in your Supabase SQL Editor

-- 1. Create a standalone crew_members table (bypassing auth.users requirement)
CREATE TABLE IF NOT EXISTS public.crew_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT,
  fee NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Drop and recreate project_crew to use the new crew_members table
DROP TABLE IF EXISTS public.project_crew;
CREATE TABLE public.project_crew (
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  crew_id UUID REFERENCES public.crew_members(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, crew_id)
);

-- 3. Enable RLS and setup policies for the new tables
ALTER TABLE public.crew_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_crew ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for authenticated users" ON public.crew_members FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all access for authenticated users" ON public.project_crew FOR ALL TO authenticated USING (true);

-- 4. Insert some initial dummy crew members so the page isn't empty!
INSERT INTO public.crew_members (name, role, description, fee) VALUES 
('Arjun Mehta', 'Lead Photographer', 'Candid & Portrait', 8000),
('Priya Sharma', 'Videographer', 'Cinematic Films', 7000),
('Rahul Nair', 'Assistant Photographer', 'Detail & Decor', 4000),
('Sneha Kapoor', 'Photo Editor', 'Album Design', 5000);
