"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function PipelinePage() {
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  const statuses = ['Lead', 'Proposal Sent', 'Active', 'Post-Production'];
  const mockProjects = [
    { id: '1', status: 'Lead', client: 'Tim & Lisa', date: 'Wedding - Dec 12' },
    { id: '2', status: 'Active', client: 'Sarah & John', date: 'Engagement - Oct 5' },
    { id: '3', status: 'Active', client: 'Mike & Emma', date: 'Pre-Wedding - Nov 20' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-serif tracking-tight">Lead Pipeline</h1>
      
      <div className="flex gap-6 overflow-x-auto pb-4 h-[70vh]">
        {statuses.map((status, colIndex) => (
          <motion.div
            key={status}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: colIndex * 0.1 }}
            className="w-80 min-w-[20rem] bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-2xl flex flex-col gap-4"
          >
            <h3 className="font-serif text-lg tracking-wide border-b border-white/10 pb-2">{status}</h3>
            
            {mockProjects.filter(p => p.status === status).map((project) => {
              const isHovered = hoveredCardId === project.id;
              const isSiblingHovered = hoveredCardId !== null && hoveredCardId !== project.id;
              
              return (
                <motion.div
                  key={project.id}
                  onHoverStart={() => setHoveredCardId(project.id)}
                  onHoverEnd={() => setHoveredCardId(null)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  animate={{ 
                    filter: isSiblingHovered ? "blur(4px)" : "blur(0px)",
                    opacity: isSiblingHovered ? 0.5 : 1,
                    zIndex: isHovered ? 10 : 1
                  }}
                  className="bg-white/10 hover:bg-white/15 border border-white/10 p-5 rounded-xl shadow-lg cursor-pointer relative"
                >
                  <p className="font-semibold text-zinc-100">{project.client}</p>
                  <p className="text-sm text-zinc-400 mt-1">{project.date}</p>
                </motion.div>
              );
            })}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
