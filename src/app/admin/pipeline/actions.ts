"use server";
import { supabase } from "@/lib/supabase";

export async function getPipelineProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('id, title, client_name, event_date, status')
    .neq('status', 'Completed') // Don't show completed projects in pipeline
    .order('event_date', { ascending: true });

  if (error) {
    console.error("Error fetching pipeline projects:", error);
    return [];
  }
  return data;
}
