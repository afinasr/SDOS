"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, Users, FileText, Calendar, Settings } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "Projects", href: "/admin/projects", icon: Briefcase },
    { name: "Crew", href: "/admin/crew", icon: Users },
    { name: "Invoices", href: "/admin/invoices", icon: FileText },
    { name: "Calendar", href: "/admin/calendar", icon: Calendar },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/50 dark:bg-black/50 backdrop-blur-2xl border-t border-zinc-200 dark:border-white/10 safe-area-pb transition-colors">
      <div className="flex justify-around items-center h-16 sm:h-20 max-w-screen-2xl mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = tab.href === "/admin" 
            ? pathname === "/admin" 
            : pathname.startsWith(tab.href);
            
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 relative ${
                isActive ? "text-cyan-600 dark:text-cyan-400" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 hover:-translate-y-0.5"
              }`}
            >
              {isActive && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-cyan-100/50 dark:bg-cyan-900/30 rounded-full blur-md -z-10" />
              )}
              <tab.icon className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${isActive ? "stroke-[2.5px] scale-110 mb-0.5" : "stroke-2"}`} />
              <span className={`text-[10px] sm:text-xs tracking-wide font-sans transition-all duration-300 ${
                isActive ? "font-bold text-cyan-700 dark:text-cyan-300" : "font-medium"
              }`}>
                {tab.name}
              </span>
              {isActive && (
                <div className="absolute -bottom-2 w-1 h-1 rounded-full bg-cyan-600 dark:bg-cyan-400" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
