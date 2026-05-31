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

  if (isUuid) {
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
  } else {
    // Return mock data for 'aisha-rohan'
    project = {
      id: 'mock',
      title: 'Aisha & Rohan',
      client_name: 'Aisha & Rohan',
      event_date: '2026-06-06',
      location: 'The Leela Palace, Mumbai',
      event_type: 'Wedding',
      package_name: 'Premium',
      total_value: 120000,
      notes: '',
      drive_link: '',
      status: 'Active',
      magic_link_token: null
    };
    lineItems = [
      { id: 1, description: "Wedding Coverage (2 Days)", price: 80000 },
      { id: 2, description: "Cinematic Film", price: 40000 }
    ];
    crew = [
      { id: '1', name: "Arjun Mehta", role: "Lead Photographer", fee: 15000, assigned: true },
      { id: '2', name: "Neha Sharma", role: "Cinematographer", fee: 20000, assigned: false },
      { id: '3', name: "Vikram Singh", role: "Drone Operator", fee: 10000, assigned: true }
    ];
    milestones = [
      { id: 1, label: "Booking Advance", amount: 30000, status: "Paid" },
      { id: 2, label: "Event Day", amount: 60000, status: "Pending" },
      { id: 3, label: "Final Delivery", amount: 30000, status: "Pending" }
    ];
  }

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
