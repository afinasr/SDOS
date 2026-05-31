"use client";
import Link from 'next/link';
import { AutofocusWrapper } from '@/components/ui/autofocus-wrapper';
import { SpaceBackground } from '@/components/ui/space-background';
import { SettingsProvider, useSettings } from '@/components/providers/settings-provider';
import { BottomNav } from '@/components/layout/bottom-nav';
import { PageTransition } from '@/components/layout/page-transition';

function AdminContent({ children }: { children: React.ReactNode }) {
  const { enable3DBackground } = useSettings();
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-white relative pb-20 sm:pb-24 transition-colors duration-300">
      {enable3DBackground && <SpaceBackground />}
      <AutofocusWrapper>
        <main className="w-full px-4 sm:px-6 md:px-8 py-6 relative z-10 min-h-screen">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </AutofocusWrapper>
      <BottomNav />
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SettingsProvider>
      <AdminContent>{children}</AdminContent>
    </SettingsProvider>
  );
}
