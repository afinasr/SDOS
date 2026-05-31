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
    <div className="min-h-screen w-full relative flex items-center justify-center p-4">
      {/* Background Images */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/login_bg_mobile.png" 
          alt="Studio background" 
          fill 
          className="object-cover md:hidden" 
          priority
        />
        <Image 
          src="/login_bg_desktop.png" 
          alt="Studio background" 
          fill 
          className="object-cover hidden md:block" 
          priority
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      </div>

      {/* Glassmorphism Login Card */}
      <div className="z-10 flex flex-col w-full sm:max-w-md justify-center gap-2 mx-auto relative items-center py-10 px-8 bg-zinc-950/40 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 relative mb-4 shadow-2xl rounded-full overflow-hidden ring-4 ring-white/10 bg-white flex items-center justify-center">
            <Aperture className="w-16 h-16 text-black fill-black" strokeWidth={1} />
          </div>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-white drop-shadow-md">
            Studio Desk
          </h1>
          <p className="text-sm text-zinc-300 mt-1 font-medium drop-shadow-sm">
            Sign in to your workspace
          </p>
        </div>

        <form
          className="animate-in w-full flex flex-col justify-center gap-4 text-white"
          action={login}
        >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300 ml-1" htmlFor="email">
                Email
              </label>
              <input
                className="flex h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors backdrop-blur-md"
                name="email"
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-medium text-zinc-300" htmlFor="password">
                  Password
                </label>
              </div>
              <input
                className="flex h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors backdrop-blur-md"
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
            <div className="mt-2 p-4 bg-red-500/20 text-red-200 text-sm text-center rounded-xl border border-red-500/30 backdrop-blur-md">
              {searchParams.message}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
