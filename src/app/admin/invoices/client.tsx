"use client";
import { Plus, Send, CheckCircle2, X } from "lucide-react";
import { ShutterButton } from "@/components/ui/shutter-button";
import { useState, useTransition } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { playTickSound, playSwooshSound } from "@/lib/audio";
import { createInvoice, updateInvoiceStatus } from "./actions";

export default function InvoicesClient({ initialInvoices, projects }: { initialInvoices: any[], projects: any[] }) {
  const [activeTab, setActiveTab] = useState<"Invoices" | "Templates">("Invoices");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Form State
  const [projectId, setProjectId] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  const templates = [
    { id: "TPL-001", name: "Standard Wedding Package", items: 5, defaultNotes: "Includes 2 lead photographers..." },
    { id: "TPL-002", name: "Pre-Wedding Shoot", items: 2, defaultNotes: "Half day coverage..." },
  ];

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find(p => p.id === projectId);
    if (!proj) return;

    startTransition(async () => {
      try {
        playTickSound();
        await createInvoice(projectId, proj.client_name, Number(amount), dueDate);
        setShowCreateModal(false);
        playSwooshSound();
        setProjectId("");
        setAmount("");
        setDueDate("");
      } catch (err) {
        console.error(err);
      }
    });
  };

  const handleUpdateStatus = (id: string, status: string) => {
    startTransition(async () => {
      playTickSound();
      await updateInvoiceStatus(id, status);
    });
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const totalReceived = initialInvoices.filter(i => i.status === 'Paid').reduce((acc, i) => acc + Number(i.amount), 0);
  const totalPending = initialInvoices.filter(i => i.status !== 'Paid').reduce((acc, i) => acc + Number(i.amount), 0);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center pt-2">
        <h1 className="text-4xl font-serif font-bold text-zinc-900 dark:text-white">Invoices</h1>
        <ShutterButton size="icon" className="rounded-full bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:text-black border-none" onClick={() => { playSwooshSound(); setShowCreateModal(true); }}>
          <Plus className="w-5 h-5" />
        </ShutterButton>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 border-b border-zinc-200 dark:border-white/10 text-center transition-colors">
        <button 
          onClick={() => { playTickSound(); setActiveTab("Invoices"); }}
          className={`pb-3 border-b-2 font-semibold transition-colors ${activeTab === "Invoices" ? "border-cyan-600 dark:border-cyan-500 text-cyan-600 dark:text-cyan-400" : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
        >
          Invoices
        </button>
        <button 
          onClick={() => { playTickSound(); setActiveTab("Templates"); }}
          className={`pb-3 border-b-2 font-semibold transition-colors ${activeTab === "Templates" ? "border-cyan-600 dark:border-cyan-500 text-cyan-600 dark:text-cyan-400" : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
        >
          Templates
        </button>
      </div>

      {activeTab === "Invoices" && (
        <motion.div variants={containerVariants} initial="hidden" animate="show">
          {/* Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3">
            <div className="bg-white/80 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-2xl p-4 transition-colors">
              <h3 className="font-serif font-bold text-lg text-green-600 dark:text-green-400">₹{(totalReceived/1000).toFixed(1)}k</h3>
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mt-1">Received</p>
            </div>
            <div className="bg-white/80 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-2xl p-4 transition-colors">
              <h3 className="font-serif font-bold text-lg text-orange-600 dark:text-orange-400">₹{(totalPending/1000).toFixed(1)}k</h3>
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mt-1">Pending</p>
            </div>
            <div className="bg-white/80 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-2xl p-4 transition-colors">
              <h3 className="font-serif font-bold text-lg text-zinc-900 dark:text-white">₹{((totalReceived+totalPending)/1000).toFixed(1)}k</h3>
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mt-1">Total</p>
            </div>
          </motion.div>

          {/* Invoices List */}
          <div className="space-y-4 pb-4 mt-6">
            {initialInvoices.map((inv) => (
              <motion.div variants={itemVariants} key={inv.id} className="bg-white/80 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-[1.5rem] overflow-hidden shadow-sm">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 dark:bg-white/5 px-2 py-1 rounded-md">{inv.invoice_number}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                      inv.status === "Paid" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                      inv.status === "Sent" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                      "bg-zinc-100 text-zinc-700 dark:bg-white/10 dark:text-zinc-300"
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-lg text-zinc-900 dark:text-white">{inv.client_name}</h4>
                  <p className="text-sm text-zinc-500">{inv.project?.title || "Project"}</p>
                  
                  <div className="mt-4 flex justify-between items-end">
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">Due: {inv.due_date}</p>
                    <p className="font-serif font-bold text-xl text-zinc-900 dark:text-white">₹{Number(inv.amount).toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 border-t border-zinc-200 dark:border-white/10 divide-x divide-zinc-200 dark:divide-white/10">
                  <button 
                    disabled={inv.status === "Paid"}
                    onClick={() => handleUpdateStatus(inv.id, 'Sent')}
                    className={`py-4 flex items-center justify-center gap-2 text-xs font-medium transition-colors ${
                    inv.status === "Paid" ? "text-zinc-400 dark:text-zinc-600 cursor-not-allowed" : "text-blue-600 dark:text-blue-500 hover:bg-zinc-50 dark:hover:bg-white/5"
                  }`}>
                    <Send className="w-4 h-4" />
                    Send
                  </button>
                  <button 
                    disabled={inv.status === "Paid"}
                    onClick={() => handleUpdateStatus(inv.id, 'Paid')}
                    className={`py-4 flex items-center justify-center gap-2 text-xs font-semibold transition-colors ${
                    inv.status === "Paid" ? "text-zinc-400 dark:text-zinc-600 cursor-not-allowed" : "text-green-600 dark:text-green-500 hover:bg-zinc-50 dark:hover:bg-white/5"
                  }`}>
                    <CheckCircle2 className="w-4 h-4" />
                    Mark Paid
                  </button>
                </div>
              </motion.div>
            ))}
            
            {initialInvoices.length === 0 && (
              <div className="text-center py-10 text-zinc-500 dark:text-zinc-400">
                No invoices found. Create your first one!
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Templates Tab (Mock for now) */}
      {activeTab === "Templates" && (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4 pt-2">
          {templates.map((tpl) => (
            <motion.div variants={itemVariants} key={tpl.id} className="bg-white/80 dark:bg-zinc-900/50 backdrop-blur-xl border border-dashed border-zinc-300 dark:border-white/20 rounded-[1.5rem] p-5 cursor-pointer hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors text-center">
               <h4 className="font-bold text-zinc-900 dark:text-white">{tpl.name}</h4>
               <p className="text-xs text-zinc-500 mt-1">{tpl.items} items included</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Create Invoice Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md bg-zinc-50 dark:bg-zinc-900 rounded-t-3xl sm:rounded-3xl border border-zinc-200 dark:border-white/10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-5 border-b border-zinc-200 dark:border-white/10 flex justify-between items-center bg-white/50 dark:bg-black/50 shrink-0">
                <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Create Invoice</h3>
                <button onClick={() => setShowCreateModal(false)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 p-2 rounded-full">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto flex-1">
                <form onSubmit={handleCreateInvoice} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Select Project</label>
                    <select required value={projectId} onChange={e => setProjectId(e.target.value)} className="w-full bg-white dark:bg-black/50 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                      <option value="" disabled>Choose a project...</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.title} ({p.client_name})</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Amount (₹)</label>
                    <input type="number" required value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-white dark:bg-black/50 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="e.g. 15000" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Due Date</label>
                    <input type="date" required value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full bg-white dark:bg-black/50 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                  </div>

                  <div className="pt-4">
                    <ShutterButton loading={isPending} type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-4 rounded-xl font-bold">
                      Generate Invoice
                    </ShutterButton>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
