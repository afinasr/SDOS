"use client";
import { Plus, FileText, Send, CheckCircle2, MoreVertical, X } from "lucide-react";
import { ShutterButton } from "@/components/ui/shutter-button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InvoicesView() {
  const [activeTab, setActiveTab] = useState<"Invoices" | "Templates">("Invoices");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const invoices = [
    { id: "INV-001", client: "Meera & Dev", project: "Destination Wedding", amount: "₹15,000", date: "21 May 2026", status: "Paid" },
    { id: "INV-002", client: "Nisha & Karan", project: "Engagement", amount: "₹8,000", date: "10 May 2026", status: "Sent" },
    { id: "INV-003", client: "Kavya & Aryan", project: "Wedding", amount: "₹12,000", date: "6 Jul 2026", status: "Draft" },
  ];

  const templates = [
    { id: "TPL-001", name: "Standard Wedding Package", items: 5, defaultNotes: "Includes 2 lead photographers..." },
    { id: "TPL-002", name: "Pre-Wedding Shoot", items: 2, defaultNotes: "Half day coverage..." },
  ];
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center pt-2">
        <h1 className="text-4xl font-serif font-bold text-zinc-900 dark:text-white">Invoices</h1>
        <ShutterButton size="icon" className="rounded-full bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:text-black border-none" onClick={() => setShowCreateModal(true)}>
          <Plus className="w-5 h-5" />
        </ShutterButton>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 border-b border-zinc-200 dark:border-white/10 text-center transition-colors">
        <button 
          onClick={() => setActiveTab("Invoices")}
          className={`pb-3 border-b-2 font-semibold transition-colors ${activeTab === "Invoices" ? "border-cyan-600 dark:border-cyan-500 text-cyan-600 dark:text-cyan-400" : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
        >
          Invoices
        </button>
        <button 
          onClick={() => setActiveTab("Templates")}
          className={`pb-3 border-b-2 font-semibold transition-colors ${activeTab === "Templates" ? "border-cyan-600 dark:border-cyan-500 text-cyan-600 dark:text-cyan-400" : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
        >
          Templates
        </button>
      </div>

      {activeTab === "Invoices" && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 transition-colors">
              <h3 className="font-serif font-bold text-lg text-green-600 dark:text-green-400">₹15k</h3>
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mt-1">Received</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 transition-colors">
              <h3 className="font-serif font-bold text-lg text-orange-600 dark:text-orange-400">₹8k</h3>
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mt-1">Pending</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 transition-colors">
              <h3 className="font-serif font-bold text-lg text-zinc-900 dark:text-white">₹35k</h3>
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mt-1">Total</p>
            </div>
          </div>

          {/* Invoices List */}
          <div className="space-y-4 pb-4 mt-6">
            {invoices.map((inv, i) => (
              <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-[1.5rem] overflow-hidden shadow-sm">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 dark:bg-white/5 px-2 py-1 rounded-md">{inv.id}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                      inv.status === "Paid" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                      inv.status === "Sent" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                      "bg-zinc-100 text-zinc-700 dark:bg-white/10 dark:text-zinc-300"
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-lg text-zinc-900 dark:text-white">{inv.client}</h4>
                  <p className="text-sm text-zinc-500">{inv.project}</p>
                  
                  <div className="mt-4 flex justify-between items-end">
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">Issued: {inv.date}</p>
                    <p className="font-serif font-bold text-xl text-zinc-900 dark:text-white">{inv.amount}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 border-t border-zinc-200 dark:border-white/10 divide-x divide-zinc-200 dark:divide-white/10">
                  <button className={`py-4 flex items-center justify-center gap-2 text-xs font-medium transition-colors ${
                    inv.status === "Paid" ? "text-zinc-400 dark:text-zinc-600 cursor-not-allowed" : "text-blue-600 dark:text-blue-500 hover:bg-zinc-50 dark:hover:bg-white/5"
                  }`}>
                    <Send className="w-4 h-4" />
                    Send
                  </button>
                  <button className={`py-4 flex items-center justify-center gap-2 text-xs font-semibold transition-colors ${
                    inv.status === "Paid" ? "text-zinc-400 dark:text-zinc-600 cursor-not-allowed" : "text-green-600 dark:text-green-500 hover:bg-zinc-50 dark:hover:bg-white/5"
                  }`}>
                    <CheckCircle2 className="w-4 h-4" />
                    Mark Paid
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === "Templates" && (
        <div className="space-y-4 pt-4 pb-4">
          {templates.map((tpl, i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-5 shadow-sm cursor-pointer hover:border-cyan-500 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white">{tpl.name}</h4>
                  <p className="text-xs text-zinc-500 mt-1">{tpl.items} default line items</p>
                </div>
                <button className="p-2 -mr-2 text-zinc-400 hover:text-zinc-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 p-3 bg-zinc-50 dark:bg-white/5 rounded-xl border border-zinc-100 dark:border-white/5">
                <p className="text-xs font-bold text-zinc-500 mb-1">Default Notes</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 truncate">{tpl.defaultNotes}</p>
              </div>
            </div>
          ))}
          <ShutterButton className="w-full bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-300 font-semibold rounded-2xl py-6 hover:bg-zinc-200 dark:hover:bg-white/10 border border-dashed border-zinc-300 dark:border-white/10">
            <Plus className="w-4 h-4 mr-2 inline" />
            New Template
          </ShutterButton>
        </div>
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
              className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-3xl border border-zinc-200 dark:border-white/10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-5 border-b border-zinc-200 dark:border-white/10 flex justify-between items-center bg-zinc-50/50 dark:bg-white/5 shrink-0">
                <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Create Invoice</h3>
                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-zinc-200 dark:hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                </button>
              </div>
              
              <div className="p-6 space-y-4 overflow-y-auto">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Project</label>
                  <select className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white transition-all">
                    <option>Meera & Dev (Destination Wedding)</option>
                    <option>Kavya & Aryan (Wedding)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Invoice Type</label>
                  <select className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white transition-all">
                    <option>Advance Payment (50%)</option>
                    <option>Final Payment</option>
                    <option>Custom</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Amount</label>
                  <input type="text" placeholder="₹" defaultValue="15000" className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Notes to Client</label>
                  <textarea rows={3} placeholder="Thank you for your business..." className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white transition-all" />
                </div>
                
                <div className="pt-2">
                  <button onClick={() => setShowCreateModal(false)} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:text-black font-bold py-4 rounded-xl transition-all shadow-lg shadow-cyan-500/20">
                    Generate Invoice
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
