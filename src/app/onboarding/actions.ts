"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function submitOnboarding(token: string, data: {
  clientNames: string;
  email: string;
  phone: string;
  eventType: string;
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
      client_name: data.clientNames,
      title: `${data.clientNames} - ${data.eventType}`,
      event_type: data.eventType,
      event_date: data.eventDate,
      location: data.location,
      notes: `Email: ${data.email}\nPhone: ${data.phone}\n\n${data.notes}`,
      status: 'Lead' // Keep it as Lead so Admin can generate a proposal/invoice next
    })
    .eq('id', project.id);

  if (updateError) throw new Error(updateError.message);
  
  revalidatePath(`/admin/projects/${project.id}`);
  return { success: true };
}
