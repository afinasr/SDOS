"use client";

import { useFormStatus } from "react-dom";
import { Aperture } from "lucide-react";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <button 
      disabled={pending}
      className="flex h-11 items-center justify-center rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {pending ? (
        <Aperture className="w-5 h-5 animate-spin text-zinc-500 dark:text-zinc-400" />
      ) : (
        children
      )}
    </button>
  );
}
