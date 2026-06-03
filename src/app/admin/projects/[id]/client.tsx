"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, Trash2, Calendar, MapPin, Briefcase, 
  IndianRupee, Link as LinkIcon, Plus, X, User, CheckCircle2, Image as ImageIcon, Save, Copy, Send
} from "lucide-react";
import { ShutterButton } from "@/components/ui/shutter-button";
import { ParticleBackground } from "@/components/ui/particle-background";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  updateProjectStatus, updateProjectNotesAndDrive, addLineItem, deleteLineItem, 
  toggleCrewAssignment, addMilestone, toggleMilestoneStatus, generateMagicLink 
} from "../actions";
import { playTickSound, playSwooshSound } from "@/lib/audio";
import { createClient } from "@/utils/supabase/client";

const STATUS_STEPS = [
  "Lead", "Proposal Sent", "Active", "Post-Production", 
  "Awaiting Selection", "Editing", "Completed"
];

const TABS = ["Overview", "Proposal", "Financials", "Crew", "Milestones", "Timeline", "Deliverables"];

export default function ProjectDetailsClient({ 
  initialProject, initialLineItems, initialCrew, initialMilestones, initialExpenses, isMock 
}: { 
  initialProject: any, initialLineItems: any[], initialCrew: any[], initialMilestones: any[], initialExpenses: any[], isMock: boolean 
}) {
  const router = useRouter();
  
  const displayTitle = initialProject.client_name || initialProject.title || "Unknown Project";

  const initialStep = STATUS_STEPS.indexOf(initialProject.status);
  const [activeStep, setActiveStep] = useState(initialStep >= 0 ? initialStep : 0);
  const [activeTab, setActiveTab] = useState("Overview");

  // States initialized from props
  const [notes, setNotes] = useState(initialProject.notes || "");
  const [driveLink, setDriveLink] = useState(initialProject.drive_link || "");

  const [lineItems, setLineItems] = useState(initialLineItems || []);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState({ desc: "", price: "" });

  const [showPortal, setShowPortal] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);

  const [crew, setCrew] = useState(initialCrew || []);
  const [milestones, setMilestones] = useState(initialMilestones || []);
  const [expenses, setExpenses] = useState(initialExpenses || []);
  
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [newMilestone, setNewMilestone] = useState({ label: "", amount: "" });

  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({ category: "", amount: "", description: "" });
  
  const [paymentScheduleStr, setPaymentScheduleStr] = useState((initialProject.payment_schedule || [100]).join(', '));

  const [magicLink, setMagicLink] = useState(initialProject.magic_link_token || "");
  
  const [deliverablesLinks, setDeliverablesLinks] = useState<any[]>(initialProject.deliverables || []);
  
  // Dialog State
  const [pendingStatusIndex, setPendingStatusIndex] = useState<number | null>(null);

  // Wedding Specific Details
  const [weddingDetails, setWeddingDetails] = useState<any>(initialProject.wedding_details || {
    planner: "",
    coordinator: "",
    coupleInsta: "",
    pixiesetLink: "",
    downloadPin: "",
    deliverables: {
      sneakPeeks: false,
      highlights: false,
      gallery: false,
      album: false
    }
  });

  const handleSaveWeddingDetails = async () => {
    if (isMock) {
      toast.success("Wedding details saved (mock)");
      return;
    }
    try {
      const { updateWeddingDetails } = await import('../actions');
      await updateWeddingDetails(initialProject.id, weddingDetails);
      toast.success("Wedding details saved successfully");
    } catch (e: any) {
      toast.error(e.message || "Failed to save details");
    }
  };

  const [isPending, startTransition] = useTransition();

  // Handlers
  const handleStatusChange = async () => {
    if (pendingStatusIndex === null) return;
    const newStatus = STATUS_STEPS[pendingStatusIndex];
    if (!isMock) {
      toast.promise(updateProjectStatus(initialProject.id, newStatus), {
        loading: 'Updating status...',
        success: 'Status updated!',
        error: 'Failed to update status'
      });
    }
    setActiveStep(pendingStatusIndex);
    setPendingStatusIndex(null);
  };

  const handleSendProposal = async () => {
    const parsedSchedule = paymentScheduleStr.split(',').map((s: string) => parseInt(s.trim())).filter((n: number) => !isNaN(n));
    const totalPercentage = parsedSchedule.reduce((a: number, b: number) => a + b, 0);
    if (totalPercentage !== 100) {
      toast.error("Payment schedule percentages must add up to 100.");
      return;
    }

    if (!isMock) {
      toast.promise(updateProjectStatus(initialProject.id, "Proposal Sent"), {
        loading: 'Updating status...',
        success: 'Proposal sent!',
        error: 'Failed to send proposal'
      });
      const { updatePaymentSchedule } = await import('../actions');
      await updatePaymentSchedule(initialProject.id, parsedSchedule);
    }
    setActiveStep(1); // "Proposal Sent" is index 1

    const portalUrl = `${window.location.origin}/portal/${initialProject.id}`;
    const message = encodeURIComponent(`Hi ${displayTitle},\n\nWe have prepared a customized proposal for your event. You can review the details and accept the proposal directly via your Client Portal here:\n\n${portalUrl}\n\nLet us know if you have any questions!\n\nBest,\nAlice Studio`);
    const waUrl = `https://wa.me/?text=${message}`;
    // Comment out opening WhatsApp for submit action based on feedback
    // window.open(waUrl, '_blank');
  };

  const handleSaveOverview = () => {
    if (isMock) return toast.success("Saved locally (mock mode)");
    toast.promise(updateProjectNotesAndDrive(initialProject.id, notes, driveLink), {
      loading: 'Saving...',
      success: 'Project details saved!',
      error: 'Failed to save details'
    });
  };

  const toggleMilestone = async (idx: number) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(50);
    const ms = milestones[idx];
    const newStatus = ms.status === "Paid" ? "Pending" : "Paid";
    
    // Optimistic update
    const updated = [...milestones];
    updated[idx].status = newStatus;
    setMilestones(updated);
    
    if (!isMock) {
      await toggleMilestoneStatus(ms.id, initialProject.id, ms.status);
    }
  };

  const toggleCrew = async (idx: number) => {
    const member = crew[idx];
    const newAssigned = !member.assigned;
    
    // Optimistic update
    const updated = [...crew];
    updated[idx].assigned = newAssigned;
    setCrew(updated);
    
    if (!isMock) {
      await toggleCrewAssignment(initialProject.id, member.id, newAssigned, member.role, member.fee);
    }
  };
  
  const handleGenerateMagicLink = async () => {
    if (isMock) {
      const link = "mock-token-123";
      setMagicLink(link);
      navigator.clipboard.writeText(`${window.location.origin}/portal/${link}`);
      toast.success("Magic link copied to clipboard!");
      return;
    }
    
    try {
      playSwooshSound();
      const token = await generateMagicLink(initialProject.id);
      setMagicLink(token);
      navigator.clipboard.writeText(`${window.location.origin}/portal/${token}`);
      toast.success("Magic link generated & copied to clipboard!");
    } catch (e) {
      toast.error("Failed to generate magic link");
    }
  };

  const handleDeleteLineItem = async (itemId: string | number) => {
    setLineItems(lineItems.filter((l: any) => l.id !== itemId));
    if (!isMock && typeof itemId === 'string') {
      await deleteLineItem(itemId, initialProject.id);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.category || !newExpense.amount) return;
    
    startTransition(async () => {
      try {
        playTickSound();
        if (!isMock) {
          const { addExpense } = await import('../actions');
          await addExpense(initialProject.id, newExpense.category, Number(newExpense.amount), newExpense.description, new Date().toISOString().split('T')[0]);
        }
        setShowAddExpense(false);
        setNewExpense({ category: "", amount: "", description: "" });
        playSwooshSound();
        // Optimistic update not fully implemented here as we'd need the real ID, so we rely on revalidatePath
        // For mock, just push
        if (isMock) {
           setExpenses([...expenses, { id: Date.now().toString(), ...newExpense, amount: Number(newExpense.amount), date: new Date().toISOString().split('T')[0] }]);
        }
      } catch (err: any) {
        toast.error(err.message);
      }
    });
  };

  const handleDeleteExpense = async (expenseId: string) => {
    startTransition(async () => {
      try {
        const { deleteExpense } = await import('../actions');
        await deleteExpense(expenseId, initialProject.id);
        setExpenses(expenses.filter((e: any) => e.id !== expenseId));
        toast.success("Expense deleted");
      } catch (err: any) {
        toast.error("Failed to delete expense");
      }
    });
  };

  const handleAddDeliverableLink = () => {
    const newLinks = [...deliverablesLinks, { title: "", url: "" }];
    setDeliverablesLinks(newLinks);
  };

  const handleUpdateDeliverableLink = (index: number, field: string, value: string) => {
    const newLinks = [...deliverablesLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setDeliverablesLinks(newLinks);
  };

  const handleSaveDeliverableLinks = async () => {
    startTransition(async () => {
      try {
        const { updateDeliverablesLinks } = await import('../actions');
        await updateDeliverablesLinks(initialProject.id, deliverablesLinks);
        toast.success("Links saved successfully");
      } catch (e) {
        toast.error("Failed to save links");
      }
    });
  };

  const totalProposal = lineItems.reduce((acc, curr) => acc + curr.price, 0);
  const totalCrewCost = crew.filter(c => c.assigned).reduce((acc, curr) => acc + curr.fee, 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const netProfit = totalProposal - totalCrewCost - totalExpenses;

  return (
    <motion.div 
      initial={{ x: "100%", opacity: 0.5 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 bg-zinc-50 dark:bg-zinc-950 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/50 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-3">
          <ShutterButton size="icon" variant="ghost" onClick={() => router.back()} className="rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 w-10 h-10 shrink-0">
            <ChevronLeft className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
          </ShutterButton>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-sans font-bold text-zinc-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">{displayTitle}</h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400">
                {STATUS_STEPS[activeStep]}
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-medium sm:hidden">{STATUS_STEPS[activeStep]}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {magicLink && (
            <a 
              href={`/portal/${magicLink}`} 
              target="_blank" 
              className="hidden sm:flex px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 rounded-lg transition-colors border border-cyan-500/20 items-center gap-2 text-xs font-bold uppercase tracking-wider"
            >
              View Portal
            </a>
          )}
          <button className="p-2 text-zinc-400 hover:text-red-500 transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto pb-24">
          
          {/* Status Dropdown */}
          <div className="px-4 sm:px-6 py-6 border-b border-zinc-200 dark:border-white/10">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">Project Status</h3>
            <select 
              value={STATUS_STEPS[activeStep]} 
              onChange={(e) => {
                const idx = STATUS_STEPS.indexOf(e.target.value);
                if (idx !== activeStep) {
                  setPendingStatusIndex(idx);
                }
              }}
              className="w-full sm:max-w-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none shadow-sm cursor-pointer"
            >
              {STATUS_STEPS.map((step) => (
                <option key={step} value={step}>{step}</option>
              ))}
            </select>

            <Dialog open={pendingStatusIndex !== null} onOpenChange={(open) => !open && setPendingStatusIndex(null)}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Change Project Status</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to move this project to <span className="font-bold text-zinc-900 dark:text-white">{pendingStatusIndex !== null ? STATUS_STEPS[pendingStatusIndex] : ""}</span>? This may trigger notifications to the client or crew.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                  <ShutterButton variant="outline" onClick={() => setPendingStatusIndex(null)}>Cancel</ShutterButton>
                  <ShutterButton className="bg-cyan-600 hover:bg-cyan-700 text-white" onClick={handleStatusChange}>
                    Confirm Status Change
                  </ShutterButton>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* ADD EXPENSE DIALOG */}
          <Dialog open={showAddExpense} onOpenChange={setShowAddExpense}>
            <DialogContent className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-white/10 rounded-3xl p-6 sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif text-zinc-900 dark:text-white">Log Expense</DialogTitle>
                <DialogDescription className="text-zinc-500">Record a new cost for this project.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddExpense} className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Category</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Travel, Equipment Rental, Hard Drive"
                    className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Amount (₹)</label>
                  <input
                    required
                    type="number"
                    placeholder="0.00"
                    className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Description (Optional)</label>
                  <input
                    type="text"
                    placeholder="Any additional details"
                    className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  />
                </div>
                <DialogFooter className="mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddExpense(false)}
                    className="px-6 py-3 rounded-xl font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                  >
                    Save Expense
                  </button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Section Tabs */}
          <div className="px-4 sm:px-6 py-2 border-b border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/20 sticky top-0 z-10 backdrop-blur-md">
            <div className="flex overflow-x-auto gap-6 no-scrollbar">
              {TABS.filter(tab => tab !== "Crew" || activeStep >= 2).map(tab => (
                <button
                  key={tab}
                  onClick={() => { playTickSound(); setActiveTab(tab); }}
                  className={`py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab 
                      ? "border-cyan-600 text-cyan-600 dark:border-cyan-400 dark:text-cyan-400" 
                      : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            
            {/* OVERVIEW TAB */}
            {activeTab === "Overview" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl p-5 sm:p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Date</p>
                      <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-medium text-sm">
                        <Calendar className="w-4 h-4 text-cyan-600 dark:text-cyan-500" />
                        6 Jun 2026
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Location</p>
                      <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-medium text-sm">
                        <MapPin className="w-4 h-4 text-cyan-600 dark:text-cyan-500" />
                        <span className="truncate">The Leela, Mumbai</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Type</p>
                      <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-medium text-sm">
                        <Briefcase className="w-4 h-4 text-cyan-600 dark:text-cyan-500" />
                        Wedding
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Revenue</p>
                      <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-medium text-sm">
                        <IndianRupee className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                        {totalProposal.toLocaleString()}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Net Profit</p>
                      <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-medium text-sm">
                        <IndianRupee className="w-4 h-4 text-green-600 dark:text-green-500" />
                        {netProfit.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Drive Link</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input 
                      type="url"
                      placeholder="Paste Google Drive link..."
                      value={driveLink}
                      onChange={(e) => setDriveLink(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-600 dark:focus:ring-cyan-500 transition-shadow"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Notes & Requirements</label>
                  <textarea 
                    placeholder="Add project specific notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-600 dark:focus:ring-cyan-500 transition-shadow resize-none"
                  />
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 sm:p-6 rounded-2xl border border-zinc-200 dark:border-white/5 space-y-4">
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-600" /> Vendor Contacts
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Wedding Planner</label>
                      <input 
                        type="text"
                        placeholder="Name & Phone..."
                        value={weddingDetails.planner}
                        onChange={(e) => setWeddingDetails({ ...weddingDetails, planner: e.target.value })}
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-600 dark:focus:ring-cyan-500 transition-shadow"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Venue Coordinator</label>
                      <input 
                        type="text"
                        placeholder="Name & Phone..."
                        value={weddingDetails.coordinator}
                        onChange={(e) => setWeddingDetails({ ...weddingDetails, coordinator: e.target.value })}
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-600 dark:focus:ring-cyan-500 transition-shadow"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Couple's Instagram Handles</label>
                      <input 
                        type="text"
                        placeholder="@bride @groom"
                        value={weddingDetails.coupleInsta}
                        onChange={(e) => setWeddingDetails({ ...weddingDetails, coupleInsta: e.target.value })}
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-600 dark:focus:ring-cyan-500 transition-shadow"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <ShutterButton onClick={() => { handleSaveOverview(); handleSaveWeddingDetails(); }} className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-4 rounded-2xl">
                    <Save className="w-4 h-4 mr-2" />
                    Save Details
                  </ShutterButton>
                  <ShutterButton onClick={handleGenerateMagicLink} variant="outline" className="flex-1 border-cyan-600 text-cyan-600 hover:bg-cyan-50 font-bold py-4 rounded-2xl">
                    <Copy className="w-4 h-4 mr-2" />
                    {magicLink ? "Copy Magic Link" : "Generate Magic Link"}
                  </ShutterButton>
                </div>
                
                <button onClick={() => setShowPortal(true)} className="w-full bg-amber-500 hover:bg-amber-600 text-white dark:bg-amber-400 dark:hover:bg-amber-500 dark:text-zinc-900 font-bold py-4 rounded-2xl shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98]">
                  Open Client Portal (Preview)
                </button>
              </div>
            )}

            {/* PROPOSAL TAB */}
            {activeTab === "Proposal" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl overflow-hidden divide-y divide-zinc-100 dark:divide-white/5">
                  {lineItems.map((item) => (
                    <div key={item.id} className="p-4 sm:p-5 flex items-center justify-between group">
                      <span className="font-medium text-zinc-900 dark:text-white text-sm sm:text-base">{item.desc}</span>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300">₹{item.price.toLocaleString()}</span>
                        <button 
                          onClick={() => handleDeleteLineItem(item.id)}
                          className="text-zinc-300 hover:text-red-500 dark:text-zinc-600 dark:hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {lineItems.length === 0 && (
                    <div className="p-8 text-center text-zinc-500 text-sm">No items added yet.</div>
                  )}
                </div>

                <div className="flex justify-between items-center px-4">
                  <span className="text-zinc-500 font-semibold uppercase tracking-wider text-sm">Total Value</span>
                  <span className="text-2xl font-serif font-bold text-amber-500 dark:text-amber-400">₹{totalProposal.toLocaleString()}</span>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200 dark:border-white/10 space-y-4">
                   <div>
                     <h4 className="font-bold text-zinc-900 dark:text-white mb-1">Payment Schedule (Split %)</h4>
                     <p className="text-xs text-zinc-500 mb-3">Define the invoice milestones. Must add up to 100.</p>
                     <input 
                        type="text" 
                        value={paymentScheduleStr}
                        onChange={(e) => setPaymentScheduleStr(e.target.value)}
                        placeholder="e.g., 30, 50, 20"
                        className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-shadow"
                     />
                   </div>
                   {paymentScheduleStr.split(',').reduce((a: number, b: string) => a + (parseInt(b.trim()) || 0), 0) !== 100 && (
                     <p className="text-xs text-red-500 font-bold mt-1">Total is not 100%.</p>
                   )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={() => setShowAddItem(true)}
                    className="w-full border-2 border-dashed border-zinc-300 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5 font-semibold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Line Item
                  </button>

                  <ShutterButton 
                    onClick={handleSendProposal}
                    disabled={lineItems.length === 0}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Submit
                  </ShutterButton>
                </div>
              </div>
            )}

            {/* FINANCIALS TAB */}
            {activeTab === "Financials" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-5 rounded-3xl">
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Gross Revenue</p>
                    <p className="text-2xl font-serif font-bold text-amber-500 mt-1">₹{totalProposal.toLocaleString()}</p>
                  </div>
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-5 rounded-3xl">
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Total Costs</p>
                    <p className="text-2xl font-serif font-bold text-red-500 mt-1">₹{(totalCrewCost + totalExpenses).toLocaleString()}</p>
                    <p className="text-[10px] text-zinc-400 mt-1">Crew: ₹{totalCrewCost} | Exp: ₹{totalExpenses}</p>
                  </div>
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-5 rounded-3xl">
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Net Profit</p>
                    <p className="text-2xl font-serif font-bold text-green-600 mt-1">₹{netProfit.toLocaleString()}</p>
                    <p className="text-[10px] text-zinc-400 mt-1">Margin: {totalProposal ? Math.round((netProfit/totalProposal)*100) : 0}%</p>
                  </div>
                </div>

                <div className="flex justify-between items-end">
                   <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Logged Expenses</h3>
                   <button 
                     onClick={() => setShowAddExpense(true)}
                     className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
                   >
                     <Plus className="w-4 h-4" /> Add Expense
                   </button>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl overflow-hidden divide-y divide-zinc-100 dark:divide-white/5">
                  {expenses.map((exp: any) => (
                    <div key={exp.id} className="p-4 sm:p-5 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-white">{exp.category}</p>
                        <p className="text-xs text-zinc-500">{exp.description || "No description"}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-red-500">-₹{Number(exp.amount).toLocaleString()}</span>
                        <button onClick={() => handleDeleteExpense(exp.id)} className="text-zinc-300 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {expenses.length === 0 && (
                    <div className="p-8 text-center text-zinc-500 text-sm">No expenses logged yet.</div>
                  )}
                </div>
              </div>
            )}

            {/* CREW TAB */}
            {activeTab === "Crew" && activeStep >= 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {crew.map((member, idx) => (
                  <div 
                    key={member.id} 
                    className={`flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all ${
                      member.assigned 
                        ? "bg-cyan-50 border-cyan-200 dark:bg-cyan-950/30 dark:border-cyan-900/50" 
                        : "bg-white border-zinc-200 dark:bg-zinc-900 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/5"
                    }`}
                  >
                    <div 
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => toggleCrew(idx)}
                    >
                      <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                        member.assigned ? "bg-cyan-600 border-cyan-600 text-white" : "border-zinc-300 dark:border-zinc-600"
                      }`}>
                        {member.assigned && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                        <User className="w-5 h-5 text-zinc-400" />
                      </div>
                      <div>
                        <p className={`font-bold ${member.assigned ? "text-cyan-900 dark:text-cyan-100" : "text-zinc-900 dark:text-white"}`}>{member.name}</p>
                        <p className={`text-xs ${member.assigned ? "text-cyan-700 dark:text-cyan-400" : "text-zinc-500"}`}>{member.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`font-semibold text-sm ${member.assigned ? "text-cyan-800 dark:text-cyan-300" : "text-zinc-500"}`}>
                        ₹{member.fee.toLocaleString()}
                      </span>
                      {member.assigned && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            const msg = encodeURIComponent(`Hi ${member.name}, you have been assigned to ${displayTitle} on ${new Date(initialProject.event_date).toLocaleDateString()}. View details in your crew portal: ${window.location.origin}/crew/${member.id}`);
                            window.open(`https://wa.me/?text=${msg}`, '_blank');
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          Notify
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* MILESTONES TAB */}
            {activeTab === "Milestones" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {milestones.map((ms, idx) => (
                  <div 
                    key={ms.id} 
                    onClick={() => toggleMilestone(idx)}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:border-cyan-300 dark:hover:border-cyan-700 transition-colors"
                  >
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-white">{ms.label}</p>
                      <p className="text-amber-500 dark:text-amber-400 font-serif font-bold text-lg mt-0.5">₹{ms.amount.toLocaleString()}</p>
                    </div>
                    <div className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                      ms.status === "Paid" 
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-zinc-100 text-zinc-600 dark:bg-white/10 dark:text-zinc-400"
                    }`}>
                      {ms.status}
                    </div>
                  </div>
                ))}

                <button 
                  onClick={() => setShowAddMilestone(true)}
                  className="w-full border-2 border-dashed border-zinc-300 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5 font-semibold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2 mt-6"
                >
                  <Plus className="w-5 h-5" />
                  Add Milestone
                </button>
              </div>
            )}

            {/* TIMELINE TAB */}
            {activeTab === "Timeline" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl p-5 sm:p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Run of Show & Shot List</h3>
                    <ShutterButton variant="outline" className="text-xs py-2 px-3 border-cyan-600 text-cyan-600">
                      Load Standard Wedding Template
                    </ShutterButton>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 rounded-xl flex items-start gap-4">
                      <div className="bg-white dark:bg-zinc-900 w-16 text-center py-1 rounded text-xs font-bold text-zinc-500 border border-zinc-200 dark:border-white/10 shrink-0">
                        14:00
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Getting Ready (Bride)</h4>
                        <p className="text-xs text-zinc-500">Location: Presidential Suite. Focus on details (dress, rings).</p>
                      </div>
                    </div>

                    <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 rounded-xl flex items-start gap-4">
                      <div className="bg-white dark:bg-zinc-900 w-16 text-center py-1 rounded text-xs font-bold text-zinc-500 border border-zinc-200 dark:border-white/10 shrink-0">
                        16:00
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-white">First Look & Couple Portraits</h4>
                        <p className="text-xs text-zinc-500">Location: Garden Area. Need drone operator ready.</p>
                      </div>
                    </div>
                  </div>
                  
                  <button className="w-full border-2 border-dashed border-zinc-300 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5 font-semibold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add Event
                  </button>
                </div>
              </div>
            )}

            {/* DELIVERABLES TAB */}
            {activeTab === "Deliverables" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl p-5 sm:p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white">External Deliverables</h3>
                    <button onClick={handleAddDeliverableLink} className="text-sm font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1">
                      <Plus className="w-4 h-4" /> Add Link
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {deliverablesLinks.map((link, idx) => (
                      <div key={idx} className="flex gap-4 items-start">
                        <div className="flex-1 space-y-2">
                          <input 
                            type="text" placeholder="Title (e.g. Wedding Film)"
                            value={link.title} onChange={e => handleUpdateDeliverableLink(idx, 'title', e.target.value)}
                            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white"
                          />
                        </div>
                        <div className="flex-[2] space-y-2">
                          <div className="relative">
                            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input 
                              type="url" placeholder="URL (e.g. YouTube, Drive)"
                              value={link.url} onChange={e => handleUpdateDeliverableLink(idx, 'url', e.target.value)}
                              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-900 dark:text-white"
                            />
                          </div>
                        </div>
                        <button 
                          onClick={() => setDeliverablesLinks(deliverablesLinks.filter((_, i) => i !== idx))}
                          className="p-3 text-zinc-400 hover:text-red-500"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    {deliverablesLinks.length === 0 && (
                      <div className="text-center p-6 text-zinc-500 text-sm border-2 border-dashed border-zinc-200 dark:border-white/10 rounded-xl">
                        No links added yet. Add YouTube, Vimeo, or Google Drive links here.
                      </div>
                    )}
                  </div>

                  <ShutterButton onClick={handleSaveDeliverableLinks} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-4 rounded-2xl" loading={isPending}>
                    <Save className="w-4 h-4 mr-2" />
                    Save External Links
                  </ShutterButton>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Slide-up Modals via Framer Motion */}
      <AnimatePresence>
        {showAddItem && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddItem(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 rounded-t-3xl p-6 z-50 border-t border-zinc-200 dark:border-white/10"
            >
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Add Line Item</h3>
              <div className="space-y-4 mb-6">
                <input 
                  type="text" placeholder="Description" 
                  value={newItem.desc} onChange={e => setNewItem({...newItem, desc: e.target.value})}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white"
                />
                <input 
                  type="number" placeholder="Price (₹)" 
                  value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white"
                />
              </div>
              <button 
                onClick={async () => {
                  if (newItem.desc && newItem.price) {
                    if (isMock) {
                      setLineItems([...lineItems, { id: Date.now(), desc: newItem.desc, price: Number(newItem.price) }]);
                    } else {
                      await addLineItem(initialProject.id, newItem.desc, Number(newItem.price));
                      setLineItems([...lineItems, { id: Date.now(), desc: newItem.desc, price: Number(newItem.price) }]);
                    }
                    setNewItem({ desc: "", price: "" });
                    setShowAddItem(false);
                  }
                }}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-cyan-500 dark:text-black py-4 rounded-xl font-bold"
              >
                Save Item
              </button>
            </motion.div>
          </>
        )}

        {showAddMilestone && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddMilestone(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 rounded-t-3xl p-6 z-50 border-t border-zinc-200 dark:border-white/10"
            >
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Add Milestone</h3>
              <div className="space-y-4 mb-6">
                <input 
                  type="text" placeholder="Milestone Label (e.g. Booking Advance)" 
                  value={newMilestone.label} onChange={e => setNewMilestone({...newMilestone, label: e.target.value})}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white"
                />
                <input 
                  type="number" placeholder="Amount (₹)" 
                  value={newMilestone.amount} onChange={e => setNewMilestone({...newMilestone, amount: e.target.value})}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white"
                />
              </div>
              <button 
                onClick={async () => {
                  if (newMilestone.label && newMilestone.amount) {
                    if (isMock) {
                      setMilestones([...milestones, { id: Date.now(), label: newMilestone.label, amount: Number(newMilestone.amount), status: "Pending" }]);
                    } else {
                      await addMilestone(initialProject.id, newMilestone.label, Number(newMilestone.amount));
                      setMilestones([...milestones, { id: Date.now(), label: newMilestone.label, amount: Number(newMilestone.amount), status: "Pending" }]);
                    }
                    setNewMilestone({ label: "", amount: "" });
                    setShowAddMilestone(false);
                  }
                }}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-cyan-500 dark:text-black py-4 rounded-xl font-bold"
              >
                Save Milestone
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CLIENT PORTAL SIMULATION MODAL */}
      <AnimatePresence>
        {showPortal && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-[#FAF9F6] dark:bg-black flex flex-col font-sans overflow-hidden"
          >
            <ParticleBackground />
            
            {/* Premium Portal Header */}
            <div className="flex items-center justify-between px-6 sm:px-12 py-6 border-b border-zinc-200/50 dark:border-white/5 bg-white/70 dark:bg-black/70 backdrop-blur-2xl shrink-0 sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center shadow-lg shadow-black/10 dark:shadow-white/10">
                  <span className="text-white dark:text-black font-serif font-bold text-lg leading-none tracking-widest">AS</span>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900 dark:text-white tracking-wide">Alice Studio</h2>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 font-semibold mt-0.5">Capturing your best moments</p>
                </div>
              </div>
              <button onClick={() => setShowPortal(false)} className="px-5 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-full text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm">
                Close Preview
              </button>
            </div>

            <div className="flex-1 overflow-y-auto relative z-10">
              <div className="max-w-3xl mx-auto p-6 sm:p-12 space-y-12 pb-32">
                
                {/* Greeting & Context */}
                <div className="text-center space-y-4 mt-8">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-500">Client Portal</p>
                  <h1 className="text-4xl sm:text-5xl font-serif font-bold text-zinc-900 dark:text-white tracking-tight">Welcome, {displayTitle}</h1>
                  <p className="text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
                    {activeStep === 0 && "We are thrilled to connect with you. Our journey to capture your beautiful moments begins here."}
                    {activeStep === 1 && "Your customized proposal is ready for review. Every detail has been tailored to your unique story."}
                    {activeStep === 2 && "Your project is now active! We are meticulously preparing to ensure your big day is captured perfectly."}
                    {activeStep === 3 && "Your event was wonderful. We are currently safely backing up and organizing the precious memories."}
                    {activeStep === 4 && "Your photos are ready for selection. Please take your time to pick your absolute favorites."}
                    {activeStep === 5 && "We are carefully color-grading and editing your selected photos to cinematic perfection."}
                    {activeStep === 6 && "Your project is complete. It has been an absolute honor to capture your story."}
                  </p>
                </div>

                {/* Elegant Progress Bar & Tracker */}
                <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-3xl p-8 border border-zinc-200/50 dark:border-white/5 shadow-xl shadow-zinc-200/20 dark:shadow-black/50">
                  <div className="flex justify-between items-center mb-8 relative px-2">
                    <div className="absolute left-2 right-2 top-1/2 -translate-y-1/2 h-0.5 bg-zinc-200 dark:bg-zinc-800 -z-10" />
                    <div 
                      className="absolute left-2 top-1/2 -translate-y-1/2 h-0.5 bg-amber-500 dark:bg-amber-400 -z-10 transition-all duration-700 ease-out" 
                      style={{ width: `calc(${(activeStep / (STATUS_STEPS.length - 1)) * 100}% - 16px)` }}
                    />
                    {STATUS_STEPS.map((step, idx) => (
                      <div key={idx} className={`w-4 h-4 rounded-full border-4 transition-all duration-700 shadow-sm ${
                        idx <= activeStep ? "bg-amber-500 border-white dark:bg-amber-400 dark:border-zinc-900 scale-110" : "bg-zinc-200 border-white dark:bg-zinc-800 dark:border-zinc-900"
                      }`} />
                    ))}
                  </div>
                  <div className="text-center">
                    <h3 className="font-serif font-bold text-zinc-900 dark:text-white text-xl">{STATUS_STEPS[activeStep]}</h3>
                    <p className="text-xs uppercase tracking-[0.15em] text-zinc-500 mt-2">Current Stage</p>
                  </div>
                </div>

                {/* Package Summary & Milestones (Side by Side) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-3xl p-8 border border-zinc-200/50 dark:border-white/5 shadow-xl shadow-zinc-200/20 dark:shadow-black/50 space-y-6">
                    <div>
                      <h3 className="font-serif font-bold text-2xl text-zinc-900 dark:text-white">Investment</h3>
                      <p className="text-xs uppercase tracking-wider text-zinc-500 mt-1">Package Details</p>
                    </div>
                    <div className="space-y-4">
                      {lineItems.map(item => (
                        <div key={item.id} className="flex justify-between text-sm sm:text-base border-b border-zinc-100 dark:border-white/5 pb-4 last:border-0 last:pb-0">
                          <span className="text-zinc-600 dark:text-zinc-400 font-medium pr-4">{item.desc}</span>
                          <span className="font-serif font-semibold text-zinc-900 dark:text-white shrink-0">₹{item.price.toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="pt-4 border-t-2 border-zinc-900 dark:border-white/20 flex justify-between items-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">Total Value</span>
                        <span className="text-2xl font-serif font-bold text-amber-600 dark:text-amber-400">₹{totalProposal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-3xl p-8 border border-zinc-200/50 dark:border-white/5 shadow-xl shadow-zinc-200/20 dark:shadow-black/50 space-y-6">
                    <div>
                      <h3 className="font-serif font-bold text-2xl text-zinc-900 dark:text-white">Payments</h3>
                      <p className="text-xs uppercase tracking-wider text-zinc-500 mt-1">Milestone Tracker</p>
                    </div>
                    <div className="space-y-4">
                      {milestones.map((ms, i) => (
                        <div key={ms.id} className="flex justify-between items-center group relative border-b border-zinc-100 dark:border-white/5 pb-4 last:border-0 last:pb-0">
                          <div>
                            <p className="font-medium text-zinc-900 dark:text-white text-sm sm:text-base">{ms.label}</p>
                            <p className="text-xs text-zinc-500 font-serif mt-0.5">₹{ms.amount.toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md transition-colors ${
                              ms.status === "Paid" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-zinc-100 text-zinc-500 dark:bg-white/5 dark:text-zinc-400"
                            }`}>
                              {ms.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Photo Selection Grid (If Awaiting Selection) */}
                {STATUS_STEPS[activeStep] === "Awaiting Selection" && (
                  <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-3xl p-8 border-2 border-amber-200/50 dark:border-amber-900/30 shadow-2xl shadow-amber-500/10 dark:shadow-amber-900/20 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="font-serif font-bold text-2xl text-zinc-900 dark:text-white">Curate Your Story</h3>
                        <p className="text-sm text-zinc-500 mt-1">Tap the heart to select a photo for final cinematic edits.</p>
                      </div>
                      <div className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 border border-amber-200 dark:border-amber-500/30 shadow-sm">
                        {selectedPhotos.length} Selected
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                      {[1,2,3,4,5,6,7,8,9,10,11,12].map(id => {
                        const isSelected = selectedPhotos.includes(id);
                        return (
                          <div 
                            key={id} 
                            onClick={() => {
                              if (isSelected) setSelectedPhotos(prev => prev.filter(p => p !== id));
                              else setSelectedPhotos(prev => [...prev, id]);
                            }}
                            className={`aspect-square rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                              isSelected ? "ring-4 ring-amber-500 ring-offset-2 ring-offset-[#FAF9F6] dark:ring-offset-black scale-95" : "bg-zinc-100 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                            }`}
                          >
                            <ImageIcon className={`w-8 h-8 transition-colors ${isSelected ? "text-amber-600/50 dark:text-amber-400/50" : "text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-400 dark:group-hover:text-zinc-500"}`} />
                            {isSelected && (
                              <div className="absolute inset-0 bg-amber-500/10 backdrop-blur-[2px]" />
                            )}
                            <div className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
                              isSelected ? "bg-amber-500 text-white scale-100" : "bg-white/80 dark:bg-black/50 text-zinc-400 dark:text-zinc-500 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 backdrop-blur-sm"
                            }`}>
                              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                              </svg>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button className="w-full bg-zinc-900 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-black font-serif font-bold text-lg py-5 rounded-2xl transition-all shadow-xl shadow-zinc-900/20 dark:shadow-white/10 active:scale-[0.98]">
                      Confirm Selection
                    </button>
                  </div>
                )}

                {/* Studio Contact Footer */}
                <div className="mt-12 pt-12 border-t border-zinc-200 dark:border-white/10 text-center space-y-6">
                  <div className="w-12 h-12 mx-auto rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center shadow-lg">
                    <span className="text-white dark:text-black font-serif font-bold text-xl leading-none">AS</span>
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-zinc-900 dark:text-white">Alice Studio</h3>
                    <p className="text-sm text-zinc-500 mt-1">Capturing your best moments</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center gap-1.5"><span className="text-amber-600 dark:text-amber-400">Email:</span> hello@studiodesk.com</div>
                    <div className="flex items-center gap-1.5"><span className="text-amber-600 dark:text-amber-400">Phone:</span> +91 9876543210</div>
                    <div className="flex items-center gap-1.5"><span className="text-amber-600 dark:text-amber-400">Address:</span> 123, Creative Block, Bandra West, Mumbai, MH</div>
                    <div className="flex items-center gap-1.5"><span className="text-amber-600 dark:text-amber-400">GSTIN:</span> 27AADCB2230M1Z2</div>
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-600 pt-4">© 2026 Alice Studio. All rights reserved.</p>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
