import { supabase } from "@/lib/supabase";
import CrewClient from "./client";

export default async function CrewPortalPage({ params }: { params: { crewId: string } }) {
  // Fetch crew member details
  const { data: crewMember } = await supabase
    .from('crew_members')
    .select('*')
    .eq('id', params.crewId)
    .single();

  if (!crewMember) {
    return <div className="p-10 text-center font-bold">Crew member not found.</div>;
  }

  // Fetch projects assigned to this crew member
  const { data: projectsData } = await supabase
    .from('project_crew')
    .select(`
      project_id,
      projects (
        id,
        title,
        client_name,
        event_date,
        location,
        status,
        wedding_details
      )
    `)
    .eq('crew_id', params.crewId);

  const { data: unavailabilities } = await supabase
    .from('crew_unavailability')
    .select('*')
    .eq('crew_id', params.crewId)
    .order('date', { ascending: true });

  const assignedProjects = projectsData?.map((p: any) => p.projects) || [];

  return <CrewClient crewMember={crewMember} projects={assignedProjects} unavailabilities={unavailabilities || []} />;
}
