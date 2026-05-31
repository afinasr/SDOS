import Link from 'next/link';

export default async function PortalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const resolvedParams = await params;
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-24">
      <header className="p-6 text-center border-b dark:border-gray-800">
        <h1 className="text-2xl font-serif tracking-widest uppercase">Studio Name</h1>
      </header>
      <main className="p-6 max-w-3xl mx-auto">
        {children}
      </main>
      <nav className="fixed bottom-0 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-t dark:border-gray-800 p-4 flex justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <Link href={`/portal/${resolvedParams.projectId}`} className="font-medium">Overview</Link>
        <Link href={`/portal/${resolvedParams.projectId}/selection`} className="font-medium">Gallery</Link>
      </nav>
    </div>
  );
}
