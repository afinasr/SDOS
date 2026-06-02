"use server";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getPipelineData() {
  // Fetch active projects to assign tasks to
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('id, title, status')
    .in('status', ['Active', 'Editing', 'Post-Production'])
    .order('created_at', { ascending: false });

  // Fetch all tasks
  const { data: tasks, error: tasksError } = await supabase
    .from('tasks')
    .select('*, projects(title), crew_members(name)')
    .order('created_at', { ascending: false });

  return { 
    projects: projects || [], 
    tasks: tasks || [] 
  };
}

export async function addTask(projectId: string, title: string, status: string = 'To Do') {
  const { error } = await supabase.from('tasks').insert([{ project_id: projectId, title, status }]);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/pipeline');
}

export async function updateTaskStatus(taskId: string, newStatus: string) {
  const { error } = await supabase.from('tasks').update({ status: newStatus }).eq('id', taskId);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/pipeline');
}

export async function deleteTask(taskId: string) {
  const { error } = await supabase.from('tasks').delete().eq('id', taskId);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/pipeline');
}
