"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getInvoices() {
  // Fetch invoices joined with projects to get the project name/client
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      project:projects(title)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching invoices:", error);
    return [];
  }
  return data;
}

export async function getActiveProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('id, client_name, title')
    .neq('status', 'Completed');
    
  return data || [];
}

export async function createInvoice(projectId: string, clientName: string, amount: number, dueDate: string) {
  // Generate random invoice number like INV-8492
  const invNumber = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
  const issueDate = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('invoices')
    .insert([{
      invoice_number: invNumber,
      project_id: projectId,
      client_name: clientName,
      amount,
      issue_date: issueDate,
      due_date: dueDate,
      status: 'Draft'
    }])
    .select();

  if (error) throw new Error(error.message);
  revalidatePath('/admin/invoices');
  return data;
}

export async function updateInvoiceStatus(invoiceId: string, newStatus: string) {
  const { error } = await supabase
    .from('invoices')
    .update({ status: newStatus })
    .eq('id', invoiceId);
    
  if (error) throw new Error(error.message);
  revalidatePath('/admin/invoices');
}

export async function getTemplates() {
  const { data, error } = await supabase
    .from('invoice_templates')
    .select('*')
    .order('created_at', { ascending: true });
    
  return data || [];
}

export async function createTemplate(name: string, items_included: number, default_notes: string) {
  const { error } = await supabase.from('invoice_templates').insert([{ name, items_included, default_notes }]);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/invoices');
}

export async function updateTemplate(id: string, name: string, items_included: number, default_notes: string) {
  const { error } = await supabase.from('invoice_templates').update({ name, items_included, default_notes }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/invoices');
}

export async function deleteTemplate(id: string) {
  const { error } = await supabase.from('invoice_templates').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/invoices');
}
