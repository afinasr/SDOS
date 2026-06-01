"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { payInvoice } from "../actions";
import { toast } from "sonner";
import { playSwooshSound, playTickSound } from "@/lib/audio";

export default function PayInvoiceButton({ invoiceId, projectId, clientName }: { invoiceId: string, projectId: string, clientName: string }) {
  const [isPending, startTransition] = useTransition();

  const handlePayment = () => {
    // Mock Razorpay experience
    playTickSound();
    const loadingToast = toast.loading("Connecting to Razorpay...");
    
    setTimeout(() => {
      toast.dismiss(loadingToast);
      startTransition(async () => {
        try {
          await payInvoice(invoiceId, projectId);
          playSwooshSound();
          toast.success("Payment Successful!");
          
          // MOCK OWNER NOTIFICATION: We open a WhatsApp link to the owner
          const msg = encodeURIComponent(`🚨 *New Payment Received!* 🚨\n\nClient: ${clientName}\nStatus: Active 🎉\n\nYou can now assign crew members to this project!`);
          window.open(`https://wa.me/?text=${msg}`, '_blank');
        } catch (e: any) {
          toast.error(e.message);
        }
      });
    }, 1500);
  };

  return (
    <Button 
      onClick={handlePayment}
      disabled={isPending}
      variant="outline" 
      size="sm" 
      className="mt-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)]"
    >
      {isPending ? "Processing..." : "Pay via Razorpay"}
    </Button>
  );
}
