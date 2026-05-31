"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button, ButtonProps } from "./button";
import { Aperture } from "lucide-react";

export interface ShutterButtonProps extends ButtonProps {
  loading?: boolean;
}

export function ShutterButton({ onClick, children, loading, ...props }: ShutterButtonProps) {
  const [flashing, setFlashing] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading) return;
    if (!shouldReduceMotion) {
      setFlashing(true);
      setTimeout(() => setFlashing(false), 200); // Allow animation to finish
    }
    if (onClick) onClick(e as any);
  };

  return (
    <>
      <motion.div whileTap={loading ? {} : { scale: 0.95 }} className={typeof props.className === 'string' && props.className.includes('w-full') ? 'w-full' : 'inline-block'}>
        <Button onClick={handleClick} disabled={loading || props.disabled} {...props} className={typeof props.className === 'string' ? props.className : undefined}>
          {loading ? <Aperture className="w-5 h-5 animate-spin text-zinc-500" /> : children}
        </Button>
      </motion.div>

      {flashing && (
        <motion.div 
          initial={{ opacity: 0.8 }} 
          animate={{ opacity: 0 }} 
          transition={{ duration: 0.15 }} 
          className="fixed inset-0 z-[9999] bg-white pointer-events-none" 
        />
      )}
    </>
  );
}
