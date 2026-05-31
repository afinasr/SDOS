"use client";

import { Monitor, Moon, Sun, ToggleLeft, ToggleRight, Save } from "lucide-react";
import { useSettings } from "@/components/providers/settings-provider";
import { ShutterButton } from "@/components/ui/shutter-button";

export default function SettingsView() {
  const { enable3DBackground, setEnable3DBackground, theme, setTheme } = useSettings();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-4xl font-serif font-bold text-zinc-900 dark:text-white">Settings</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">Manage your app preferences and studio configuration.</p>
      </div>

      {/* Preferences Section */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-serif font-bold text-zinc-900 dark:text-white">Appearance</h2>
        
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl p-5 space-y-6 transition-colors">
          
          {/* 3D Background Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="bg-zinc-100 dark:bg-white/10 w-10 h-10 rounded-xl flex items-center justify-center">
                <Monitor className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 dark:text-white">3D Space Background</h4>
                <p className="text-xs text-zinc-500 mt-0.5">Interactive WebGL background (Forces Dark Mode)</p>
              </div>
            </div>
            
            <button 
              onClick={() => setEnable3DBackground(!enable3DBackground)}
              className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors"
            >
              {enable3DBackground ? (
                <ToggleRight className="w-8 h-8" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-zinc-400 dark:text-zinc-600 hover:text-zinc-500" />
              )}
            </button>
          </div>

          <div className="h-px bg-zinc-200 dark:bg-white/5 w-full" />

          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="bg-zinc-100 dark:bg-white/10 w-10 h-10 rounded-xl flex items-center justify-center">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                ) : (
                  <Sun className="w-5 h-5 text-orange-500" />
                )}
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 dark:text-white">Dark Mode</h4>
                <p className="text-xs text-zinc-500 mt-0.5">Toggle digital darkroom theme</p>
              </div>
            </div>
            
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
            >
              {theme === 'dark' ? (
                <ToggleRight className="w-8 h-8" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-zinc-400 dark:text-zinc-600 hover:text-zinc-500" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Studio Info Section */}
      <div className="space-y-4 pt-4 pb-4">
        <h2 className="text-xl font-serif font-bold text-zinc-900 dark:text-white">Studio Profile</h2>
        
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 space-y-4 transition-colors">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Studio Name</label>
            <input type="text" defaultValue="Studio Desk" className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white transition-all font-serif font-bold" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Tagline</label>
            <input type="text" defaultValue="Capturing your best moments" className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white transition-all" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Email</label>
              <input type="email" defaultValue="hello@studiodesk.com" className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Phone</label>
              <input type="tel" defaultValue="+91 9876543210" className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white transition-all" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Address</label>
            <input type="text" defaultValue="123, Creative Block, Bandra West" className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">City / State</label>
              <input type="text" defaultValue="Mumbai, MH" className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">GSTIN</label>
              <input type="text" defaultValue="27AADCB2230M1Z2" className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white transition-all font-mono uppercase" />
            </div>
          </div>
          
          <div className="pt-4">
            <ShutterButton className="w-full bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:text-black font-bold py-4 rounded-xl shadow-lg shadow-cyan-500/20 transition-all border-none" onClick={() => alert("Settings saved!")}>
              <Save className="w-5 h-5 mr-2 inline" />
              Save Settings
            </ShutterButton>
          </div>
        </div>
      </div>

      {/* Account Section */}
      <div className="space-y-4 pt-4 pb-12">
        <h2 className="text-xl font-serif font-bold text-zinc-900 dark:text-white">Account</h2>
        
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 space-y-4 transition-colors">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Sign out of your Studio Desk admin account. You will need to enter your credentials to access the dashboard again.
          </p>
          <form action={async () => {
            const { logout } = await import('@/app/login/actions');
            await logout();
          }}>
            <button 
              type="submit"
              className="w-full h-11 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium border border-red-100 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
