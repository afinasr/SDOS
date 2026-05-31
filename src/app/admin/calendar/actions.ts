"use server";

import { supabase } from "@/lib/supabase";

export async function getCalendarProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('id, title, event_date, location, status')
    .order('event_date', { ascending: true });

  if (error) {
    console.error("Error fetching projects for calendar:", error);
    return [];
  }
  return data;
}
