"use client";
import { Settings, Plus, Zap, UserPlus, Calendar, Users, TrendingUp, ChevronRight, MapPin, Calendar as CalendarIcon } from "lucide-react";
import { ShutterButton } from "@/components/ui/shutter-button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center pt-2">
        <div>
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Studio Desk</p>
          <h1 className="text-4xl font-serif font-bold text-zinc-900 dark:text-white mt-1">Dashboard</h1>
        </div>
        <div className="flex gap-3">
          <ShutterButton variant="outline" size="icon" className="rounded-full bg-zinc-100 dark:bg-white/5 border-zinc-200 dark:border-white/10 hover:bg-zinc-200 dark:hover:bg-white/10" onClick={() => router.push("/admin/settings")}>
            <Settings className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
          </ShutterButton>
          <ShutterButton size="icon" className="rounded-full bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:text-black border-none" onClick={() => router.push("/admin/projects/new")}>
            <Plus className="w-5 h-5" />
          </ShutterButton>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "ACTIVE", value: "1", icon: Zap, href: "/admin/projects" },
          { label: "LEADS", value: "2", icon: UserPlus, href: "/admin/projects" },
          { label: "UPCOMING (30D)", value: "1", icon: Calendar, href: "/admin/calendar" },
          { label: "CREW", value: "4", icon: Users, href: "/admin/crew" },
        ].map((stat, i) => (
          <Link href={stat.href} key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl p-5 flex flex-col justify-between h-32 transition-colors hover:border-cyan-500 dark:hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/10 block cursor-pointer">
            <div className="bg-zinc-100 dark:bg-white/10 w-8 h-8 rounded-lg flex items-center justify-center">
              <stat.icon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <h3 className="text-3xl font-serif font-bold text-zinc-900 dark:text-white">{stat.value}</h3>
              <p className="text-[10px] sm:text-xs font-semibold text-zinc-500 uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Total Received */}
      <div className="bg-gradient-to-r from-amber-500 to-yellow-400 dark:from-amber-600 dark:to-amber-400 rounded-3xl p-6 flex items-center gap-4 transition-colors shadow-lg shadow-amber-500/20 border border-amber-400 dark:border-amber-500">
        <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-[10px] sm:text-xs font-bold text-amber-900/70 dark:text-amber-950 uppercase tracking-wider">Total Received</p>
          <h3 className="text-3xl font-serif font-bold text-white mt-1">₹55,000</h3>
        </div>
      </div>

      {/* Upcoming Shoots */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-serif font-bold text-zinc-900 dark:text-white">Upcoming Shoots</h2>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl overflow-hidden divide-y divide-zinc-100 dark:divide-white/5 transition-colors">
          {[
            { names: "Aisha & Rohan", venue: "The Leela Palace, Mumbai", day: "6", month: "JUN", countdown: "7d" },
            { names: "Kavya & Aryan", venue: "Taj Mahal Hotel, Delhi", day: "6", month: "JUL", countdown: "37d" },
            { names: "Meera & Dev", venue: "Umaid Bhawan Palace, Jodhpur", day: "21", month: "JUL", countdown: "52d" },
          ].map((shoot, i) => (
            <Link key={i} href={`/admin/projects/${shoot.names.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="p-4 sm:p-5 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors cursor-pointer block">
              <div className="flex items-center gap-4">
                <div className="bg-zinc-50 dark:bg-white/10 border border-zinc-200 dark:border-white/10 rounded-xl w-12 h-12 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-cyan-600 dark:text-cyan-400 leading-none">{shoot.day}</span>
                  <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase mt-0.5">{shoot.month}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-white">{shoot.names}</h4>
                  <p className="text-xs text-zinc-500 mt-1">{shoot.venue}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-300 text-[10px] px-2 py-1 rounded-md font-medium">{shoot.countdown}</span>
                <ChevronRight className="w-4 h-4 text-zinc-400 dark:text-zinc-600" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Projects */}
      <div className="space-y-4 pt-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-serif font-bold text-zinc-900 dark:text-white">Recent Projects</h2>
          <Link href="/admin/projects" className="text-sm font-medium text-cyan-600 dark:text-cyan-500 hover:text-cyan-700 dark:hover:text-cyan-400 transition-colors">See all</Link>
        </div>
        
        <div className="space-y-3">
          {[
            { names: "Meera & Dev", type: "Destination Wedding", date: "21 Jul 2026", loc: "Umaid Bhawan Palace, Jodhpur", status: "Lead", sColor: "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-400/10 border-orange-200 dark:border-orange-400/20" },
            { names: "Nisha & Karan", type: "Engagement", date: "25 May 2026", loc: "ITC Grand Chola, Chennai", status: "Lead", sColor: "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-400/10 border-orange-200 dark:border-orange-400/20" },
          ].map((proj, i) => (
            <Link key={i} href={`/admin/projects/${proj.names.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="block bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl p-5 relative overflow-hidden transition-colors hover:bg-zinc-50 dark:hover:bg-white/5 cursor-pointer">
              <div className={`absolute top-5 right-5 flex items-center gap-1.5 border px-2 py-1 rounded-full text-[10px] font-medium uppercase tracking-wide bg-opacity-20 backdrop-blur-md ${proj.sColor}`}>
                 <div className={`w-1.5 h-1.5 rounded-full bg-current`} />
                 {proj.status}
              </div>
              
              <h4 className="font-bold text-lg text-zinc-900 dark:text-white pr-20">{proj.names}</h4>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{proj.type}</p>
              
              <div className="space-y-2 mt-4">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{proj.date}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{proj.loc}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
