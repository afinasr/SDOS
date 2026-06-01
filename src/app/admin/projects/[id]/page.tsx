import { supabase } from "@/lib/supabase";
import ProjectDetailsClient from "./client";
import { notFound } from "next/navigation";

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // If it's a UUID, fetch real data. Otherwise, load mock for demo purposes if needed,
  // but since we want it all working, we will expect a UUID from now on.
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  
  let project = null;
  let lineItems = [];
  let crew = [];
  let milestones = [];

  if (!isUuid) {
    notFound();
  }

  const { data: p } = await supabase.from('projects').select('*').eq('id', id).single();
  if (!p) notFound();
  project = p;
  
  const { data: li } = await supabase.from('line_items').select('*').eq('project_id', id);
  lineItems = li || [];
  
  // Fetch crew members.
  const { data: allProfiles } = await supabase.from('crew_members').select('*');
  const { data: assignments } = await supabase.from('project_crew').select('*').eq('project_id', id);
  
  const assignedIds = assignments?.map(a => a.crew_id) || [];
  crew = (allProfiles || []).map(profile => ({
    id: profile.id,
    name: profile.name || 'Unknown',
    role: profile.role || 'Crew',
    fee: profile.fee || 10000,
    assigned: assignedIds.includes(profile.id)
  }));
  
  const { data: m } = await supabase.from('milestones').select('*').eq('project_id', id);
  milestones = m || [];

  return (
    <ProjectDetailsClient 
      initialProject={project}
      initialLineItems={lineItems}
      initialCrew={crew}
      initialMilestones={milestones}
      isMock={!isUuid}
    />
  );
}
