"use server";
import { supabase } from "@/lib/supabase";

export async function getCalendarData() {
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('id, title, event_date, status, location')
    .neq('status', 'Completed');

  const { data: unavailabilities, error: unavailError } = await supabase
    .from('crew_unavailability')
    .select('id, date, reason, crew_members(name)');

  if (projectsError) console.error("Error fetching projects for calendar:", projectsError);
  if (unavailError) console.error("Error fetching unavailabilities:", unavailError);

  return {
    projects: projects || [],
    unavailabilities: unavailabilities || []
  };
}
