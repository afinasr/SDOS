"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function updateProjectStatus(projectId: string, newStatus: string) {
  const { data, error } = await supabase
    .from('projects')
    .update({ status: newStatus })
    .eq('id', projectId)
    .select();
  
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/projects/${projectId}`);
  return data;
}

export async function updateProjectNotesAndDrive(projectId: string, notes: string, driveLink: string) {
  const { data, error } = await supabase
    .from('projects')
    .update({ notes, drive_link: driveLink })
    .eq('id', projectId)
    .select();
    
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/projects/${projectId}`);
  return data;
}

export async function updateWeddingDetails(projectId: string, weddingDetails: any) {
  const { data, error } = await supabase
    .from('projects')
    .update({ wedding_details: weddingDetails })
    .eq('id', projectId)
    .select();
    
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/projects/${projectId}`);
  return data;
}

export async function addLineItem(projectId: string, desc: string, price: number) {
  const { data, error } = await supabase
    .from('line_items')
    .insert([{ project_id: projectId, description: desc, price }])
    .select();
    
  if (error) throw new Error(error.message);
  
  // Update total value in projects
  const { data: allItems } = await supabase.from('line_items').select('price').eq('project_id', projectId);
  if (allItems) {
    const total = allItems.reduce((acc, item) => acc + Number(item.price), 0);
    await supabase.from('projects').update({ total_value: total }).eq('id', projectId);
  }
  
  revalidatePath(`/admin/projects/${projectId}`);
  return data;
}

export async function deleteLineItem(itemId: string, projectId: string) {
  const { error } = await supabase.from('line_items').delete().eq('id', itemId);
  if (error) throw new Error(error.message);
  
  const { data: allItems } = await supabase.from('line_items').select('price').eq('project_id', projectId);
  const total = allItems ? allItems.reduce((acc, item) => acc + Number(item.price), 0) : 0;
  await supabase.from('projects').update({ total_value: total }).eq('id', projectId);
  
  revalidatePath(`/admin/projects/${projectId}`);
}

export async function toggleCrewAssignment(projectId: string, crewId: string, assigned: boolean, role: string, fee: number) {
  if (assigned) {
    const { error } = await supabase
      .from('project_crew')
      .insert([{ project_id: projectId, user_id: crewId }]);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from('project_crew')
      .delete()
      .eq('project_id', projectId)
      .eq('user_id', crewId);
    if (error) throw new Error(error.message);
  }
  revalidatePath(`/admin/projects/${projectId}`);
}

export async function addMilestone(projectId: string, label: string, amount: number) {
  const { data, error } = await supabase
    .from('milestones')
    .insert([{ project_id: projectId, label, amount, status: 'Unpaid' }])
    .select();
    
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/projects/${projectId}`);
  return data;
}

export async function toggleMilestoneStatus(milestoneId: string, projectId: string, currentStatus: string) {
  const newStatus = currentStatus === 'Paid' ? 'Pending' : 'Paid'; // Actually DB says 'Unpaid' or 'Paid', but UI uses 'Pending'
  const dbStatus = currentStatus === 'Paid' ? 'Unpaid' : 'Paid';
  
  const { error } = await supabase
    .from('milestones')
    .update({ status: dbStatus })
    .eq('id', milestoneId);
    
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/projects/${projectId}`);
}

export async function generateMagicLink(projectId: string) {
  const { data: project } = await supabase.from('projects').select('magic_link_token').eq('id', projectId).single();
  
  if (project?.magic_link_token) {
    return project.magic_link_token;
  }
  
  // If not generated, just generate a random UUID token
  // Normally DB defaults to gen_random_uuid(), but we can force update
  const token = crypto.randomUUID();
  await supabase.from('projects').update({ magic_link_token: token }).eq('id', projectId);
  
  revalidatePath(`/admin/projects/${projectId}`);
  return token;
}
