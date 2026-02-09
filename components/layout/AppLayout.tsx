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
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <CommandPalette />

      <div className="flex-1 ml-[220px] flex flex-col">
        <TopBar />
        <main key={pathname} className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}