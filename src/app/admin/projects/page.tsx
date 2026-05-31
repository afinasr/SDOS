import { createClient } from '@/utils/supabase/server'
import ClientPage from './ClientPage'

export default async function ProjectsView() {
  const supabase = await createClient()

  // Fetch all projects from Supabase
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('event_date', { ascending: true })

  // Map database status to UI colors
  const formattedProjects = (projects || []).map(proj => {
    let sColor = "text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-400/20";
    
    if (proj.status === "Lead" || proj.status === "Awaiting Selection") {
      sColor = "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-zinc-900 border-orange-200 dark:border-orange-400/20";
    } else if (proj.status === "Proposal Sent") {
      sColor = "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-zinc-900 border-blue-200 dark:border-blue-400/20";
    } else if (proj.status === "Active" || proj.status === "Completed") {
      sColor = "text-green-600 dark:text-green-400 bg-green-50 dark:bg-zinc-900 border-green-200 dark:border-green-400/20";
    } else if (proj.status === "Post-Production" || proj.status === "Editing") {
      sColor = "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-zinc-900 border-purple-200 dark:border-purple-400/20";
    }

    return {
      ...proj,
      sColor
    }
  })

  return <ClientPage projects={formattedProjects} />
}
