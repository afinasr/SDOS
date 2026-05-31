"use client";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin } from "lucide-react";
import { ShutterButton } from "@/components/ui/shutter-button";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { playTickSound, playSwooshSound } from "@/lib/audio";

export default function CalendarClient({ projects }: { projects: any[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Calculate days in month and starting offset
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    playTickSound();
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    playTickSound();
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    setSelectedDate(null);
  };

  // Convert project dates to local day numbers for the current month
  const projectsThisMonth = projects.filter(p => {
    const pDate = new Date(p.event_date);
    return pDate.getMonth() === currentMonth && pDate.getFullYear() === currentYear;
  });

  const getProjectsForDate = (date: number) => {
    return projectsThisMonth.filter(p => new Date(p.event_date).getDate() === date);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-4xl font-serif font-bold text-zinc-900 dark:text-white">Calendar</h1>
        <div className="inline-block mt-3 bg-blue-100 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs px-3 py-1.5 rounded-full font-medium transition-colors">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 inline-block mr-2" />
          {projectsThisMonth.length} shoots this month
        </div>
      </div>

      {/* Calendar Card */}
      <motion.div variants={itemVariants} className="bg-white/80 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-[1.5rem] p-5 transition-colors">
        <div className="flex justify-between items-center mb-6">
          <ShutterButton size="icon" variant="ghost" className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10" onClick={handlePrevMonth}>
            <ChevronLeft className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
          </ShutterButton>
          <h2 className="font-semibold text-lg text-zinc-900 dark:text-white">
            {currentDate.toLocaleString('default', { month: 'long' })} {currentYear}
          </h2>
          <ShutterButton size="icon" variant="ghost" className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10" onClick={handleNextMonth}>
            <ChevronRight className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
          </ShutterButton>
        </div>

        <div className="grid grid-cols-7 gap-y-4 text-center mb-4">
          {days.map((day) => (
            <div key={day} className="text-[10px] font-semibold text-zinc-500">{day}</div>
          ))}
          
          {/* Empty offset */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          
          {/* Dates */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const date = i + 1;
            const dateProjects = getProjectsForDate(date);
            const isBooked = dateProjects.length > 0;
            const isSelected = selectedDate === date;
            
            const isToday = 
              date === new Date().getDate() && 
              currentMonth === new Date().getMonth() && 
              currentYear === new Date().getFullYear();

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
              <div key={date} onClick={() => { playSwooshSound(); setSelectedDate(date); }}>
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
      </motion.div>

      {/* Upcoming Shoots */}
      <motion.div variants={itemVariants} className="space-y-4 pt-4 pb-4">
        <h2 className="text-xl font-serif font-bold text-zinc-900 dark:text-white">
          {selectedDate ? `Shoots on ${selectedDate} ${currentDate.toLocaleString('default', { month: 'short' })}` : 'Upcoming Shoots'}
        </h2>
        
        <AnimatePresence mode="popLayout">
          {projects
            .filter(p => {
              if (selectedDate) {
                const pDate = new Date(p.event_date);
                return pDate.getDate() === selectedDate && pDate.getMonth() === currentMonth && pDate.getFullYear() === currentYear;
              }
              // If no date selected, just show active projects from today onwards
              return new Date(p.event_date) >= new Date();
            })
            .map(p => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Link onClick={playTickSound} href={`/admin/projects/${p.id}`} className="block bg-white/80 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-[1.5rem] p-5 relative cursor-pointer hover:bg-zinc-50 dark:hover:bg-white/10 transition-colors">
                <div className="absolute top-5 right-5 flex items-center gap-1.5 border px-2 py-1 rounded-full text-[10px] font-medium uppercase tracking-wide text-green-600 dark:text-green-400 bg-green-50 dark:bg-zinc-900 border-green-200 dark:border-green-400/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-current" /> {p.status}
                </div>
                
                <h4 className="font-bold text-lg text-zinc-900 dark:text-white pr-24">{p.title}</h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{p.client_name}</p>
                
                <div className="space-y-2 mt-4 mb-2">
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{new Date(p.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  {p.location && (
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{p.location}</span>
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
          
          {projects.length === 0 && (
            <div className="text-center py-10 text-zinc-500 dark:text-zinc-400">
              No shoots found.
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
