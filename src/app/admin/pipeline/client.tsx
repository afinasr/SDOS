"use client";
import { useState } from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { playTickSound } from "@/lib/audio";

export default function PipelineClient({ initialProjects }: { initialProjects: any[] }) {
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // The kanban columns based on the project statuses in the database
  const statuses = ['Lead', 'Proposal Sent', 'Active', 'Editing', 'Post-Production'];

  return (
    <div className="space-y-8">
      <div className="pt-2">
        <h1 className="text-4xl font-serif font-bold text-zinc-900 dark:text-white">Lead Pipeline</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">Track the progression of your active shoots and incoming leads.</p>
      </div>
      
      <div className="flex gap-6 overflow-x-auto pb-4 h-[70vh] no-scrollbar">
        {statuses.map((status, colIndex) => {
          const columnProjects = initialProjects.filter(p => p.status === status);
          
          return (
            <motion.div
              key={status}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: colIndex * 0.1 }}
              className="w-80 min-w-[20rem] bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-zinc-200 dark:border-white/10 p-4 rounded-[1.5rem] flex flex-col gap-4"
            >
              <div className="flex justify-between items-center border-b border-zinc-200 dark:border-white/10 pb-3">
                 <h3 className="font-serif font-bold text-lg text-zinc-900 dark:text-white">{status}</h3>
                 <span className="text-[10px] font-bold text-zinc-500 bg-zinc-200 dark:bg-white/10 px-2 py-1 rounded-md">{columnProjects.length}</span>
              </div>
              
              {columnProjects.map((project) => {
                const isHovered = hoveredCardId === project.id;
                const isSiblingHovered = hoveredCardId !== null && hoveredCardId !== project.id;
                
                return (
                  <Link href={`/admin/projects/${project.id}`} key={project.id} onClick={playTickSound}>
                    <motion.div
                      onHoverStart={() => setHoveredCardId(project.id)}
                      onHoverEnd={() => setHoveredCardId(null)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      animate={{ 
                        filter: isSiblingHovered ? "blur(2px)" : "blur(0px)",
                        opacity: isSiblingHovered ? 0.6 : 1,
                        zIndex: isHovered ? 10 : 1
                      }}
                      className="bg-white dark:bg-white/10 hover:dark:bg-white/15 border border-zinc-200 dark:border-white/10 p-5 rounded-2xl shadow-sm hover:shadow-md cursor-pointer relative transition-colors"
                    >
                      <h4 className="font-bold text-zinc-900 dark:text-white">{project.title}</h4>
                      <p className="text-xs font-semibold text-zinc-500 mt-1">{project.client_name}</p>
                      
                      <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-white/10 text-xs text-zinc-500 dark:text-zinc-400">
                        {new Date(project.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
              
              {columnProjects.length === 0 && (
                <div className="text-center py-6 text-zinc-400 text-sm italic">
                  No projects
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  );
}
