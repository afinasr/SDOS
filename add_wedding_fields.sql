-- Run this script in your Supabase SQL Editor to update your database for the wedding photography features.

-- 1. Add wedding_details JSONB column to projects
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS wedding_details JSONB DEFAULT '{}'::jsonb;
