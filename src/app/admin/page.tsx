import { createClient } from '@/utils/supabase/server';
import DashboardClient from './client';

export default async function AdminDashboard() {
  const supabase = await createClient();

  // 1. Fetch counts for stats
  const { count: activeCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .in('status', ['Active', 'Post-Production', 'Editing']);

  const { count: leadsCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .in('status', ['Lead', 'Proposal Sent']);

  const { count: crewCount } = await supabase
    .from('crew_members')
    .select('*', { count: 'exact', head: true });

  // 2. Fetch total received from invoices
  const { data: paidInvoices } = await supabase
    .from('invoices')
    .select('amount')
    .eq('status', 'Paid');
  const totalReceived = paidInvoices?.reduce((acc, inv) => acc + Number(inv.amount), 0) || 0;

  // 3. Upcoming Shoots (30 days)
  const today = new Date().toISOString().split('T')[0];
  const nextMonth = new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0];
  
  const { data: upcomingShoots } = await supabase
    .from('projects')
    .select('id, title, location, event_date')
    .gte('event_date', today)
    .lte('event_date', nextMonth)
    .order('event_date', { ascending: true })
    .limit(3);

  // 4. Recent Projects (last created)
  const { data: recentProjects } = await supabase
    .from('projects')
    .select('id, title, event_type, event_date, location, status')
    .order('created_at', { ascending: false })
    .limit(3);

  const stats = {
    activeCount: activeCount || 0,
    leadsCount: leadsCount || 0,
    upcomingCount: upcomingShoots?.length || 0,
    crewCount: crewCount || 0
  };

  return (
    <DashboardClient 
      stats={stats}
      totalReceived={totalReceived}
      upcomingShoots={upcomingShoots || []}
      recentProjects={recentProjects || []}
    />
  );
}
