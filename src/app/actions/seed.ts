"use server";
import { supabase } from "@/lib/supabase";

export async function seedSampleData() {
  console.log("Seeding sample data...");
  
  // 1. Create a dummy studio
  const { data: studio, error: studioError } = await supabase
    .from('studios')
    .insert([{ name: "Apple Weddings", location: "Cupertino, CA", default_currency: "USD" }])
    .select()
    .single();

  if (studioError || !studio) return { error: "Failed to create studio" };

  // 2. Create dummy users (Owner, Crew, Client)
  const { data: users, error: usersError } = await supabase
    .from('users')
    .insert([
      { studio_id: studio.id, role: 'owner', name: 'Steve Jobs', email: 'steve@appleweddings.com' },
      { studio_id: studio.id, role: 'crew', name: 'Craig Federighi', pin_code: '1234', daily_fee: 500, crew_role: 'Lead Photographer' },
      { studio_id: studio.id, role: 'client', name: 'Tim & Lisa' }
    ])
    .select();

  if (usersError || !users) return { error: "Failed to create users" };

  const clientUser = users.find(u => u.role === 'client');
  const crewUser = users.find(u => u.role === 'crew');

  // 3. Create dummy project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert([{
      studio_id: studio.id,
      client_id: clientUser?.id,
      client_name: 'Tim & Lisa',
      title: 'Tim & Lisa Wedding',
      status: 'Active',
      event_date: '2026-09-09',
      venue: 'Steve Jobs Theater',
      package_type: 'Platinum Video + Photo',
      total_value: 10000
    }])
    .select()
    .single();

  if (projectError || !project) return { error: "Failed to create project" };

  // 4. Create dummy invoice
  await supabase.from('invoices').insert([
    { project_id: project.id, milestone_label: 'Advance Booking', amount: 3000, status: 'Paid', due_date: '2026-06-01' },
    { project_id: project.id, milestone_label: 'Post-Processing', amount: 4000, status: 'Pending', due_date: '2026-09-15' }
  ]);

  // 5. Create dummy crew assignment
  await supabase.from('crew_assignments').insert([
    { project_id: project.id, crew_id: crewUser?.id, role_assigned: 'Lead Photographer', remuneration: 500, reporting_time: '2026-09-09T08:00:00Z' }
  ]);

  return { success: true, message: "App seeded with sample data!" };
}
