"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Search, ChevronLeft, User } from "lucide-react";
import { useRouter } from "next/navigation";

const MOCK_CREW = [
  { id: 1, name: "Arjun Mehta", role: "Lead Photographer" },
  { id: 2, name: "Neha Sharma", role: "Cinematographer" },
  { id: 3, name: "Vikram Singh", role: "Drone Operator" },
  { id: 4, name: "Priya Desai", role: "Assistant Photographer" },
  { id: 5, name: "Rahul Verma", role: "Video Editor" },
];

export default function RoleSelectorPage() {
  const router = useRouter();
  const [showCrewList, setShowCrewList] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCrew = MOCK_CREW.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      <AnimatePresence mode="wait">
        {!showCrewList ? (
          <motion.div 
            key="role-selection"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full max-w-3xl space-y-12"
          >
            <div className="text-center space-y-3">
              <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-zinc-900 dark:text-white">Studio Desk OS</h1>
              <p className="text-xl text-zinc-500 font-medium">Select your role to continue</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link href="/admin" className="block p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl shadow-sm hover:border-cyan-500 transition-all h-full flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-3 text-zinc-900 dark:text-white">Studio Owner</h2>
                    <p className="text-zinc-500 mb-8">Manage projects, proposals, billing, and crew schedules seamlessly.</p>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-white/5 text-center rounded-xl py-4 font-semibold text-zinc-900 dark:text-white">
                    Owner Login
                  </div>
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <div onClick={() => setShowCrewList(true)} className="cursor-pointer block p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl shadow-sm hover:border-amber-500 transition-all h-full flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-3 text-zinc-900 dark:text-white">Crew Member</h2>
                    <p className="text-zinc-500 mb-8">View your assigned shoots, daily schedule, and payouts directly.</p>
                  </div>
                  <div className="w-full border-2 border-dashed border-zinc-300 dark:border-white/10 text-center rounded-xl py-4 font-semibold text-zinc-700 dark:text-zinc-300">
                    Crew Login
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="crew-list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-zinc-200 dark:border-white/10 flex items-center gap-4">
              <button onClick={() => setShowCrewList(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-full transition-colors">
                <ChevronLeft className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              </button>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Who are you?</h2>
            </div>
            
            <div className="p-4 border-b border-zinc-200 dark:border-white/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  type="text" 
                  placeholder="Search crew..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow"
                />
              </div>
            </div>

            <div className="max-h-[50vh] overflow-y-auto">
              {filteredCrew.length > 0 ? (
                <div className="divide-y divide-zinc-100 dark:divide-white/5">
                  {filteredCrew.map(crew => (
                    <button 
                      key={crew.id}
                      onClick={() => router.push(`/crew`)}
                      className="w-full p-4 flex items-center gap-4 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-white">{crew.name}</p>
                        <p className="text-xs text-zinc-500">{crew.role}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-zinc-500">No crew found matching "{searchQuery}"</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
