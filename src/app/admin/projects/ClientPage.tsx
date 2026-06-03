"use client";
import { Link2, MapPin, Calendar as CalendarIcon, ChevronRight } from "lucide-react";
import { ShutterButton } from "@/components/ui/shutter-button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { generateOnboardingLink } from "./actions";
import { toast } from "sonner";

export default function ClientPage({ projects }: { projects: any[] }) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateLink = async () => {
    setIsGenerating(true);
    try {
      const response = await generateOnboardingLink();
      if (response?.error) {
        throw new Error(response.error);
      }
      const url = `${window.location.origin}/portal/${response.magic_link_token}`;
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch (e: any) {
      toast.error(e.message || "Failed to generate link.");
    } finally {
      setIsGenerating(false);
    }
  };

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
        <ShutterButton 
          className="bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:text-black border-none rounded-xl" 
          onClick={handleGenerateLink}
          disabled={isGenerating}
        >
          <Link2 className="w-4 h-4 mr-2" />
          {isGenerating ? "Generating..." : "Generate Link"}
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
            <Link key={i} href={`/admin/projects/${proj.id}`} className="block bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-[1.5rem] p-5 relative cursor-pointer hover:bg-zinc-50 dark:hover:bg-white/10 transition-colors">
              {/* Status Pill */}
              <div className={`absolute top-5 right-5 flex items-center gap-1.5 border px-2 py-1 rounded-full text-[10px] font-medium uppercase tracking-wide ${proj.sColor}`}>
                <div className="w-1.5 h-1.5 rounded-full bg-current" />
                {proj.status}
              </div>
              
              <h4 className="font-bold text-lg text-zinc-900 dark:text-white pr-24">{proj.title}</h4>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{proj.event_type} • {proj.client_name}</p>
              
              <div className="space-y-2 mt-4 mb-4">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{new Date(proj.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{proj.location}</span>
                </div>
              </div>

              {/* Financial Footer (if applicable) */}
              <div className="pt-4 border-t border-zinc-200 dark:border-white/10 flex items-center justify-between mt-2 transition-colors">
                <span className="font-serif font-bold text-lg text-zinc-900 dark:text-white">₹{Number(proj.total_value).toLocaleString('en-IN')}</span>
                <div className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-zinc-400 dark:text-zinc-600" />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-12 px-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">No Projects Found</h3>
            <p className="text-zinc-500 text-sm mb-6 max-w-sm mx-auto">There are no projects matching this filter. Create a new project to get started.</p>
            <ShutterButton 
              onClick={handleGenerateLink} 
              disabled={isGenerating}
              className="bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:text-black font-semibold rounded-xl px-6 py-3"
            >
              <Link2 className="w-4 h-4 mr-2" />
              {isGenerating ? "Generating..." : "Generate Link"}
            </ShutterButton>
          </div>
        )}
      </div>
    </div>
  );
}
