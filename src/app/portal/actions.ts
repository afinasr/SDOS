"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function acceptProposalAndGenerateInvoice(projectId: string, amount: number, clientName: string, signatureData: string) {
  // First save the signature to the project
  const { error: projError, data: project } = await supabase
    .from('projects')
    .update({ contract_signature: signatureData })
    .eq('id', projectId)
    .select('payment_schedule')
    .single();

  if (projError) throw new Error(projError.message);

  // Determine splits
  const schedule: number[] = project?.payment_schedule || [100];
  
  // Generate invoices
  const invoicesToInsert = schedule.map((percentage, index) => {
    const splitAmount = (amount * percentage) / 100;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}-${index + 1}`;
    
    // Default due dates: 
    // Booking (1st) = Due immediately (7 days)
    // 2nd = Due in 30 days
    // 3rd = Due in 60 days
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7 + (index * 30));

    return {
      project_id: projectId,
      client_name: clientName,
      invoice_number: invoiceNumber,
      amount: splitAmount,
      status: 'Sent',
      due_date: dueDate.toISOString().split('T')[0]
    };
  });

  const { error } = await supabase.from('invoices').insert(invoicesToInsert);
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
