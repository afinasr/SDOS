"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function acceptProposalAndGenerateInvoice(projectId: string, amount: number, clientName: string) {
  // Generate an invoice number
  const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  // Set due date to 7 days from now
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);
  
  const { error } = await supabase.from('invoices').insert([{
    project_id: projectId,
    client_name: clientName,
    invoice_number: invoiceNumber,
    amount,
    status: 'Sent',
    due_date: dueDate.toISOString().split('T')[0]
  }]);

  if (error) throw new Error(error.message);

  revalidatePath(`/portal/${projectId}`);
  return { success: true };
}

export async function rejectProposal(projectId: string) {
  const { error } = await supabase.from('projects').update({ status: 'Lead' }).eq('id', projectId);
  if (error) throw new Error(error.message);
  
  revalidatePath(`/portal/${projectId}`);
  return { success: true };
}

export async function payInvoice(invoiceId: string, projectId: string) {
  // Update invoice status
  const { error: invError } = await supabase.from('invoices').update({ status: 'Paid' }).eq('id', invoiceId);
  if (invError) throw new Error(invError.message);

  // Update project status to Active
  const { error: projError } = await supabase.from('projects').update({ status: 'Active' }).eq('id', projectId);
  if (projError) throw new Error(projError.message);

  revalidatePath(`/portal/${projectId}`);
  revalidatePath(`/admin/projects/${projectId}`);
  return { success: true };
}
