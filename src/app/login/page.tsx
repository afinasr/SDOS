import Link from 'next/link'
import { login } from './actions'
import { Aperture } from 'lucide-react'
import { SubmitButton } from '@/components/ui/submit-button'
import Image from 'next/image'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto h-screen relative items-center pt-24 bg-zinc-50 dark:bg-zinc-950">
      
      {/* Brand Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 relative mb-6 shadow-2xl rounded-2xl overflow-hidden ring-1 ring-zinc-900/10 dark:ring-white/10">
          <Image src="/logo.png" alt="Studio Desk Logo" fill className="object-cover" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Welcome back
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
          Sign in to your account to continue
        </p>
      </div>

      <form
        className="animate-in flex-1 flex flex-col w-full justify-center gap-4 text-zinc-800 dark:text-zinc-200"
        action={login}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              className="flex h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2 text-sm ring-offset-white dark:ring-offset-zinc-950 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
              name="email"
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
            </div>
            <input
              className="flex h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2 text-sm ring-offset-white dark:ring-offset-zinc-950 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <SubmitButton>
          Sign In
        </SubmitButton>
        
        {searchParams?.message && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm text-center rounded-xl border border-red-100 dark:border-red-900/50">
            {searchParams.message}
          </div>
        )}
      </form>
    </div>
  )
}
