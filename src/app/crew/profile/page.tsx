"use client";
import { User, Phone, Mail, MapPin, Camera, IndianRupee, Briefcase } from "lucide-react";

export default function CrewProfileView() {
  const profile = {
    name: "Arjun Mehta",
    role: "Lead Photographer",
    speciality: "Candid & Portrait",
    phone: "+91 98765 43210",
    email: "arjun@example.com",
    city: "Mumbai, MH",
    totalEarned: "₹3.2L",
    totalShoots: 24,
    joinDate: "Jan 2025"
  };

  const history = [
    { client: "Meera & Dev", type: "Destination Wedding", date: "21 May 2026", fee: "₹15,000", status: "Paid" },
    { client: "Nisha & Karan", type: "Engagement", date: "10 May 2026", fee: "₹8,000", status: "Paid" },
    { client: "Pooja & Vikram", type: "Pre-Wedding", date: "2 May 2026", fee: "₹10,000", status: "Paid" },
    { client: "Ananya & Rahul", type: "Wedding", date: "15 Apr 2026", fee: "₹15,000", status: "Paid" },
    { client: "Sneha & Amit", type: "Sangeet", date: "8 Apr 2026", fee: "₹12,000", status: "Paid" },
  ];

  return (
    <div className="space-y-6">
      {/* Header Profile Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-[2rem] p-6 relative overflow-hidden flex flex-col items-center text-center">
        <div className="absolute top-0 left-0 right-0 h-24 bg-amber-100 dark:bg-amber-900/20" />
        <div className="w-24 h-24 bg-white dark:bg-zinc-900 rounded-full border-4 border-white dark:border-zinc-900 flex items-center justify-center relative z-10 shadow-md text-amber-600 dark:text-amber-500 mb-3">
          <User className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white">{profile.name}</h1>
        <p className="text-sm font-semibold text-amber-600 dark:text-amber-500 uppercase tracking-widest mt-1">{profile.role}</p>
        <p className="text-sm text-zinc-500 mt-1">{profile.speciality}</p>

        <div className="flex flex-wrap justify-center gap-2 mt-6 w-full">
          <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-white/5 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-white/10">
            <Phone className="w-3.5 h-3.5 text-zinc-400" />
            {profile.phone}
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-white/5 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-white/10">
            <Mail className="w-3.5 h-3.5 text-zinc-400" />
            {profile.email}
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-white/5 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-white/10">
            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
            {profile.city}
          </div>
        </div>
      </div>

      {/* Career Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
            <Camera className="w-5 h-5 text-amber-600 dark:text-amber-500" />
          </div>
          <div>
            <h4 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white">{profile.totalShoots}</h4>
            <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Shoots Completed</p>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
            <IndianRupee className="w-5 h-5 text-green-600 dark:text-green-500" />
          </div>
          <div>
            <h4 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white">{profile.totalEarned}</h4>
            <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Total Earnings</p>
          </div>
        </div>
      </div>

      {/* Full History List */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-zinc-400" />
          <h2 className="text-xl font-serif font-bold text-zinc-900 dark:text-white">Shoot History</h2>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl overflow-hidden divide-y divide-zinc-100 dark:divide-white/5">
          {history.map((job, i) => (
            <div key={i} className="p-4 sm:p-5 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
              <div>
                <h4 className="font-bold text-zinc-900 dark:text-white">{job.client}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-zinc-500">{job.type}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <span className="text-xs text-zinc-500">{job.date}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-zinc-900 dark:text-white block">{job.fee}</span>
                <span className="text-[10px] uppercase font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-md mt-1 inline-block">
                  {job.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
