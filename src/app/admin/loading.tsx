import { ParticleBackground } from "@/components/ui/particle-background";

export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black relative overflow-hidden flex flex-col p-4 sm:p-8 space-y-8">
      {/* Background Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <ParticleBackground />
      </div>

      <div className="relative z-10 space-y-2">
        <div className="h-10 w-48 bg-zinc-200 dark:bg-zinc-900 rounded-lg animate-pulse" />
        <div className="h-5 w-64 bg-zinc-200 dark:bg-zinc-900 rounded-md animate-pulse" />
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/5 p-6 rounded-3xl space-y-4">
            <div className="h-12 w-12 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
            <div className="h-6 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-md animate-pulse" />
            <div className="h-8 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded-md animate-pulse" />
          </div>
        ))}
      </div>

      <div className="relative z-10 flex-1 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/5 rounded-3xl p-6">
        <div className="space-y-4">
          <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-md animate-pulse mb-8" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-12 w-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                <div className="h-3 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse opacity-50" />
              </div>
              <div className="h-8 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
