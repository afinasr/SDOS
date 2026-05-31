"use client";
import { Calendar, MapPin, IndianRupee, Clock, CheckCircle2 } from "lucide-react";

export default function CrewJobsView() {
  const upcomingJobs = [
    { client: "Aisha & Rohan", type: "Wedding", date: "6 Jun 2026", loc: "The Leela Palace, Mumbai", fee: "₹15,000", reqs: "Candid covering bride side, bring 50mm", urgency: "Today", color: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
    { client: "Kavya & Aryan", type: "Sangeet", date: "5 Jul 2026", loc: "Taj Mahal Hotel, Delhi", fee: "₹12,000", reqs: "Standard coverage", urgency: "29 days", color: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  ];

  const pastJobs = [
    { client: "Meera & Dev", type: "Destination Wedding", date: "21 May 2026", fee: "₹15,000" },
    { client: "Nisha & Karan", type: "Engagement", date: "10 May 2026", fee: "₹8,000" },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <p className="text-sm font-semibold text-amber-600 dark:text-amber-500 uppercase tracking-widest">Lead Photographer</p>
        <h1 className="text-4xl font-serif font-bold text-zinc-900 dark:text-white mt-1">Hi, Arjun</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 flex flex-col justify-between aspect-square">
          <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400 mb-2" />
          <div>
            <h3 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white">2</h3>
            <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Upcoming</p>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 flex flex-col justify-between aspect-square">
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mb-2" />
          <div>
            <h3 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white">24</h3>
            <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Completed</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between aspect-square">
          <IndianRupee className="w-5 h-5 text-amber-400 mb-2" />
          <div>
            <h3 className="text-2xl font-serif font-bold text-white">₹3.2L</h3>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Earned</p>
          </div>
        </div>
      </div>

      {/* Upcoming Assignments */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-serif font-bold text-zinc-900 dark:text-white">Upcoming Shoots</h2>
        <div className="space-y-4">
          {upcomingJobs.map((job, i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-[1.5rem] p-5 relative overflow-hidden shadow-sm">
              <div className={`absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${job.color}`}>
                <Clock className="w-3 h-3" />
                {job.urgency}
              </div>
              
              <h4 className="font-bold text-lg text-zinc-900 dark:text-white pr-24">{job.client}</h4>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{job.type}</p>
              
              <div className="space-y-2 mt-4 bg-zinc-50 dark:bg-white/5 p-3 rounded-xl border border-zinc-100 dark:border-white/5">
                <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                  <Calendar className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-500" />
                  <span className="font-medium">{job.date}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                  <MapPin className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-500" />
                  <span className="font-medium truncate">{job.loc}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-white/10 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Remuneration</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{job.fee}</span>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg border border-amber-100 dark:border-amber-900/30">
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-500 uppercase tracking-wider block mb-1">Requirements</span>
                  <p className="text-xs text-amber-900/80 dark:text-amber-200/70">{job.reqs}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Shoots */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-serif font-bold text-zinc-900 dark:text-white">Past Shoots</h2>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl overflow-hidden divide-y divide-zinc-100 dark:divide-white/5">
          {pastJobs.map((job, i) => (
            <div key={i} className="p-4 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-zinc-900 dark:text-white text-sm">{job.client}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-zinc-500">{job.type}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <span className="text-xs text-zinc-500">{job.date}</span>
                </div>
              </div>
              <span className="text-sm font-bold text-zinc-900 dark:text-white bg-zinc-100 dark:bg-white/10 px-2.5 py-1.5 rounded-lg">{job.fee}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
