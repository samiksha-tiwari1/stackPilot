"use client";

import Link from "next/link";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-900">
      <aside className="w-64 bg-white border-r border-zinc-200 p-6 space-y-6">
        <div className="text-xl font-semibold">StackPilot</div>

        <nav className="flex flex-col gap-3 text-sm">
          <Link href="/">Dashboard</Link>
          <Link href="/tasks">Tasks</Link>
          <Link href="/docs">Docs</Link>
          <Link href="/activity">Activity</Link>
          <Link href="/council">Agent Council</Link>
        </nav>
      </aside>

      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}