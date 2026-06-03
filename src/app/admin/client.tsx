"use client";
import { useState, useTransition } from "react";
import { Settings, Plus, Zap, UserPlus, Calendar, Users, TrendingUp, ChevronRight, MapPin, Calendar as CalendarIcon } from "lucide-react";
import { ShutterButton } from "@/components/ui/shutter-button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { playTickSound } from "@/lib/audio";

export default function DashboardClient({ 
  stats, 
  totalReceived, 
  upcomingShoots, 
  recentProjects 
}: { 
  stats: any, 
  totalReceived: number, 
  upcomingShoots: any[], 
  recentProjects: any[] 
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);

  const handleNav = (path: string) => {
    playTickSound();
    setNavigatingTo(path);
    startTransition(() => {
      router.push(path);
    });
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const getDaysCountdown = (dateString: string) => {
    const diffTime = Math.abs(new Date(dateString).getTime() - new Date().getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center pt-1 pr-14">
        <div>
          <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Studio Desk</p>
          <h1 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white mt-0.5">Dashboard</h1>
        </div>
        <div className="flex gap-3">
          <ShutterButton 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-zinc-100 dark:bg-white/5 border-zinc-200 dark:border-white/10 hover:bg-zinc-200 dark:hover:bg-white/10" 
            onClick={() => handleNav("/admin/settings")}
            loading={isPending && navigatingTo === "/admin/settings"}
          >
            <Settings className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
          </ShutterButton>
          <ShutterButton 
            size="icon" 
            className="rounded-full bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:text-black border-none" 
            onClick={() => handleNav("/admin/projects/new")}
            loading={isPending && navigatingTo === "/admin/projects/new"}
          >
            <Plus className="w-4 h-4" />
          </ShutterButton>
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
        {[
          { label: "ACTIVE", value: stats.activeCount, icon: Zap, href: "/admin/projects" },
          { label: "LEADS", value: stats.leadsCount, icon: UserPlus, href: "/admin/projects" },
          { label: "UPCOMING (30D)", value: stats.upcomingCount, icon: Calendar, href: "/admin/calendar" },
          { label: "CREW", value: stats.crewCount, icon: Users, href: "/admin/crew" },
        ].map((stat, i) => (
          <Link href={stat.href} onClick={playTickSound} key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl p-3.5 flex flex-col justify-between h-24 transition-colors hover:border-cyan-500 dark:hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/10 block cursor-pointer">
            <div className="bg-zinc-100 dark:bg-white/10 w-7 h-7 rounded-lg flex items-center justify-center">
              <stat.icon className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <h3 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white">{stat.value}</h3>
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mt-0.5">{stat.label}</p>
            </div>
          </Link>
        ))}
      </motion.div>

      {/* Total Received */}
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-cyan-600 to-cyan-400 dark:from-cyan-700 dark:to-cyan-500 rounded-3xl p-4 flex items-center gap-3 transition-colors shadow-lg shadow-cyan-500/20 border border-cyan-500 dark:border-cyan-600">
        <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-cyan-950/70 dark:text-cyan-950 uppercase tracking-wider">Total Received</p>
          <h3 className="text-2xl font-serif font-bold text-white mt-0.5">₹{totalReceived.toLocaleString()}</h3>
        </div>
      </motion.div>

      {/* Upcoming Shoots */}
      <motion.div variants={itemVariants} className="space-y-3 pt-2">
        <h2 className="text-lg font-serif font-bold text-zinc-900 dark:text-white">Upcoming Shoots</h2>
        <div className="bg-white/80 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-3xl overflow-hidden divide-y divide-zinc-100 dark:divide-white/5 transition-colors">
          {upcomingShoots.map((shoot, i) => {
            const d = new Date(shoot.event_date);
            return (
              <Link key={i} onClick={playTickSound} href={`/admin/projects/${shoot.id}`} className="p-3 sm:p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors cursor-pointer block">
                <div className="flex items-center gap-3">
                  <div className="bg-zinc-50 dark:bg-white/10 border border-zinc-200 dark:border-white/10 rounded-xl w-10 h-10 flex flex-col items-center justify-center">
                    <span className="text-base font-bold text-cyan-600 dark:text-cyan-400 leading-none">{d.getDate()}</span>
                    <span className="text-[9px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase mt-0.5">
                      {d.toLocaleString('default', { month: 'short' })}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">{shoot.title}</h4>
                    <p className="text-[11px] text-zinc-500 mt-0.5">{shoot.location || "Location TBD"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-300 text-[10px] px-2 py-1 rounded-md font-medium">{getDaysCountdown(shoot.event_date)}d</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600" />
                </div>
              </Link>
            )
          })}
          {upcomingShoots.length === 0 && (
            <div className="p-6 text-center text-zinc-500 text-sm">
              No upcoming shoots.
            </div>
          )}
        </div>
      </motion.div>

      {/* Recent Projects */}
      <motion.div variants={itemVariants} className="space-y-3 pt-2 pb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-serif font-bold text-zinc-900 dark:text-white">Recent Projects</h2>
          <Link href="/admin/projects" onClick={playTickSound} className="text-[11px] font-medium text-cyan-600 dark:text-cyan-500 hover:text-cyan-700 dark:hover:text-cyan-400 transition-colors">See all</Link>
        </div>
        
        <div className="space-y-2.5">
          {recentProjects.map((proj, i) => {
            const isLead = proj.status === 'Lead';
            const sColor = isLead 
              ? "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-400/10 border-orange-200 dark:border-orange-400/20" 
              : "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-400/10 border-green-200 dark:border-green-400/20";
              
            return (
              <Link key={i} onClick={playTickSound} href={`/admin/projects/${proj.id}`} className="block bg-white/80 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-3xl p-3.5 relative overflow-hidden transition-colors hover:bg-zinc-50 dark:hover:bg-white/5 cursor-pointer">
                <div className={`absolute top-3.5 right-3.5 flex items-center gap-1 border px-1.5 py-0.5 rounded-full text-[9px] font-medium uppercase tracking-wide bg-opacity-20 backdrop-blur-md ${sColor}`}>
                   <div className={`w-1 h-1 rounded-full bg-current`} />
                   {proj.status}
                </div>
                
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white pr-16">{proj.title}</h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">{proj.event_type || 'Photography'}</p>
                
                <div className="space-y-1.5 mt-2.5">
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span>{new Date(proj.event_date).toLocaleDateString()}</span>
                  </div>
                  {proj.location && (
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate">{proj.location}</span>
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
