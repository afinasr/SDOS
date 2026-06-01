-- This will allow your Next.js app to insert projects without hitting the security block
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.line_items DISABLE ROW LEVEL SECURITY;
