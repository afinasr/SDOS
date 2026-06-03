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
  // 1. Verify the token is valid and unused
  const { data: link, error: findError } = await supabase
    .from('onboarding_links')
    .select('*')
    .eq('token', token)
    .single();

  if (findError || !link || link.is_used) {
    throw new Error("Invalid or expired onboarding link.");
  }

  // 2. Create the project
  const { data: project, error: insertError } = await supabase
    .from('projects')
    .insert([{
      client_name: data.clientNames,
      title: `${data.clientNames} - ${data.eventType}`,
      event_type: data.eventType,
      event_date: data.eventDate,
      location: data.location,
      notes: `Email: ${data.email}\nPhone: ${data.phone}\n\n${data.notes}`,
      status: 'Lead',
      magic_link_token: token // Attach token to project so they can use the same link
    }])
    .select()
    .single();

  if (insertError) throw new Error(insertError.message);

  // 3. Mark the link as used
  await supabase
    .from('onboarding_links')
    .update({ is_used: true, project_id: project.id })
    .eq('token', token);

  // 4. Send a notification to Admin
  await supabase
    .from('notifications')
    .insert([{
      message: `New lead details received from ${data.clientNames}`,
      project_id: project.id
    }]);
  
  revalidatePath(`/admin/projects`);
  revalidatePath(`/portal/${token}`);
  return { success: true };
}
