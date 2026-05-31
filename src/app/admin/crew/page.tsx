"use client";
import { UserPlus, KeyRound, Eye, ChevronRight, X } from "lucide-react";
import { ShutterButton } from "@/components/ui/shutter-button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function CrewView() {
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [revealedPin, setRevealedPin] = useState<number | null>(null);
  const crew = [
    { initials: "AM", name: "Arjun Mehta", role: "Lead Photographer", desc: "Candid & Portrait", fee: "₹8,000", shoots: "2 shoots", roleColor: "text-orange-600 dark:text-orange-400", avatarColor: "bg-orange-100 text-orange-600 dark:bg-orange-400/20 dark:text-orange-400" },
    { initials: "PS", name: "Priya Sharma", role: "Videographer", desc: "Cinematic Films", fee: "₹7,000", shoots: "1 shoots", roleColor: "text-blue-600 dark:text-blue-400", avatarColor: "bg-blue-100 text-blue-600 dark:bg-blue-400/20 dark:text-blue-400" },
    { initials: "RN", name: "Rahul Nair", role: "Assistant Photographer", desc: "Detail & Decor", fee: "₹4,000", shoots: "2 shoots", roleColor: "text-green-600 dark:text-green-400", avatarColor: "bg-green-100 text-green-600 dark:bg-green-400/20 dark:text-green-400" },
    { initials: "SK", name: "Sneha Kapoor", role: "Photo Editor", desc: "Album Design", fee: "₹5,000", shoots: "0 shoots", roleColor: "text-purple-600 dark:text-purple-400", avatarColor: "bg-purple-100 text-purple-600 dark:bg-purple-400/20 dark:text-purple-400" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center pt-2">
        <h1 className="text-4xl font-serif font-bold text-zinc-900 dark:text-white">Crew</h1>
        <ShutterButton size="icon" className="rounded-full bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:text-black border-none" onClick={() => setShowAddModal(true)}>
          <UserPlus className="w-5 h-5" />
        </ShutterButton>
      </div>

      {/* Stats Blocks */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl p-5 transition-colors">
          <h3 className="text-3xl font-serif font-bold text-cyan-600 dark:text-cyan-400">4</h3>
          <p className="text-[10px] sm:text-xs font-semibold text-zinc-500 uppercase tracking-wider mt-1">Team Members</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl p-5 transition-colors">
          <h3 className="text-3xl font-serif font-bold text-zinc-900 dark:text-white">₹6,000</h3>
          <p className="text-[10px] sm:text-xs font-semibold text-zinc-500 uppercase tracking-wider mt-1">Avg Fee/Event</p>
        </div>
      </div>

      {/* Crew Cards */}
      <div className="space-y-4 pb-4">
        {crew.map((member, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-[1.5rem] overflow-hidden transition-colors">
            <div className="p-5 flex justify-between items-start">
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-serif font-bold text-lg border border-zinc-200 dark:border-white/5 ${member.avatarColor}`}>
                  {member.initials}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-zinc-900 dark:text-white">{member.name}</h4>
                  <p className={`text-xs font-medium mt-0.5 ${member.roleColor}`}>{member.role}</p>
                  <p className="text-xs text-zinc-500 mt-1">{member.desc}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-zinc-900 dark:text-white">{member.fee}</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">per event</p>
                <div className="mt-2 bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-300 text-[10px] px-2 py-1 rounded-full font-medium inline-block">
                  {member.shoots}
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400 dark:text-zinc-600 block ml-auto mt-2" />
              </div>
            </div>

            {/* Action Footer */}
            <div className="grid grid-cols-2 border-t border-zinc-200 dark:border-white/10 divide-x divide-zinc-200 dark:divide-white/10">
              <button className="py-4 flex items-center justify-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors hover:bg-zinc-50 dark:hover:bg-white/5" onClick={() => setRevealedPin(revealedPin === i ? null : i)}>
                <KeyRound className="w-4 h-4" />
                {revealedPin === i ? "PIN: 1492" : "Show Login PIN"}
              </button>
              <button className="py-4 flex items-center justify-center gap-2 text-xs font-semibold text-cyan-600 dark:text-cyan-500 hover:text-cyan-700 dark:hover:text-cyan-400 transition-colors hover:bg-zinc-50 dark:hover:bg-white/5" onClick={() => router.push(`/crew`)}>
                <Eye className="w-4 h-4" />
                View as {member.name.split(" ")[0]}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Crew Member Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-3xl border border-zinc-200 dark:border-white/10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-5 border-b border-zinc-200 dark:border-white/10 flex justify-between items-center bg-zinc-50/50 dark:bg-white/5 shrink-0">
                <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Add Crew Member</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-zinc-200 dark:hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                </button>
              </div>
              <div className="p-6 space-y-4 overflow-y-auto">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Full Name</label>
                  <input type="text" placeholder="e.g. Aditi Rao" className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Role / Speciality</label>
                  <input type="text" placeholder="e.g. Drone Operator" className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Phone</label>
                    <input type="tel" placeholder="+91" className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Per-Event Fee</label>
                    <input type="number" placeholder="₹" className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white transition-all" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Email (Optional)</label>
                  <input type="email" placeholder="aditi@example.com" className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white transition-all" />
                </div>
                
                <div className="mt-6 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-100 dark:border-cyan-900/30 rounded-xl p-4">
                  <p className="text-xs font-semibold text-cyan-800 dark:text-cyan-400 mb-1 uppercase tracking-wider">Auto-Generated PIN</p>
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-2xl font-bold tracking-widest text-cyan-900 dark:text-cyan-300">8341</span>
                    <span className="text-[10px] text-cyan-700/70 dark:text-cyan-500">Save to share with crew</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button onClick={() => setShowAddModal(false)} className="w-full bg-zinc-900 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-black font-bold py-4 rounded-xl transition-all">
                    Add Member
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
