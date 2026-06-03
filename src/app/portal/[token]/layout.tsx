import Link from 'next/link';
import { ParticleBackground } from '@/components/ui/particle-background';

export default async function PortalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-24 relative overflow-hidden">
      <ParticleBackground />
      
      <div className="relative z-10">
        <header className="p-6 text-center border-b border-white/10">
          <h1 className="text-2xl font-serif tracking-widest uppercase">Studio Name</h1>
        </header>
      <main className="p-6 max-w-3xl mx-auto">
        {children}
      </main>
      <nav className="fixed bottom-0 w-full bg-black/50 backdrop-blur-md border-t border-white/10 p-4 flex justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
        <Link href={`/portal/${token}`} className="font-medium">Overview</Link>
        <Link href={`/portal/${token}/selection`} className="font-medium text-zinc-400 hover:text-white transition-colors">Gallery</Link>
      </nav>
      </div>
    </div>
  );
}
