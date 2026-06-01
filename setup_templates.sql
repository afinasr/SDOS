-- Create the Invoice Templates table
CREATE TABLE public.invoice_templates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  name text NOT NULL,
  items_included integer DEFAULT 1,
  default_notes text
);

-- Insert dummy data so it's not empty
INSERT INTO public.invoice_templates (name, items_included, default_notes)
VALUES 
  ('Standard Wedding Package', 5, 'Includes 2 lead photographers, 1 cinematographer, traditional photos, drone coverage, and an album.'),
  ('Pre-Wedding Shoot', 2, 'Half day coverage (4 hours), 1 lead photographer, edited digital deliverables.'),
  ('Maternity Session', 1, '2 hour session at location of choice. 50 edited images.');

-- Set permissions (allow all for demo purposes)
ALTER TABLE public.invoice_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for authenticated users" ON public.invoice_templates FOR ALL USING (true);
