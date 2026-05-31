"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getCrewMembers() {
  const { data, error } = await supabase
    .from('crew_members')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching crew:", error);
    return [];
  }
  return data;
}

export async function createCrewMember(name: string, role: string, fee: number, description: string) {
  const { data, error } = await supabase
    .from('crew_members')
    .insert([{ name, role, fee, description }])
    .select();

  if (error) throw new Error(error.message);
  
  revalidatePath('/admin/crew');
  return data;
}
