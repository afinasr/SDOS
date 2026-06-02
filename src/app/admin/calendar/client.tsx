"use client";
import { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, UserX } from "lucide-react";
import { playTickSound } from "@/lib/audio";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CalendarClient({ initialData }: { initialData: any }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const projects = initialData.projects;
  const unavailabilities = initialData.unavailabilities;

  const nextMonth = () => { playTickSound(); setCurrentDate(addMonths(currentDate, 1)); };
  const prevMonth = () => { playTickSound(); setCurrentDate(subMonths(currentDate, 1)); };
  const jumpToToday = () => { playTickSound(); setCurrentDate(new Date()); };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay = day;

      const dayProjects = projects.filter((p: any) => isSameDay(parseISO(p.event_date), cloneDay));
      const dayUnavail = unavailabilities.filter((u: any) => isSameDay(parseISO(u.date), cloneDay));

      days.push(
        <div
          key={day.toString()}
          className={`min-h-[100px] sm:min-h-[140px] p-2 border border-zinc-200/50 dark:border-white/5 transition-colors relative overflow-hidden group ${
            !isSameMonth(day, monthStart)
              ? "bg-zinc-50/50 dark:bg-zinc-900/20 text-zinc-400 dark:text-zinc-600"
              : "bg-white dark:bg-zinc-900/50 text-zinc-800 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5"
          } ${isSameDay(day, new Date()) ? "ring-2 ring-inset ring-cyan-500/50" : ""}`}
        >
          <span className={`text-xs font-bold ${isSameDay(day, new Date()) ? "text-cyan-600 dark:text-cyan-400" : ""}`}>
            {formattedDate}
          </span>

          <div className="mt-2 space-y-1.5 h-full overflow-y-auto no-scrollbar pb-6">
            {dayProjects.map((p: any) => (
              <Link 
                href={`/admin/projects/${p.id}`} 
                key={p.id}
                onClick={playTickSound}
                className="block text-[10px] sm:text-xs font-semibold p-1.5 rounded-lg border bg-opacity-20 backdrop-blur-md truncate cursor-pointer transition-transform hover:scale-[1.02] active:scale-95 bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-100 dark:border-cyan-800/50"
              >
                {p.title}
                {p.location && (
                  <span className="block font-normal text-[9px] mt-0.5 opacity-80 truncate flex items-center gap-1">
                     <MapPin className="w-3 h-3" /> {p.location}
                  </span>
                )}
              </Link>
            ))}
            
            {dayUnavail.map((u: any) => (
              <div 
                key={u.id}
                className="text-[10px] font-medium p-1.5 rounded-lg border bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900/50 flex flex-col gap-0.5"
              >
                <div className="flex items-center gap-1 font-bold">
                  <UserX className="w-3 h-3" /> 
                  <span className="truncate">{u.crew_members?.name}</span>
                </div>
                {u.reason && <span className="opacity-80 truncate text-[9px]">{u.reason}</span>}
              </div>
            ))}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7" key={day.toString()}>
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2">
        <div>
          <h1 className="text-4xl font-serif font-bold text-zinc-900 dark:text-white flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-cyan-600 dark:text-cyan-500" />
            Studio Calendar
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">Overview of upcoming shoots and crew unavailability.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-1.5 shadow-sm">
           <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors text-zinc-600 dark:text-zinc-400">
             <ChevronLeft className="w-5 h-5" />
           </button>
           <button onClick={jumpToToday} className="px-4 py-2 font-bold text-sm text-zinc-900 dark:text-white min-w-[140px] text-center hover:bg-zinc-50 dark:hover:bg-white/5 rounded-xl transition-colors">
             {format(currentDate, "MMMM yyyy")}
           </button>
           <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors text-zinc-600 dark:text-zinc-400">
             <ChevronRight className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-zinc-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl shadow-zinc-200/20 dark:shadow-black/50">
        <div className="grid grid-cols-7 border-b border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-black/20">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="py-3 text-center text-xs font-bold uppercase tracking-wider text-zinc-500">
              {day}
            </div>
          ))}
        </div>
        <div className="flex flex-col bg-zinc-100/50 dark:bg-black/40">
           {rows}
        </div>
      </div>
    </div>
  );
}
