"use server";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function addCrewUnavailability(crewId: string, date: string, reason: string) {
  const { error } = await supabase.from('crew_unavailability').insert([{
    crew_id: crewId,
    date,
    reason
  }]);
  
  if (error) throw new Error(error.message);
  revalidatePath(`/crew/${crewId}`);
}

export async function removeCrewUnavailability(id: string, crewId: string) {
  const { error } = await supabase.from('crew_unavailability').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath(`/crew/${crewId}`);
}
