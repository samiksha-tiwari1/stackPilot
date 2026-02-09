"use client";

import Link from "next/link";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 text-foreground relative selection:bg-blue-500/30 transition-colors duration-300">
      {/* Rich Gradient Background Mesh */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        {/* Top Left Orb */}
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-300/30 dark:bg-blue-900/10 blur-[130px] animate-pulse" style={{ animationDuration: '8s' }} />

        {/* Bottom Right Orb */}
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-indigo-300/30 dark:bg-indigo-900/10 blur-[130px] animate-pulse" style={{ animationDuration: '10s' }} />

        {/* Center Accent */}
        <div className="absolute top-[30%] left-[40%] w-[40vw] h-[40vw] rounded-full bg-violet-300/20 dark:bg-violet-900/5 blur-[150px]" />
      </div>

      <aside className="w-[80px] hidden md:block shrink-0" /> {/* Spacer for collapsed sidebar */}

      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}