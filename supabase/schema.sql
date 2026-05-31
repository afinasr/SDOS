-- Create Enum Types
CREATE TYPE user_role AS ENUM ('owner', 'crew', 'client');
CREATE TYPE project_status AS ENUM ('Lead', 'Proposal', 'Active', 'Post-Production', 'Completed');
CREATE TYPE invoice_status AS ENUM ('Pending', 'Paid', 'Overdue');
CREATE TYPE theme_setting AS ENUM ('light', 'dark', 'system');

-- 1. Studios Table
CREATE TABLE studios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    location TEXT,
    theme theme_setting DEFAULT 'system',
    default_currency TEXT DEFAULT 'USD',
    tax_rate NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Users Table (Extends auth.users, or stands alone for crew/clients)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    studio_id UUID REFERENCES studios(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    pin_code TEXT, -- 4-digit PIN for crew
    daily_fee NUMERIC,
    crew_role TEXT, -- e.g., 'Lead Photographer'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Projects Table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    studio_id UUID REFERENCES studios(id) ON DELETE CASCADE,
    client_id UUID REFERENCES users(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    title TEXT NOT NULL,
    status project_status DEFAULT 'Lead',
    event_date DATE,
    venue TEXT,
    package_type TEXT,
    total_value NUMERIC DEFAULT 0,
    photo_drive_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Invoices Table
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    milestone_label TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    status invoice_status DEFAULT 'Pending',
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Crew Assignments Table
CREATE TABLE crew_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    crew_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_assigned TEXT NOT NULL,
    reporting_time TIMESTAMP WITH TIME ZONE,
    remuneration NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Optional: Enable Row Level Security (RLS) policies here later.
