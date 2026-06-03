"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ShutterButton } from "@/components/ui/shutter-button";
import { submitOnboarding } from "../onboarding-actions";
import { CheckCircle2, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OnboardingForm({ project, token, isMock }: { project: any, token: string, isMock: boolean }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    clientNames: "",
    email: "",
    phone: "",
    secondaryContact: "",
    guestCount: "",
    eventType: "Wedding",
    events: [
      { 
        name: "Main Event", 
        date: project.event_date ? new Date(project.event_date).toISOString().split('T')[0] : "", 
        locationLink: "" 
      }
    ],
    preferredStyle: "Candid & Documentary",
    deliverables: "",
    moodboard: "",
    budget: "",
    heardFrom: "",
    notes: ""
  });

  const handleAddEvent = () => {
    setFormData(prev => ({
      ...prev,
      events: [...prev.events, { name: "", date: "", locationLink: "" }]
    }));
  };

  const handleRemoveEvent = (index: number) => {
    if (formData.events.length > 1) {
      const newEvents = [...formData.events];
      newEvents.splice(index, 1);
      setFormData({ ...formData, events: newEvents });
    }
  };

  const updateEvent = (index: number, field: keyof typeof formData.events[0], value: string) => {
    const newEvents = [...formData.events];
    newEvents[index][field] = value;
    setFormData({ ...formData, events: newEvents });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (isMock) {
        await new Promise(r => setTimeout(r, 1000));
        toast.success("Successfully submitted form! (Mock)");
      } else {
        await submitOnboarding(token, formData);
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
        <p className="text-zinc-400">Your details have been received. We will send you a detailed proposal and quote shortly!</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-transparent p-4 sm:p-8 rounded-3xl space-y-8 w-full max-w-3xl mx-auto">
      
      {/* 1. Contact Details */}
      <div className="space-y-4 pt-2">
        <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Your Details</h3>
        
        <div className="space-y-2">
          <label className="text-xs text-zinc-400 font-medium">Names (e.g. Aisha & Rohan)</label>
          <input 
            type="text" 
            required
            placeholder="Aisha & Rohan"
            value={formData.clientNames}
            onChange={e => setFormData({...formData, clientNames: e.target.value})}
            className="w-full bg-white/5 backdrop-blur-xl border border-white/5 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-inner"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2 md:col-span-1">
            <label className="text-xs text-zinc-400 font-medium">Email Address</label>
            <input 
              type="email" 
              required
              placeholder="hello@example.com"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full bg-white/5 backdrop-blur-xl border border-white/5 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-inner"
            />
          </div>
          <div className="space-y-2 md:col-span-1">
            <label className="text-xs text-zinc-400 font-medium">Primary Phone</label>
            <input 
              type="tel" 
              required
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              className="w-full bg-white/5 backdrop-blur-xl border border-white/5 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-inner"
            />
          </div>
          <div className="space-y-2 md:col-span-1">
            <label className="text-xs text-zinc-400 font-medium">Secondary Contact <span className="text-zinc-600">(Optional)</span></label>
            <input 
              type="tel" 
              placeholder="+91 Planner/Sibling"
              value={formData.secondaryContact}
              onChange={e => setFormData({...formData, secondaryContact: e.target.value})}
              className="w-full bg-white/5 backdrop-blur-xl border border-white/5 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-inner"
            />
          </div>
        </div>
      </div>
      
      {/* 2. Event Specifics (Multi-Event) */}
      <div className="space-y-4 pt-6 border-t border-white/10">
        <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Event Details</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2">
          <div className="space-y-2">
            <label className="text-xs text-zinc-400 font-medium">Overall Event Type</label>
            <select
              required
              value={formData.eventType}
              onChange={e => setFormData({...formData, eventType: e.target.value})}
              className="w-full bg-white/5 backdrop-blur-xl border border-white/5 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-inner appearance-none"
            >
              <option value="Wedding" className="bg-zinc-900">Wedding</option>
              <option value="Pre-Wedding" className="bg-zinc-900">Pre-Wedding</option>
              <option value="Engagement" className="bg-zinc-900">Engagement</option>
              <option value="Maternity" className="bg-zinc-900">Maternity</option>
              <option value="Corporate" className="bg-zinc-900">Corporate</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs text-zinc-400 font-medium">Approximate Guest Count</label>
            <input 
              type="number" 
              placeholder="e.g. 500"
              value={formData.guestCount}
              onChange={e => setFormData({...formData, guestCount: e.target.value})}
              className="w-full bg-white/5 backdrop-blur-xl border border-white/5 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Dynamic Events List */}
        <div className="space-y-4">
          <AnimatePresence>
            {formData.events.map((event, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 space-y-4 relative"
              >
                {formData.events.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => handleRemoveEvent(index)}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                
                <h4 className="text-sm font-semibold text-white">Event {index + 1}</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400 font-medium">Function Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Sangeet, Haldi, Reception"
                      value={event.name}
                      onChange={e => updateEvent(index, 'name', e.target.value)}
                      className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-inner"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400 font-medium">Date</label>
                    <input 
                      type="date" 
                      required
                      value={event.date}
                      onChange={e => updateEvent(index, 'date', e.target.value)}
                      className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-inner"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs text-zinc-400 font-medium">Location / Venue Link</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. The Leela Palace, or Google Maps Link"
                    value={event.locationLink}
                    onChange={e => updateEvent(index, 'locationLink', e.target.value)}
                    className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-inner"
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          <button 
            type="button" 
            onClick={handleAddEvent}
            className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium py-2 px-1"
          >
            <Plus className="w-4 h-4" /> Add Another Event
          </button>
        </div>
      </div>

      {/* 3. Preferences */}
      <div className="space-y-4 pt-6 border-t border-white/10">
        <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Preferences</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-zinc-400 font-medium">Preferred Style/Vibe</label>
            <select
              value={formData.preferredStyle}
              onChange={e => setFormData({...formData, preferredStyle: e.target.value})}
              className="w-full bg-white/5 backdrop-blur-xl border border-white/5 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-inner appearance-none"
            >
              <option value="Candid & Documentary" className="bg-zinc-900">Candid & Documentary</option>
              <option value="Traditional & Posed" className="bg-zinc-900">Traditional & Posed</option>
              <option value="Cinematic & Editorial" className="bg-zinc-900">Cinematic & Editorial</option>
              <option value="Dark & Moody" className="bg-zinc-900">Dark & Moody</option>
              <option value="Light & Airy" className="bg-zinc-900">Light & Airy</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-zinc-400 font-medium">Estimated Budget Range</label>
            <select
              value={formData.budget}
              onChange={e => setFormData({...formData, budget: e.target.value})}
              className="w-full bg-white/5 backdrop-blur-xl border border-white/5 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-inner appearance-none"
            >
              <option value="" className="bg-zinc-900 text-zinc-500">Select Budget (Optional)</option>
              <option value="Below ₹1 Lakh" className="bg-zinc-900">Below ₹1 Lakh</option>
              <option value="₹1L - ₹3L" className="bg-zinc-900">₹1L - ₹3L</option>
              <option value="₹3L - ₹5L" className="bg-zinc-900">₹3L - ₹5L</option>
              <option value="₹5L+" className="bg-zinc-900">₹5L+</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-zinc-400 font-medium">Expected Deliverables</label>
          <input 
            type="text" 
            placeholder="e.g. Pre-Wedding Shoot, Drone, Traditional Video, Printed Albums"
            value={formData.deliverables}
            onChange={e => setFormData({...formData, deliverables: e.target.value})}
            className="w-full bg-white/5 backdrop-blur-xl border border-white/5 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-inner"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-zinc-400 font-medium">Moodboard / Pinterest Link</label>
          <input 
            type="url" 
            placeholder="https://pinterest.com/..."
            value={formData.moodboard}
            onChange={e => setFormData({...formData, moodboard: e.target.value})}
            className="w-full bg-white/5 backdrop-blur-xl border border-white/5 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-inner"
          />
        </div>
      </div>
      
      {/* 4. Notes & Logistics */}
      <div className="space-y-4 pt-6 border-t border-white/10">
        
        <div className="space-y-2">
          <label className="text-xs text-zinc-400 font-medium">Requirements & Notes</label>
          <textarea 
            rows={4}
            placeholder="Tell us about your love story, what you're looking for, or any special requests..."
            value={formData.notes}
            onChange={e => setFormData({...formData, notes: e.target.value})}
            className="w-full bg-white/5 backdrop-blur-xl border border-white/5 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-inner resize-none"
          />
        </div>

        <div className="space-y-2 pb-4">
          <label className="text-xs text-zinc-400 font-medium">How did you hear about us?</label>
          <select
            value={formData.heardFrom}
            onChange={e => setFormData({...formData, heardFrom: e.target.value})}
            className="w-full bg-white/5 backdrop-blur-xl border border-white/5 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-inner appearance-none"
          >
            <option value="" className="bg-zinc-900 text-zinc-500">Select an option (Optional)</option>
            <option value="Instagram" className="bg-zinc-900">Instagram</option>
            <option value="Friend/Family Referral" className="bg-zinc-900">Friend / Family Referral</option>
            <option value="Vendor Recommendation" className="bg-zinc-900">Vendor Recommendation</option>
            <option value="Google Search" className="bg-zinc-900">Google Search</option>
            <option value="WedMeGood" className="bg-zinc-900">WedMeGood</option>
            <option value="Other" className="bg-zinc-900">Other</option>
          </select>
        </div>
      </div>

      <ShutterButton 
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-5 rounded-2xl transition-colors shadow-xl shadow-cyan-900/30 text-lg"
      >
        {isSubmitting ? "Submitting..." : "Submit Inquiry"}
      </ShutterButton>
    </form>
  );
}
