"use client";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import CommandPalette from "../CommandPalette";
import { usePathname } from "next/navigation";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full bg-zinc-50 dark:bg-zinc-950">
      <Sidebar />
      <CommandPalette />

      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <TopBar />
        <main key={pathname} className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}