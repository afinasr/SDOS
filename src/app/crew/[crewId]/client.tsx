"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, User, Clock, Camera, Plus, Trash2, CalendarOff } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { addCrewUnavailability, removeCrewUnavailability } from "./actions";

export default function CrewClient({ crewMember, projects, unavailabilities }: { crewMember: any, projects: any[], unavailabilities: any[] }) {
  // Only show active and upcoming projects (for demo purposes we just show all assigned)
  const activeProjects = projects.filter(p => p !== null);

  const [isPending, startTransition] = useTransition();
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    
    startTransition(async () => {
      try {
        await addCrewUnavailability(crewMember.id, date, reason);
        setShowAdd(false);
        setDate("");
        setReason("");
        toast.success("Dates marked as unavailable");
      } catch (err: any) {
        toast.error(err.message);
      }
    });
  };

  const handleRemove = (id: string) => {
    startTransition(async () => {
      try {
        await removeCrewUnavailability(id, crewMember.id);
        toast.success("Availability restored");
      } catch (err: any) {
        toast.error(err.message);
      }
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-sm"
        >
          <div className="w-24 h-24 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-full flex items-center justify-center shrink-0">
            <Camera className="w-10 h-10" />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mb-2">Welcome back, {crewMember.name}</h1>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">Role: <span className="text-cyan-600 dark:text-cyan-400">{crewMember.role}</span></p>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2 max-w-md">{crewMember.description}</p>
          </div>
        </motion.div>

        {/* Assigned Shoots */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white px-2">Your Upcoming Assignments</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeProjects.length === 0 ? (
              <div className="col-span-full p-10 text-center bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-white/20 rounded-3xl text-zinc-500">
                You have no upcoming assignments. Enjoy your time off!
              </div>
            ) : (
              activeProjects.map((project, idx) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  key={project.id} 
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl p-5 hover:shadow-lg transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-zinc-900 dark:text-white text-lg">{project.title}</h3>
                      <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400">{project.client_name}</p>
                    </div>
                    <span className="px-3 py-1 bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider rounded-full">
                      {project.status}
                    </span>
                  </div>

                  <div className="space-y-3 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-100 dark:border-white/5">
                    <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                      <Calendar className="w-4 h-4 text-zinc-400" />
                      <span>{new Date(project.event_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                      <MapPin className="w-4 h-4 text-zinc-400" />
                      <span>{project.location || "Location TBD"}</span>
                    </div>
                  </div>

                  {project.wedding_details?.events && project.wedding_details.events.length > 0 && (
                     <div className="mt-4 border-t border-zinc-100 dark:border-white/10 pt-4">
                       <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Event Schedule</h4>
                       <div className="space-y-2">
                         {project.wedding_details.events.map((ev: any, i: number) => (
                           <div key={i} className="flex justify-between text-sm">
                             <span className="font-medium text-zinc-700 dark:text-zinc-300">{ev.name}</span>
                             <span className="text-zinc-500">{ev.date}</span>
                           </div>
                         ))}
                       </div>
                     </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Availability / Leave Management */}
        <div className="space-y-4">
          <div className="flex justify-between items-end px-2">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Your Unavailability</h2>
            <button 
              onClick={() => setShowAdd(true)}
              className="bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Dates
            </button>
          </div>

          {showAdd && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-5 rounded-3xl"
            >
              <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 space-y-2 w-full">
                  <label className="text-xs font-semibold text-zinc-500 uppercase">Date</label>
                  <input 
                    type="date" 
                    value={date} onChange={e => setDate(e.target.value)} required
                    className="w-full bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-shadow"
                  />
                </div>
                <div className="flex-2 space-y-2 w-full sm:w-[40%]">
                  <label className="text-xs font-semibold text-zinc-500 uppercase">Reason (Optional)</label>
                  <input 
                    type="text" placeholder="e.g. Vacation, Sick leave"
                    value={reason} onChange={e => setReason(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-shadow"
                  />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl font-bold text-sm flex-1 sm:flex-none">Cancel</button>
                  <button type="submit" disabled={isPending} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-bold text-sm flex-1 sm:flex-none transition-colors">{isPending ? "Saving..." : "Save"}</button>
                </div>
              </form>
            </motion.div>
          )}

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl overflow-hidden divide-y divide-zinc-100 dark:divide-white/5">
            {unavailabilities.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 flex flex-col items-center justify-center gap-3">
                <CalendarOff className="w-8 h-8 opacity-20" />
                <p>No unavailable dates marked.</p>
              </div>
            ) : (
              unavailabilities.map((u: any) => (
                <div key={u.id} className="p-4 sm:p-5 flex justify-between items-center hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg">
                      {new Date(u.date).getDate()}
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-white text-sm sm:text-base">
                        {new Date(u.date).toLocaleDateString(undefined, { month: 'long', year: 'numeric', weekday: 'long' })}
                      </p>
                      {u.reason && <p className="text-xs text-zinc-500 mt-0.5">{u.reason}</p>}
                    </div>
                  </div>
                  <button onClick={() => handleRemove(u.id)} disabled={isPending} className="text-zinc-300 hover:text-red-500 dark:text-zinc-600 dark:hover:text-red-500 p-2 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
