"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ShutterButton } from "@/components/ui/shutter-button";
import { submitOnboarding } from "../actions";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function OnboardingForm({ project, token, isMock }: { project: any, token: string, isMock: boolean }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    eventDate: project.event_date || "",
    location: project.location || "",
    notes: "",
    emergencyContact: "",
    familyDynamics: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (isMock) {
        await new Promise(r => setTimeout(r, 1000));
        toast.success("Successfully submitted form! (Mock)");
      } else {
        const combinedNotes = `
${formData.notes}

--- Wedding Specifics ---
Emergency Contact: ${formData.emergencyContact}
Family Dynamics: ${formData.familyDynamics}
        `.trim();
        await submitOnboarding(token, { ...formData, notes: combinedNotes });
        toast.success("Details confirmed successfully!");
      }
      setIsSuccess(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl text-center space-y-6"
      >
        <div className="w-20 h-20 bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
          <CheckCircle2 className="w-10 h-10 text-cyan-400" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-white">Thank You!</h2>
        <p className="text-zinc-400">Your details have been confirmed. We've notified Alice Studio and they will be in touch shortly.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-transparent p-6 sm:p-10 rounded-3xl space-y-8 w-full">
      
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-bold text-white mb-1">Project Name</h2>
          <p className="text-zinc-400 text-sm">{project.client_name || project.title}</p>
        </div>
        
        <div>
          <h2 className="text-lg font-bold text-white mb-1">Selected Package</h2>
          <p className="text-cyan-400 font-semibold">{project.package_name || "Premium Package"}</p>
        </div>
      </div>
      
      <div className="space-y-4 pt-6 border-t border-white/10">
        <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Confirm Details</h3>
        
        <div className="space-y-2">
          <label className="text-xs text-zinc-400 font-medium">Event Date</label>
          <input 
            type="date" 
            required
            value={formData.eventDate}
            onChange={e => setFormData({...formData, eventDate: e.target.value})}
            className="w-full bg-white/5 backdrop-blur-xl border-none rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-inner"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-xs text-zinc-400 font-medium">Venue Location</label>
          <input 
            type="text" 
            required
            placeholder="e.g. The Leela Palace, Mumbai"
            value={formData.location}
            onChange={e => setFormData({...formData, location: e.target.value})}
            className="w-full bg-white/5 backdrop-blur-xl border-none rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-inner"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-xs text-zinc-400 font-medium">Emergency Contact Person & Phone</label>
          <input 
            type="text" 
            placeholder="e.g. Rahul (Brother) - 9876543210"
            value={formData.emergencyContact}
            onChange={e => setFormData({...formData, emergencyContact: e.target.value})}
            className="w-full bg-white/5 backdrop-blur-xl border-none rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-inner"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-zinc-400 font-medium">Any complex family dynamics we should be aware of?</label>
          <textarea 
            placeholder="e.g. Divorced parents, avoid seating them together during portraits..."
            value={formData.familyDynamics}
            onChange={e => setFormData({...formData, familyDynamics: e.target.value})}
            rows={2}
            className="w-full bg-white/5 backdrop-blur-xl border-none rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-inner resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-zinc-400 font-medium">Additional Requests or Notes</label>
          <textarea 
            placeholder="Any specific moments you want us to capture? Any scheduling constraints?"
            value={formData.notes}
            onChange={e => setFormData({...formData, notes: e.target.value})}
            rows={3}
            className="w-full bg-white/5 backdrop-blur-xl border-none rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-inner resize-none"
          />
        </div>
      </div>
      
      <div className="pt-4">
        <ShutterButton 
          type="submit" 
          loading={isSubmitting}
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-900/30"
        >
          Confirm Details & Begin Journey
        </ShutterButton>
      </div>
    </form>
  );
}
