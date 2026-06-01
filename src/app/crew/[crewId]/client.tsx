"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, User, Clock, Camera } from "lucide-react";

export default function CrewClient({ crewMember, projects }: { crewMember: any, projects: any[] }) {
  // Only show active and upcoming projects (for demo purposes we just show all assigned)
  const activeProjects = projects.filter(p => p !== null);

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
      </div>
    </div>
  );
}
