import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { Calendar, Receipt, FileText } from "lucide-react";
import ProposalClientCard from "./ProposalClientCard";
import PayInvoiceButton from "./PayInvoiceButton";

export default async function PortalOverviewPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  
  // Validate UUID
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectId);
  if (!isUuid) notFound();

  // Fetch Project
  const { data: project } = await supabase.from('projects').select('*').eq('id', projectId).single();
  if (!project) notFound();

  // Fetch Invoices
  const { data: invoices } = await supabase.from('invoices').select('*').eq('project_id', projectId).order('created_at', { ascending: false });

  // Fetch Line Items for Proposal
  const { data: lineItems } = await supabase.from('line_items').select('*').eq('project_id', projectId);

  const deliverables = project.deliverables || [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-serif mb-2">Welcome, {project.client_name.split(' ')[0]}!</h2>
        <p className="text-zinc-400">Your {project.event_type?.toLowerCase() || 'event'} timeline and deliverables are managed here.</p>
      </div>

      <div className="grid gap-6">
        {/* Project Details */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              Event Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><span className="text-zinc-400">Date:</span> {new Date(project.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p><span className="text-zinc-400">Location:</span> {project.location || 'TBD'}</p>
            <p><span className="text-zinc-400">Status:</span> {project.status}</p>
          </CardContent>
        </Card>

        {/* Contract & Proposal */}
        <ProposalClientCard project={project} lineItems={lineItems || []} />

        {/* Invoices */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <Receipt className="w-5 h-5 text-cyan-400" />
               Invoices
            </CardTitle>
            <CardDescription className="text-zinc-400">Manage your payments.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(invoices || []).map((inv) => (
              <div key={inv.id} className="flex justify-between items-center border border-white/10 p-4 rounded-xl">
                 <div>
                    <p className="font-medium text-white">{inv.invoice_number}</p>
                    <p className="text-xs text-zinc-400">Due: {inv.due_date}</p>
                 </div>
                 <div className="text-right">
                    <p className="font-serif font-bold text-lg text-white">₹{Number(inv.amount).toLocaleString()}</p>
                    {inv.status === 'Paid' ? (
                      <span className="text-xs font-bold text-green-400 uppercase">Paid</span>
                    ) : (
                      <PayInvoiceButton invoiceId={inv.id} projectId={project.id} clientName={project.client_name} />
                    )}
                 </div>
              </div>
            ))}
            {(!invoices || invoices.length === 0) && (
              <p className="text-zinc-500 text-sm italic">No invoices generated yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Deliverables & Gallery */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <FileText className="w-5 h-5 text-cyan-400" />
               Deliverables
            </CardTitle>
            <CardDescription className="text-zinc-400">Access your final links.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {deliverables.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-serif text-lg text-white">External Links</h3>
                <div className="grid gap-3">
                  {deliverables.map((link: any, idx: number) => (
                    <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-zinc-900 border border-white/10 rounded-xl hover:bg-zinc-800 transition-colors">
                      <span className="font-medium text-white">{link.title || 'View Link'}</span>
                      <FileText className="w-4 h-4 text-cyan-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            {deliverables.length === 0 && (
              <p className="text-zinc-500 text-sm italic">No deliverables have been added yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
