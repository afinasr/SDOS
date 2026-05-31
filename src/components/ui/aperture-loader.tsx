"use client";
import { motion } from "framer-motion";

export function ApertureLoader({ size = 48 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center" style={{ width: size, height: size }}>
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        className="relative w-full h-full"
      >
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 h-1 bg-white/80 origin-left rounded-full"
            style={{ 
              width: size * 0.4,
              rotate: i * 60,
              y: '-50%'
            }}
            animate={{ 
              rotate: [i * 60, i * 60 + 15, i * 60],
              scaleX: [1, 0.6, 1] 
            }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
        ))}
      </motion.div>
    </div>
  );
}
