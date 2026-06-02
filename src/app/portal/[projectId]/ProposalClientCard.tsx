"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Check, X } from "lucide-react";
import { acceptProposalAndGenerateInvoice, rejectProposal } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import SignatureCanvas from 'react-signature-canvas';
import { useRef } from "react";

export default function ProposalClientCard({ project, lineItems }: { project: any, lineItems: any[] }) {
  const [isPending, setIsPending] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const sigCanvas = useRef<any>(null);
  const router = useRouter();

  const totalAmount = lineItems.reduce((acc, item) => acc + Number(item.price), 0);

  const handleAccept = async () => {
    if (sigCanvas.current?.isEmpty()) {
      toast.error("Please provide a signature.");
      return;
    }
    
    setIsPending(true);
    try {
      const signatureData = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
      await acceptProposalAndGenerateInvoice(project.id, totalAmount, project.client_name, signatureData);
      toast.success("Proposal accepted! Your invoice has been generated.");
      setShowSignature(false);
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed to accept proposal");
    } finally {
      setIsPending(false);
    }
  };

  const handleReject = async () => {
    setIsPending(true);
    try {
      await rejectProposal(project.id);
      toast.info("Proposal rejected. We will be in touch.");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed to reject proposal");
    } finally {
      setIsPending(false);
    }
  };

  if (project.status !== "Proposal Sent" && project.status !== "Lead") {
    return (
      <Card className="bg-white/5 border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            Proposal & Contract
          </CardTitle>
          <CardDescription className="text-zinc-400">Your proposal has been accepted.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-md border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-cyan-500 text-black text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl">
        Action Required
      </div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <FileText className="w-5 h-5 text-cyan-400" />
          Review Proposal
        </CardTitle>
        <CardDescription className="text-zinc-400">Please review your customized package below.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="bg-black/30 border border-white/10 rounded-xl divide-y divide-white/5">
          {lineItems.map(item => (
            <div key={item.id} className="p-4 flex justify-between items-center">
              <span className="text-zinc-200 text-sm">{item.desc}</span>
              <span className="font-semibold text-white">₹{Number(item.price).toLocaleString()}</span>
            </div>
          ))}
          {lineItems.length === 0 && (
            <div className="p-4 text-center text-zinc-500 text-sm">Waiting for studio to add items...</div>
          )}
        </div>

        <div className="flex justify-between items-center px-2">
          <span className="text-zinc-400 uppercase tracking-wider text-sm font-bold">Total</span>
          <span className="text-2xl font-serif font-bold text-amber-400">₹{totalAmount.toLocaleString()}</span>
        </div>

        {lineItems.length > 0 && !showSignature && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <Button 
              disabled={isPending}
              onClick={handleReject}
              variant="outline" 
              className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 py-6"
            >
              <X className="w-4 h-4 mr-2" />
              Decline
            </Button>
            <Button 
              disabled={isPending}
              onClick={() => setShowSignature(true)}
              className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-6"
            >
              <Check className="w-4 h-4 mr-2" />
              Proceed to Sign
            </Button>
          </div>
        )}

        {showSignature && (
          <div className="pt-4 border-t border-white/10 animate-in fade-in zoom-in-95">
            <p className="text-zinc-300 mb-2 font-medium">Please sign below to accept</p>
            <div className="bg-white rounded-xl overflow-hidden border-2 border-cyan-500/50">
               <SignatureCanvas 
                  ref={sigCanvas} 
                  canvasProps={{className: 'w-full h-40 cursor-crosshair'}} 
               />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="ghost" onClick={() => sigCanvas.current?.clear()} className="text-zinc-400 hover:text-white">
                 Clear
              </Button>
              <Button variant="outline" onClick={() => setShowSignature(false)} className="border-white/10 text-white">
                 Cancel
              </Button>
              <Button onClick={handleAccept} disabled={isPending} className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold">
                 {isPending ? "Saving..." : "Confirm & Sign"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
