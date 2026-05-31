import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import OnboardingForm from "./form";

export default async function OnboardingPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  let project = null;

  if (token === 'mock-token-123') {
    project = {
      id: 'mock',
      title: 'Aisha & Rohan',
      client_name: 'Aisha & Rohan',
      event_date: '2026-06-06',
      location: 'The Leela Palace, Mumbai',
      event_type: 'Wedding',
      package_name: 'Premium',
      total_value: 120000,
      magic_link_token: 'mock-token-123'
    };
  } else {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('magic_link_token', token)
      .single();
      
    if (!data) notFound();
    project = data;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900 via-zinc-950 to-zinc-950" />
      
      <div className="relative z-10 w-full max-w-2xl">
        <div className="text-center space-y-6 mb-12">
          <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.1)]">
            <span className="text-black font-serif font-bold text-2xl tracking-tighter">AS</span>
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-white mb-2">Welcome to Alice Studio</h1>
            <p className="text-zinc-400 text-sm sm:text-base">Please confirm your event details to kick off your project.</p>
          </div>
        </div>
        
        <OnboardingForm project={project} token={token} isMock={token === 'mock-token-123'} />
      </div>
    </div>
  );
}
