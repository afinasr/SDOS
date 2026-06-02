"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function addExpense(projectId: string, category: string, amount: number, description: string, date: string) {
  const { error } = await supabase.from('expenses').insert([{
    project_id: projectId,
    category,
    amount,
    description,
    date
  }]);

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/projects/${projectId}`);
}

export async function deleteExpense(expenseId: string, projectId: string) {
  const { error } = await supabase.from('expenses').delete().eq('id', expenseId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/projects/${projectId}`);
}

export async function updatePaymentSchedule(projectId: string, schedule: number[]) {
  const { error } = await supabase.from('projects').update({ payment_schedule: schedule }).eq('id', projectId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/projects/${projectId}`);
}

export async function updateDeliverablesLinks(projectId: string, deliverables: any[]) {
  const { error } = await supabase.from('projects').update({ deliverables }).eq('id', projectId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/projects/${projectId}`);
}
