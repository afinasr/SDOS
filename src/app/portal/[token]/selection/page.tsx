"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SelectionPage() {
  const [selected, setSelected] = useState<number[]>([]);

  const toggleSelection = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // Mock array for masonry
  const images = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif">Image Selection</h2>
        <span className="text-sm text-gray-500">{selected.length} Selected</span>
      </div>

      <div className="columns-2 md:columns-3 gap-4 space-y-4">
        {images.map(id => {
          const isSelected = selected.includes(id);
          return (
            <motion.div 
              key={id} 
              className="relative break-inside-avoid rounded-xl overflow-hidden group cursor-pointer"
              onClick={() => toggleSelection(id)}
              whileTap={{ scale: 0.95 }}
            >
              <img 
                src={`https://source.unsplash.com/random/400x${400 + (id % 3) * 100}?wedding,${id}`} 
                alt="Wedding" 
                className="w-full object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <motion.button 
                className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full shadow-sm"
                animate={{ scale: isSelected ? 1.1 : 1, color: isSelected ? "#ef4444" : "#9ca3af" }}
                whileTap={{ scale: 1.5 }}
              >
                <Heart fill={isSelected ? "currentColor" : "none"} size={20} />
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {selected.length > 0 && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-24 left-0 w-full px-4 flex justify-center z-50"
        >
          <Button size="lg" className="rounded-full shadow-xl px-8">
            Submit {selected.length} Selections
          </Button>
        </motion.div>
      )}
    </div>
  );
}
