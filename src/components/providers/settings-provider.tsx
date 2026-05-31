"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SettingsContextType {
  enable3DBackground: boolean;
  setEnable3DBackground: (val: boolean) => void;
  theme: 'light' | 'dark';
  setTheme: (val: 'light' | 'dark') => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [enable3DBackground, setEnable3DBackground] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved3D = localStorage.getItem("sdos_3d_background");
    if (saved3D !== null) {
      setEnable3DBackground(saved3D === "true");
    }
    const savedTheme = localStorage.getItem("sdos_theme");
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    }
    setMounted(true);
  }, []);

  // Sync to local storage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("sdos_3d_background", enable3DBackground.toString());
      localStorage.setItem("sdos_theme", theme);
    }
  }, [enable3DBackground, theme, mounted]);

  // Apply theme class to HTML element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Enforce interdependent rules
  const handleSetTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    if (newTheme === 'light') {
      setEnable3DBackground(false);
    }
  };

  const handleSet3DBackground = (enabled: boolean) => {
    setEnable3DBackground(enabled);
    if (enabled) {
      setTheme('dark');
    }
  };

  return (
    <SettingsContext.Provider value={{ 
      enable3DBackground, 
      setEnable3DBackground: handleSet3DBackground,
      theme,
      setTheme: handleSetTheme
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
