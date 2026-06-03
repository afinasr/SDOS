import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import ProposalClientCard from './ProposalClientCard';
import PayInvoiceButton from './PayInvoiceButton';
import { Sparkles, Calendar, MapPin, Clock, Camera, FileText } from 'lucide-react';
import OnboardingForm from './form';

export default async function ClientPortalPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = await createClient();

  // 1. Try to find an existing project by magic_link_token or id
  const { data: project } = await supabase
    .from('projects')
    .select(`
      *,
      invoices (*)
    `)
    .or(`id.eq.${token},magic_link_token.eq.${token}`)
    .single();

  let lineItems = [];
  if (project?.id) {
    const { data: items } = await supabase
      .from('line_items')
      .select('*')
      .eq('project_id', project.id);
    lineItems = items || [];
  }

  // If we found a project, determine what to show based on status
  if (project) {
    if (project.status === 'Lead') {
      return (
        <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center text-center">
          <Sparkles className="w-16 h-16 text-cyan-400 mb-6 mx-auto animate-pulse" />
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4">You're All Set!</h1>
          <p className="text-zinc-400 max-w-lg mx-auto text-lg">
            We have received your details. Our team is currently reviewing your request and crafting a custom proposal for you. We will notify you once it's ready!
          </p>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-black text-white relative pb-20 selection:bg-cyan-900/50">
        <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-black/95 to-black" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
          <header className="mb-16 text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-zinc-400">
              {project.title}
            </h1>
            <p className="text-xl text-cyan-400/80 font-medium">Client Portal</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              {/* Event Details */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
                <h3 className="text-xl font-serif font-semibold mb-6 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-cyan-400" /> Event Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-zinc-500 text-sm mb-1">Date</p>
                    <p className="font-medium text-lg text-zinc-200">
                      {new Date(project.event_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-sm mb-1">Type</p>
                    <p className="font-medium text-lg text-zinc-200">{project.event_type || 'Wedding'}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-zinc-500 text-sm mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</p>
                    <p className="font-medium text-lg text-zinc-200">{project.location || 'Pending Details'}</p>
                  </div>
                </div>
              </div>

              {/* Package Details */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
                <h3 className="text-xl font-serif font-semibold mb-6 flex items-center gap-3">
                  <Camera className="w-5 h-5 text-cyan-400" /> Package Details
                </h3>
                {project.status === 'Proposal Sent' ? (
                  <ProposalClientCard project={project} lineItems={lineItems} />
                ) : (
                  <div>
                    <p className="font-medium text-lg text-zinc-200 mb-2">{project.package_name}</p>
                    <p className="text-zinc-400">Total Value: ₹{project.total_value}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-8">
              {/* Financials */}
              <div className="bg-cyan-950/20 backdrop-blur-xl border border-cyan-500/20 p-8 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl" />
                <h3 className="text-xl font-serif font-semibold mb-6 flex items-center gap-3 relative z-10">
                  <FileText className="w-5 h-5 text-cyan-400" /> Invoices
                </h3>
                
                <div className="space-y-4 relative z-10">
                  {project.invoices?.length > 0 ? (
                    project.invoices.map((inv: any) => (
                      <div key={inv.id} className="bg-black/40 border border-white/10 p-4 rounded-2xl flex justify-between items-center">
                        <div>
                          <p className="font-medium text-white">{inv.label}</p>
                          <p className="text-sm text-zinc-400">₹{inv.amount}</p>
                        </div>
                        {inv.status === 'Paid' ? (
                          <span className="text-xs font-bold text-green-400 bg-green-400/10 px-3 py-1 rounded-full">PAID</span>
                        ) : (
                          <PayInvoiceButton invoiceId={inv.id} projectId={project.id} clientName={project.client_name} />
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-zinc-500 text-sm">No invoices generated yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. If NO project is found, check if it's an unused onboarding token
  const { data: link, error: linkError } = await supabase
    .from('onboarding_links')
    .select('*')
    .eq('token', token)
    .single();

  if (linkError || !link) {
    notFound();
  }

  if (link.is_used) {
    // Should never hit this because if it's used, the project should have been found above.
    notFound();
  }

  // Show onboarding form
  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col justify-center py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/20 via-black to-black z-0" />
      <div className="relative z-10 max-w-xl mx-auto w-full px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Welcome</h1>
          <p className="text-zinc-400">Please provide some initial details about your event to get started.</p>
        </div>
        <OnboardingForm token={token} isMock={false} project={{}} />
      </div>
    </div>
  );
}
