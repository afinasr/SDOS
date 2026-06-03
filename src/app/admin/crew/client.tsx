"use client";
import { UserPlus, KeyRound, Eye, ChevronRight } from "lucide-react";
import { ShutterButton } from "@/components/ui/shutter-button";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { playTickSound, playSwooshSound } from "@/lib/audio";
import { createCrewMember } from "./actions";

export default function CrewClient({ initialCrew }: { initialCrew: any[] }) {
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [revealedPin, setRevealedPin] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Form State
  const [name, setName] = useState("");
  const [role, setRole] = useState("Lead Photographer");
  const [fee, setFee] = useState("");
  const [description, setDescription] = useState("");

  const handleAddCrew = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        playTickSound();
        await createCrewMember(name, role, Number(fee), description);
        setShowAddModal(false);
        playSwooshSound();
        setName("");
        setFee("");
        setDescription("");
      } catch (err) {
        console.error(err);
      }
    });
  };

  // Helper to get initials
  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0,2);
  };

  // Helper for colors
  const getColorClasses = (roleStr: string) => {
    if (roleStr.includes("Lead") || roleStr.includes("Primary")) return "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-400/20";
    if (roleStr.includes("Video")) return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-400/20";
    if (roleStr.includes("Editor")) return "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-400/20";
    return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-400/20";
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const avgFee = initialCrew.length > 0 
    ? initialCrew.reduce((acc, c) => acc + Number(c.fee), 0) / initialCrew.length
    : 0;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center pt-2 pr-14">
        <div>
          <h1 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white">Crew Management</h1>
        </div>
        <ShutterButton size="icon" className="rounded-full bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:text-black border-none" onClick={() => { playSwooshSound(); setShowAddModal(true); }}>
          <UserPlus className="w-5 h-5" />
        </ShutterButton>
      </div>

      {/* Stats Blocks */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
        <div className="bg-white/80 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-3xl p-5 transition-colors">
          <h3 className="text-3xl font-serif font-bold text-cyan-600 dark:text-cyan-400">{initialCrew.length}</h3>
          <p className="text-[10px] sm:text-xs font-semibold text-zinc-500 uppercase tracking-wider mt-1">Team Members</p>
        </div>
        <div className="bg-white/80 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-3xl p-5 transition-colors">
          <h3 className="text-3xl font-serif font-bold text-zinc-900 dark:text-white">₹{avgFee.toLocaleString()}</h3>
          <p className="text-[10px] sm:text-xs font-semibold text-zinc-500 uppercase tracking-wider mt-1">Avg Fee/Event</p>
        </div>
      </motion.div>

      {/* Crew Cards */}
      <motion.div variants={itemVariants} className="space-y-4 pb-4">
        {initialCrew.map((member) => (
          <div key={member.id} className="bg-white/80 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-[1.5rem] overflow-hidden transition-colors">
            <div className="p-5 flex justify-between items-start">
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-serif font-bold text-lg border border-zinc-200 dark:border-white/5 ${getColorClasses(member.role)}`}>
                  {getInitials(member.name)}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-zinc-900 dark:text-white">{member.name}</h4>
                  <p className={`text-xs font-medium mt-0.5 ${getColorClasses(member.role).split(" ")[0]}`}>{member.role}</p>
                  <p className="text-xs text-zinc-500 mt-1">{member.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-zinc-900 dark:text-white">₹{Number(member.fee).toLocaleString()}</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">per event</p>
                <ChevronRight className="w-4 h-4 text-zinc-400 dark:text-zinc-600 block ml-auto mt-4" />
              </div>
            </div>

            {/* Action Footer */}
            <div className="grid grid-cols-2 border-t border-zinc-200 dark:border-white/10 divide-x divide-zinc-200 dark:divide-white/10">
              <button className="py-4 flex items-center justify-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors hover:bg-zinc-50 dark:hover:bg-white/5" onClick={() => { playTickSound(); setRevealedPin(revealedPin === member.id ? null : member.id); }}>
                <KeyRound className="w-4 h-4" />
                {revealedPin === member.id ? `PIN: ${member.id.substring(0,4)}` : "Show Login PIN"}
              </button>
              <button className="py-4 flex items-center justify-center gap-2 text-xs font-semibold text-cyan-600 dark:text-cyan-500 hover:text-cyan-700 dark:hover:text-cyan-400 transition-colors hover:bg-zinc-50 dark:hover:bg-white/5" onClick={() => { playTickSound(); router.push(`/crew`); }}>
                <Eye className="w-4 h-4" />
                View as {member.name.split(" ")[0]}
              </button>
            </div>
          </div>
        ))}
      </motion.div>

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
              className="w-full max-w-md bg-zinc-50 dark:bg-zinc-900 rounded-t-3xl sm:rounded-3xl border border-zinc-200 dark:border-white/10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-5 border-b border-zinc-200 dark:border-white/10 flex justify-between items-center bg-white/50 dark:bg-black/50 shrink-0">
                <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Add Crew Member</h3>
                <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 p-2 rounded-full">
                  <UserPlus className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto flex-1">
                <form onSubmit={handleAddCrew} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Full Name</label>
                    <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-white dark:bg-black/50 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="e.g. Arjun Mehta" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Role</label>
                    <select value={role} onChange={e => setRole(e.target.value)} className="w-full bg-white dark:bg-black/50 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                      <option>Lead Photographer</option>
                      <option>Second Shooter</option>
                      <option>Videographer</option>
                      <option>Drone Operator</option>
                      <option>Photo Editor</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Default Fee (₹)</label>
                    <input type="number" required value={fee} onChange={e => setFee(e.target.value)} className="w-full bg-white dark:bg-black/50 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="e.g. 5000" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Specialty / Description</label>
                    <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-white dark:bg-black/50 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="e.g. Candid & Portrait" />
                  </div>

                  <div className="pt-4">
                    <ShutterButton loading={isPending} type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-4 rounded-xl font-bold">
                      Add to Crew
                    </ShutterButton>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
