"use client";

import { CheckCircle2, Clock, Image as ImageIcon, Video, BookHeart, CircleDashed } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TrackerView({ project }: { project: any }) {
  const statusSteps = [
    { label: "Active", desc: "Shoot in progress/upcoming" },
    { label: "Post-Production", desc: "Backing up & Culling" },
    { label: "Editing", desc: "Color grading & Retouching" },
    { label: "Completed", desc: "All deliverables sent!" }
  ];

  // We only track progress for these statuses
  const currentIndex = statusSteps.findIndex(s => s.label === project.status);
  
  // If it's a Lead, Proposal Sent, or Awaiting Selection, we shouldn't really show this tracker yet.
  // But if we do, it's index -1
  const displayIndex = currentIndex >= 0 ? currentIndex : 0;

  const deliverables = project.wedding_details?.deliverables || {
    sneakPeeks: false,
    highlights: false,
    gallery: false,
    album: false
  };

  const checklist = [
    { key: "sneakPeeks", label: "Sneak Peeks", icon: ImageIcon },
    { key: "highlights", label: "Highlight Video", icon: Video },
    { key: "gallery", label: "Full Gallery", icon: ImageIcon },
    { key: "album", label: "Printed Album", icon: BookHeart },
  ];

  return (
    <Card className="bg-black/40 border-cyan-500/30 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          Progress Tracker
        </CardTitle>
        <CardDescription className="text-zinc-400">Track the status of your photos and videos.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        
        {/* Status Timeline */}
        <div className="relative pt-2">
          <div className="absolute top-5 left-4 right-4 h-0.5 bg-zinc-800 hidden sm:block" />
          <div className="flex flex-col sm:flex-row justify-between gap-4 relative z-10">
            {statusSteps.map((step, idx) => {
              const isPast = idx < displayIndex;
              const isCurrent = idx === displayIndex;
              const isFuture = idx > displayIndex;

              return (
                <div key={idx} className="flex sm:flex-col items-center gap-3 sm:gap-2 text-left sm:text-center">
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                    isPast ? 'bg-cyan-500 border-cyan-500' : 
                    isCurrent ? 'bg-black border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 
                    'bg-zinc-900 border-zinc-700'
                  }`}>
                    {isPast ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-black" /> : 
                     isCurrent ? <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-cyan-500 animate-pulse" /> : 
                     <span className="text-xs text-zinc-600 font-bold">{idx + 1}</span>}
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${isCurrent ? 'text-white' : isPast ? 'text-zinc-300' : 'text-zinc-600'}`}>{step.label}</p>
                    <p className="text-[10px] text-zinc-500 hidden sm:block">{step.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Deliverables Checklist */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Deliverables Checklist</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {checklist.map(item => {
              const isDone = deliverables[item.key];
              return (
                <div key={item.key} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                  isDone ? 'bg-green-500/10 border-green-500/30' : 'bg-black/50 border-white/5'
                }`}>
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  ) : (
                    <CircleDashed className="w-5 h-5 text-zinc-600 shrink-0" />
                  )}
                  <div className="flex items-center gap-2">
                    <item.icon className={`w-4 h-4 ${isDone ? 'text-green-400' : 'text-zinc-500'}`} />
                    <span className={`text-sm font-semibold ${isDone ? 'text-green-100' : 'text-zinc-400'}`}>
                      {item.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* External Links */}
        {project.deliverables && Array.isArray(project.deliverables) && project.deliverables.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-white/10">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Final Links</h4>
            {project.deliverables.map((link: any, idx: number) => (
              <a 
                key={idx} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/20 hover:bg-cyan-900/40 transition-colors"
              >
                <p className="font-bold text-cyan-300">{link.title || "View Deliverable"}</p>
                <p className="text-xs text-cyan-600/80 mt-1 truncate">{link.url}</p>
              </a>
            ))}
          </div>
        )}

      </CardContent>
    </Card>
  );
}
