"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { X, Calendar as CalendarIcon, MapPin, Briefcase, FileText, FileDown, Check } from "lucide-react";
import { ShutterButton } from "@/components/ui/shutter-button";

export default function NewProjectPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    clientName: "",
    eventDate: "",
    location: "",
    eventType: "Wedding",
    packageName: "",
    totalValue: "",
    requirements: ""
  });

  const eventTypes = ["Wedding", "Engagement", "Pre-Wedding", "Other"];

  const handleSave = () => {
    // Mock save
    router.back();
  };

  return (
    <motion.div 
      initial={{ y: "100%", opacity: 0.5 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 bg-zinc-50 dark:bg-zinc-950 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/50 backdrop-blur-xl">
        <div>
          <h2 className="text-xl font-bold font-serif text-zinc-900 dark:text-white">New Project</h2>
          <p className="text-xs text-zinc-500 font-medium">Create a new workspace</p>
        </div>
        <ShutterButton size="icon" variant="ghost" onClick={() => router.back()} className="rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 w-10 h-10">
          <X className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
        </ShutterButton>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-2xl mx-auto space-y-6 pb-24">
          
          {/* Client Name */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Client Name</label>
            <input 
              type="text"
              placeholder="e.g. Aisha & Rohan"
              value={formData.clientName}
              onChange={(e) => setFormData({...formData, clientName: e.target.value})}
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-600 dark:focus:ring-cyan-500 transition-shadow font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Event Date */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Event Date</label>
              <div className="relative">
                <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input 
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-600 dark:focus:ring-cyan-500 transition-shadow font-medium [color-scheme:light] dark:[color-scheme:dark]"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input 
                  type="text"
                  placeholder="e.g. The Leela Palace"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-600 dark:focus:ring-cyan-500 transition-shadow font-medium"
                />
              </div>
            </div>
          </div>

          {/* Event Type */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Event Type</label>
            <div className="flex flex-wrap gap-2">
              {eventTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setFormData({...formData, eventType: type})}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    formData.eventType === type 
                    ? "bg-cyan-600 text-white dark:bg-cyan-500 dark:text-black border-transparent" 
                    : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Package Name */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Package Name</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input 
                  type="text"
                  placeholder="e.g. Platinum Collection"
                  value={formData.packageName}
                  onChange={(e) => setFormData({...formData, packageName: e.target.value})}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-600 dark:focus:ring-cyan-500 transition-shadow font-medium"
                />
              </div>
            </div>

            {/* Total Value */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Total Value (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-zinc-400">₹</span>
                <input 
                  type="number"
                  placeholder="1,50,000"
                  value={formData.totalValue}
                  onChange={(e) => setFormData({...formData, totalValue: e.target.value})}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-600 dark:focus:ring-cyan-500 transition-shadow font-medium"
                />
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Requirements / Notes</label>
            <textarea 
              placeholder="Any specific requests or important details..."
              value={formData.requirements}
              onChange={(e) => setFormData({...formData, requirements: e.target.value})}
              rows={4}
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-600 dark:focus:ring-cyan-500 transition-shadow font-medium resize-none"
            />
          </div>

        </div>
      </div>

      {/* Footer / Save Button */}
      <div className="border-t border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/80 backdrop-blur-xl p-4 sm:p-6 sticky bottom-0">
        <div className="max-w-2xl mx-auto flex justify-end gap-4">
          <button onClick={() => router.back()} className="px-6 py-3 font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
            Cancel
          </button>
          <ShutterButton 
            onClick={handleSave} 
            className="bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:text-black border-none rounded-xl px-8 py-3 font-semibold flex items-center gap-2"
          >
            <Check className="w-5 h-5" />
            Save Project
          </ShutterButton>
        </div>
      </div>
    </motion.div>
  );
}
