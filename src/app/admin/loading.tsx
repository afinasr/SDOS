import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-10 h-10 animate-spin text-cyan-600 dark:text-cyan-500" />
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 animate-pulse">
        Loading data...
      </p>
    </div>
  );
}
