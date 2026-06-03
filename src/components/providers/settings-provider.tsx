"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface StudioProfile {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  cityState: string;
  gstin: string;
}

interface SettingsContextType {
  enable3DBackground: boolean;
  setEnable3DBackground: (val: boolean) => void;
  theme: 'light' | 'dark';
  setTheme: (val: 'light' | 'dark') => void;
  studioProfile: StudioProfile;
  setStudioProfile: (profile: StudioProfile) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [enable3DBackground, setEnable3DBackground] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [studioProfile, setStudioProfile] = useState<StudioProfile>({
    name: "Studio Desk",
    tagline: "Capturing your best moments",
    email: "hello@studiodesk.com",
    phone: "+91 9876543210",
    address: "123, Creative Block, Bandra West",
    cityState: "Mumbai, MH",
    gstin: "27AADCB2230M1Z2"
  });
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
    const savedProfile = localStorage.getItem("sdos_studio_profile");
    if (savedProfile) {
      try {
        setStudioProfile(JSON.parse(savedProfile));
      } catch (e) {}
    }
    setMounted(true);
  }, []);

  // Sync to local storage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("sdos_3d_background", enable3DBackground.toString());
      localStorage.setItem("sdos_theme", theme);
      localStorage.setItem("sdos_studio_profile", JSON.stringify(studioProfile));
    }
  }, [enable3DBackground, theme, studioProfile, mounted]);

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
      setTheme: handleSetTheme,
      studioProfile,
      setStudioProfile
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
