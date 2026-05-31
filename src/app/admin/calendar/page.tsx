"use client";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin } from "lucide-react";
import { ShutterButton } from "@/components/ui/shutter-button";
import Link from "next/link";

export default function CalendarView() {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  
  // Dummy calendar grid for May 2026
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-4xl font-serif font-bold text-zinc-900 dark:text-white">Calendar</h1>
        <div className="inline-block mt-3 bg-blue-100 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs px-3 py-1.5 rounded-full font-medium transition-colors">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 inline-block mr-2" />
          2 shoots in May
        </div>
      </div>

      {/* Calendar Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-[1.5rem] p-5 transition-colors">
        <div className="flex justify-between items-center mb-6">
          <ShutterButton size="icon" variant="ghost" className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10" onClick={() => alert("Previous Month")}>
            <ChevronLeft className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
          </ShutterButton>
          <h2 className="font-semibold text-lg text-zinc-900 dark:text-white">May 2026</h2>
          <ShutterButton size="icon" variant="ghost" className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10" onClick={() => alert("Next Month")}>
            <ChevronRight className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
          </ShutterButton>
        </div>

        <div className="grid grid-cols-7 gap-y-4 text-center mb-4">
          {days.map((day) => (
            <div key={day} className="text-[10px] font-semibold text-zinc-500">{day}</div>
          ))}
          
          {/* Empty offset for May 1st on a Friday */}
          <div /><div /><div /><div /><div />
          
          {dates.map((date) => {
            const isBooked = [2, 25].includes(date);
            const isSelected = date === 21;
            const isToday = date === 30;

            let dateClass = "w-8 h-8 mx-auto flex items-center justify-center rounded-xl text-sm font-medium transition-colors cursor-pointer ";
            if (isSelected) {
              dateClass += "bg-orange-100 border border-orange-200 text-orange-600 dark:bg-orange-500/20 dark:border-orange-500/30 dark:text-orange-400";
            } else if (isBooked) {
              dateClass += "bg-blue-100 border border-blue-200 text-blue-600 dark:bg-blue-500/20 dark:border-blue-500/30 dark:text-blue-400 relative";
            } else if (isToday) {
              dateClass += "bg-zinc-200 text-zinc-900 dark:bg-white/10 dark:text-white";
            } else {
              dateClass += "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/5";
            }

            return (
              <div key={date} onClick={() => alert(`Selected date: ${date}`)}>
                <div className={dateClass}>
                  {date}
                  {isBooked && !isSelected && <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-blue-500 dark:bg-blue-400" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 pt-4 border-t border-zinc-200 dark:border-white/10 transition-colors">
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400"><div className="w-2.5 h-2.5 rounded-md bg-zinc-200 dark:bg-white/10" /> Today</div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400"><div className="w-2.5 h-2.5 rounded-md bg-blue-100 border border-blue-200 dark:bg-blue-500/20 dark:border-blue-500/30" /> Booked</div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400"><div className="w-2.5 h-2.5 rounded-md bg-orange-100 border border-orange-200 dark:bg-orange-500/20 dark:border-orange-500/30" /> Selected</div>
        </div>
      </div>

      {/* Upcoming Shoots */}
      <div className="space-y-4 pt-4 pb-4">
        <h2 className="text-xl font-serif font-bold text-zinc-900 dark:text-white">Upcoming Shoots</h2>
        
        <Link href="/admin/projects/aisha-rohan" className="block bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-[1.5rem] p-5 relative cursor-pointer hover:bg-zinc-50 dark:hover:bg-white/10 transition-colors">
          <div className="absolute top-5 right-5 flex items-center gap-1.5 border px-2 py-1 rounded-full text-[10px] font-medium uppercase tracking-wide text-green-600 dark:text-green-400 bg-green-50 dark:bg-zinc-900 border-green-200 dark:border-green-400/20">
            <div className="w-1.5 h-1.5 rounded-full bg-current" /> Active
          </div>
          
          <h4 className="font-bold text-lg text-zinc-900 dark:text-white pr-24">Aisha & Rohan</h4>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Wedding</p>
          
          <div className="space-y-2 mt-4 mb-2">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <CalendarIcon className="w-4 h-4" />
              <span>6 Jun 2026</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <MapPin className="w-4 h-4" />
              <span className="truncate">The Leela Palace, Mumbai</span>
            </div>
          </div>
        </Link>
        
        <Link href="/admin/projects/kavya-aryan" className="block bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-[1.5rem] p-5 relative cursor-pointer hover:bg-zinc-50 dark:hover:bg-white/10 transition-colors">
          <div className="absolute top-5 right-5 flex items-center gap-1.5 border px-2 py-1 rounded-full text-[10px] font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-zinc-900 border-blue-200 dark:border-blue-400/20">
            <div className="w-1.5 h-1.5 rounded-full bg-current" /> Proposal Sent
          </div>
          
          <h4 className="font-bold text-lg text-zinc-900 dark:text-white pr-24">Kavya & Aryan</h4>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Wedding</p>
          
          <div className="space-y-2 mt-4 mb-2">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <CalendarIcon className="w-4 h-4" />
              <span>6 Jul 2026</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <MapPin className="w-4 h-4" />
              <span className="truncate">Taj Mahal Hotel, Delhi</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
