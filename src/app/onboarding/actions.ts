"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function submitOnboarding(token: string, data: {
  eventDate: string;
  location: string;
  notes: string;
}) {
  const { data: project, error: findError } = await supabase
    .from('projects')
    .select('id')
    .eq('magic_link_token', token)
    .single();

  if (findError || !project) {
    throw new Error("Invalid or expired magic link.");
  }

  const { error: updateError } = await supabase
    .from('projects')
    .update({
      event_date: data.eventDate,
      location: data.location,
      notes: data.notes,
      status: 'Proposal Sent' // Automatically advance status once they fill the form
    })
    .eq('id', project.id);

  if (updateError) throw new Error(updateError.message);
  
  revalidatePath(`/admin/projects/${project.id}`);
  return { success: true };
}
