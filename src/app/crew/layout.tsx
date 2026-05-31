"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, User, LogOut } from "lucide-react";
import { PageTransition } from "@/components/layout/page-transition";
import { useRouter } from "next/navigation";

export default function CrewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    { name: "My Jobs", href: "/crew", icon: Briefcase },
    { name: "Profile", href: "/crew/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-black font-sans selection:bg-cyan-500/30">
      <main className="max-w-screen-md mx-auto pb-24 sm:pb-32 px-4 sm:px-6 relative min-h-screen pt-12">
        {/* Top actions */}
        <div className="absolute top-4 right-4 z-10">
          <button onClick={() => router.push("/")} className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-full text-zinc-500 hover:text-red-500 transition-colors shadow-sm">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
        <PageTransition>{children}</PageTransition>
      </main>

      {/* Crew Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-200 dark:border-white/10 safe-area-pb transition-colors">
        <div className="flex justify-around items-center h-16 sm:h-20 max-w-screen-md mx-auto px-4">
          {tabs.map((tab) => {
            const isActive = tab.href === "/crew" 
              ? pathname === "/crew" 
              : pathname.startsWith(tab.href);
              
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 relative ${
                  isActive ? "text-amber-600 dark:text-amber-400" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                }`}
              >
                {isActive && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-amber-100/50 dark:bg-amber-900/30 rounded-full blur-md -z-10" />
                )}
                <tab.icon className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${isActive ? "stroke-[2.5px] scale-110 mb-0.5" : "stroke-2"}`} />
                <span className={`text-[10px] sm:text-xs tracking-wide font-sans transition-all duration-300 ${
                  isActive ? "font-bold text-amber-700 dark:text-amber-300" : "font-medium"
                }`}>
                  {tab.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
