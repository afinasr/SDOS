"use client";
import { Plus, MapPin, Calendar as CalendarIcon, ChevronRight } from "lucide-react";
import { ShutterButton } from "@/components/ui/shutter-button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";

export default function ProjectsView() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");
  const projects = [
    { names: "Meera & Dev", type: "Destination Wedding", date: "21 Jul 2026", loc: "Umaid Bhawan Palace, Jodhpur", status: "Lead", sColor: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-zinc-900 border-orange-200 dark:border-orange-400/20", total: null, received: null },
    { names: "Nisha & Karan", type: "Engagement", date: "25 May 2026", loc: "ITC Grand Chola, Chennai", status: "Lead", sColor: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-zinc-900 border-orange-200 dark:border-orange-400/20", total: null, received: null },
    { names: "Kavya & Aryan", type: "Wedding", date: "6 Jul 2026", loc: "Taj Mahal Hotel, Delhi", status: "Proposal Sent", sColor: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-zinc-900 border-blue-200 dark:border-blue-400/20", total: "₹80,000", received: null },
    { names: "Aisha & Rohan", type: "Wedding", date: "6 Jun 2026", loc: "The Leela Palace, Mumbai", status: "Active", sColor: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-zinc-900 border-green-200 dark:border-green-400/20", total: "₹1,20,000", received: "₹30,000 received" },
    { names: "Pooja & Vikram", type: "Wedding", date: "2 May 2026", loc: "Radisson Blu, Bangalore", status: "Awaiting Selection", sColor: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-zinc-900 border-orange-200 dark:border-orange-400/20", total: "₹88,000", received: "₹25,000 received" },
  ];

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") return projects;
    if (activeFilter === "Leads") return projects.filter(p => p.status === "Lead");
    if (activeFilter === "Proposals") return projects.filter(p => p.status === "Proposal Sent");
    if (activeFilter === "Active") return projects.filter(p => p.status === "Active");
    if (activeFilter === "Post-Prod") return projects.filter(p => p.status === "Post-Production");
    if (activeFilter === "Completed") return projects.filter(p => p.status === "Completed");
    return projects;
  }, [activeFilter, projects]);

  const filters = [
    { name: "All", count: projects.length },
    { name: "Leads", count: projects.filter(p => p.status === "Lead").length },
    { name: "Proposals", count: projects.filter(p => p.status === "Proposal Sent").length },
    { name: "Active", count: projects.filter(p => p.status === "Active").length },
    { name: "Post-Prod", count: projects.filter(p => p.status === "Post-Production").length },
    { name: "Completed", count: projects.filter(p => p.status === "Completed").length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center pt-2">
        <h1 className="text-4xl font-serif font-bold text-zinc-900 dark:text-white">Projects</h1>
        <ShutterButton size="icon" className="rounded-full bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:text-black border-none" onClick={() => router.push("/admin/projects/new")}>
          <Plus className="w-5 h-5" />
        </ShutterButton>
      </div>

      {/* Filter Pills */}
      <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
        {filters.map((f, i) => {
          const isActive = activeFilter === f.name;
          return (
            <button
              key={i}
              onClick={() => setActiveFilter(f.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors border ${
                isActive 
                  ? "bg-cyan-600 border-cyan-600 text-white dark:bg-cyan-500 dark:border-cyan-500 dark:text-black" 
                  : "bg-zinc-100 border-zinc-200 text-zinc-600 hover:bg-zinc-200 dark:bg-white/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
              }`}
            >
              <span className="font-semibold text-sm">{f.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                isActive ? "bg-black/20 text-white dark:text-black" : "bg-zinc-200 text-zinc-700 dark:bg-white/10 dark:text-zinc-300"
              }`}>
                {f.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Project Cards */}
      <div className="space-y-4 pb-4">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((proj, i) => (
            <Link key={i} href={`/admin/projects/${proj.names.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="block bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-[1.5rem] p-5 relative cursor-pointer hover:bg-zinc-50 dark:hover:bg-white/10 transition-colors">
              {/* Status Pill */}
              <div className={`absolute top-5 right-5 flex items-center gap-1.5 border px-2 py-1 rounded-full text-[10px] font-medium uppercase tracking-wide ${proj.sColor}`}>
                <div className="w-1.5 h-1.5 rounded-full bg-current" />
                {proj.status}
              </div>
              
              <h4 className="font-bold text-lg text-zinc-900 dark:text-white pr-24">{proj.names}</h4>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{proj.type}</p>
              
              <div className="space-y-2 mt-4 mb-4">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{proj.date}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{proj.loc}</span>
                </div>
              </div>

              {/* Financial Footer (if applicable) */}
              {(proj.total || proj.received) && (
                <div className="pt-4 border-t border-zinc-200 dark:border-white/10 flex items-center justify-between mt-2 transition-colors">
                  <span className="font-serif font-bold text-lg text-zinc-900 dark:text-white">{proj.total}</span>
                  <div className="flex items-center gap-2">
                    {proj.received && <span className="text-xs font-semibold text-green-600 dark:text-green-400">{proj.received}</span>}
                    <ChevronRight className="w-4 h-4 text-zinc-400 dark:text-zinc-600" />
                  </div>
                </div>
              )}
            </Link>
          ))
        ) : (
          <div className="text-center py-12 px-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">No Projects Found</h3>
            <p className="text-zinc-500 text-sm mb-6 max-w-sm mx-auto">There are no projects matching this filter. Create a new project to get started.</p>
            <ShutterButton 
              onClick={() => router.push("/admin/projects/new")} 
              className="bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:text-black font-semibold rounded-xl px-6 py-3"
            >
              Add Project
            </ShutterButton>
          </div>
        )}
      </div>
    </div>
  );
}
