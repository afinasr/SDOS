"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

export function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([
    { role: 'ai', text: 'Hello! I am your Studio AI Assistant. Ask me anything about your projects, revenue, or crew.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim()) return;
    const userQuery = query.trim();
    setQuery("");
    setMessages(prev => [...prev, { role: 'user', text: userQuery }]);
    setIsLoading(true);
    
    try {
      const { chatWithStudio } = await import('@/app/admin/ai-actions');
      const response = await chatWithStudio(userQuery);
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (e: any) {
      toast.error(e.message);
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I ran into an error getting that information." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 sm:bottom-8 right-4 z-50 bg-cyan-600 hover:bg-cyan-500 text-black p-4 rounded-full shadow-lg shadow-cyan-500/30 transition-transform active:scale-95"
      >
        <Sparkles className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 sm:bottom-24 right-4 z-[60] w-[350px] sm:w-[400px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[500px] max-h-[70vh]"
          >
            {/* Header */}
            <div className="bg-cyan-600 p-4 flex justify-between items-center text-black">
              <div className="flex items-center gap-2 font-bold">
                <Bot className="w-5 h-5" /> Studio AI
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-cyan-700 p-1 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 dark:bg-black/50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${m.role === 'user' ? 'bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white rounded-br-none' : 'bg-cyan-600/10 text-cyan-900 dark:text-cyan-100 border border-cyan-500/20 rounded-bl-none'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-cyan-600/10 text-cyan-600 border border-cyan-500/20 rounded-2xl rounded-bl-none p-3 text-sm flex gap-1 items-center">
                    <span className="w-2 h-2 bg-cyan-600 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-cyan-600 rounded-full animate-bounce delay-100" />
                    <span className="w-2 h-2 bg-cyan-600 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex gap-2">
              <input 
                type="text" 
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask about revenue, projects..."
                className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !query.trim()}
                className="bg-cyan-600 text-black p-2 rounded-xl disabled:opacity-50 transition-opacity"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
