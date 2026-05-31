-- Run this entire script in your Supabase SQL Editor

-- 1. Create custom enum types
CREATE TYPE user_role AS ENUM ('owner', 'crew', 'client');
CREATE TYPE project_status AS ENUM ('Lead', 'Proposal Sent', 'Active', 'Post-Production', 'Awaiting Selection', 'Editing', 'Completed');

-- 2. Create Profiles Table (extends the Supabase Auth Users table)
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

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Create Projects Table
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
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Create Project Crew Junction Table
CREATE TABLE public.project_crew (
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, user_id)
);

-- 5. Create Milestones Table
CREATE TABLE public.milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'Unpaid', -- 'Unpaid' or 'Paid'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Create Invoices Table
CREATE TABLE public.invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Draft', -- 'Draft', 'Sent', 'Paid'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_crew ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- 8. Setup RLS Policies (Simplified for development: allows authenticated users full access for now)
CREATE POLICY "Enable read access for all authenticated users" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable all access for authenticated users" ON public.projects FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all access for authenticated users" ON public.project_crew FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all access for authenticated users" ON public.milestones FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all access for authenticated users" ON public.invoices FOR ALL TO authenticated USING (true);

-- 9. Storage Setup (Requires you to create a bucket named 'galleries' in the Storage dashboard first)
-- Run this *after* creating the 'galleries' bucket to allow public reading of images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT TO public USING (bucket_id = 'galleries');
CREATE POLICY "Auth Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'galleries');
