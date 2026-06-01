-- ==========================================
-- MASTER SUPABASE SCHEMA FOR WEDDING STUDIO
-- ==========================================
-- Run this entire script in your Supabase SQL Editor.
-- It will set up ALL tables, enums, relationships, and dummy data in one go!

-- -----------------------------------------------------
-- 1. DROP EXISTING TABLES TO AVOID CONFLICTS (Optional)
-- -----------------------------------------------------
DROP TABLE IF EXISTS public.project_crew CASCADE;
DROP TABLE IF EXISTS public.line_items CASCADE;
DROP TABLE IF EXISTS public.milestones CASCADE;
DROP TABLE IF EXISTS public.invoices CASCADE;
DROP TABLE IF EXISTS public.invoice_templates CASCADE;
DROP TABLE IF EXISTS public.crew_members CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS project_status CASCADE;

-- -----------------------------------------------------
-- 2. CREATE ENUMS
-- -----------------------------------------------------
CREATE TYPE user_role AS ENUM ('owner', 'crew', 'client');
CREATE TYPE project_status AS ENUM ('Lead', 'Proposal Sent', 'Active', 'Post-Production', 'Awaiting Selection', 'Editing', 'Completed');

-- -----------------------------------------------------
-- 3. CREATE PROFILES
-- -----------------------------------------------------
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'crew',
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, 'New User', 'owner'); -- Temporarily defaulting to owner for testing
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -----------------------------------------------------
-- 4. CREATE PROJECTS
-- -----------------------------------------------------
CREATE TABLE public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  client_name TEXT NOT NULL,
  event_date DATE NOT NULL,
  location TEXT,
  event_type TEXT,
  package_name TEXT,
  total_value NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  notes TEXT,
  drive_link TEXT,
  status project_status NOT NULL DEFAULT 'Lead',
  magic_link_token UUID DEFAULT gen_random_uuid(),
  wedding_details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------
-- 5. CREATE LINE ITEMS (FOR PROPOSALS)
-- -----------------------------------------------------
CREATE TABLE public.line_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------
-- 6. CREATE CREW MEMBERS & PROJECT_CREW
-- -----------------------------------------------------
CREATE TABLE public.crew_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT,
  fee NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.project_crew (
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  crew_id UUID REFERENCES public.crew_members(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, crew_id)
);

-- -----------------------------------------------------
-- 7. CREATE MILESTONES
-- -----------------------------------------------------
CREATE TABLE public.milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'Unpaid',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------
-- 8. CREATE INVOICES & TEMPLATES
-- -----------------------------------------------------
CREATE TABLE public.invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Draft', -- 'Draft', 'Sent', 'Paid'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.invoice_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name TEXT NOT NULL,
  items_included INTEGER DEFAULT 1,
  default_notes TEXT
);

-- -----------------------------------------------------
-- 9. INSERT DUMMY DATA
-- -----------------------------------------------------
INSERT INTO public.crew_members (name, role, description, fee) VALUES 
('Arjun Mehta', 'Lead Photographer', 'Candid & Portrait', 8000),
('Priya Sharma', 'Videographer', 'Cinematic Films', 7000),
('Rahul Nair', 'Assistant Photographer', 'Detail & Decor', 4000),
('Sneha Kapoor', 'Photo Editor', 'Album Design', 5000);

INSERT INTO public.invoice_templates (name, items_included, default_notes) VALUES 
('Standard Wedding Package', 5, 'Includes 2 lead photographers, 1 cinematographer, traditional photos, drone coverage, and an album.'),
('Pre-Wedding Shoot', 2, 'Half day coverage (4 hours), 1 lead photographer, edited digital deliverables.'),
('Maternity Session', 1, '2 hour session at location of choice. 50 edited images.');

-- -----------------------------------------------------
-- 10. DISABLE RLS EVERYWHERE (FOR LOCAL/EASY DEV)
-- -----------------------------------------------------
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.line_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.crew_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_crew DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_templates DISABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------
-- 11. STORAGE BUCKET (GALLERIES)
-- -----------------------------------------------------
-- Note: Make sure you created the 'galleries' bucket in the UI!
CREATE POLICY "Public Access" ON storage.objects FOR SELECT TO public USING (bucket_id = 'galleries');
CREATE POLICY "Auth Upload" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'galleries');
