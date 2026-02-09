"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  Activity,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import ThemeToggle from "../ThemeToggle";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Tasks", path: "/tasks", icon: CheckSquare },
  { label: "Docs", path: "/docs", icon: FileText },
  { label: "Activity", path: "/activity", icon: Activity },
  { label: "Agent Council", path: "/council", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActivePath = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <aside
      className="group sticky top-0 h-screen shrink-0 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-r border-zinc-200 dark:border-white/10 shadow-2xl z-50 transition-all duration-300 ease-in-out flex flex-col overflow-hidden w-[80px] hover:w-[260px]"
    >
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none dark:from-white/5" />

      {/* Logo */}
      <div className="flex items-center gap-4 relative z-10 transition-all duration-300 px-0 pt-8 pb-6 justify-center group-hover:px-6 group-hover:justify-start">
        <div className="w-10 h-10 min-w-[40px] rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Zap className="w-6 h-6 text-white fill-white" />
        </div>

        <span
          className="font-bold text-[20px] tracking-tight text-zinc-900 dark:text-white leading-none whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 absolute left-20"
        >
          StackPilot
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-2 py-6 relative z-10 overflow-x-hidden">
        {navItems.map((item) => {
          const isActive = isActivePath(item.path);

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "relative flex items-center h-12 rounded-xl transition-all duration-200 group/item",
                "justify-center px-0 group-hover:px-4 group-hover:justify-start group-hover:gap-4",
                isActive ? "" : "hover:bg-zinc-100 dark:hover:bg-white/5"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-blue-50 dark:bg-blue-600/10 border border-blue-200 dark:border-blue-500/20 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                >
                  {/* Active Indicator Bar - Collapsed */}
                  <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 dark:bg-blue-500 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.5)] group-hover:hidden" />
                  {/* Active Indicator Bar - Expanded */}
                  <div className="hidden group-hover:block absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 dark:bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(37,99,235,0.5)]" />
                </motion.div>
              )}

              <item.icon
                className={cn(
                  "relative z-10 transition-colors duration-200 min-w-[20px]",
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-zinc-500 dark:text-zinc-400 group-hover/item:text-zinc-900 dark:group-hover/item:text-zinc-200"
                )}
                size={20}
              />

              <span
                className={cn(
                  "relative z-10 transition-all duration-300 whitespace-nowrap font-medium text-[15px] opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 w-0 group-hover:w-auto",
                  isActive
                    ? "text-blue-900 dark:text-white font-semibold"
                    : "text-zinc-600 dark:text-zinc-400 group-hover/item:text-zinc-900 dark:group-hover/item:text-zinc-200"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="relative z-10 border-t border-zinc-200 dark:border-white/5 bg-zinc-50/50 dark:bg-black/20 transition-all duration-300 p-4 flex justify-center group-hover:p-4 group-hover:justify-start">
        <div className="flex items-center gap-3 group/user cursor-pointer overflow-hidden max-w-full">
          <div className="w-10 h-10 min-w-[40px] rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 p-[1px] shadow-lg">
            <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center">
              <span className="text-[14px] font-bold text-zinc-900 dark:text-white">SP</span>
            </div>
          </div>

          <div className="flex-1 min-w-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-0 group-hover:w-auto">
            <p className="text-[14px] font-semibold text-zinc-900 dark:text-white truncate group-hover/user:text-blue-600 dark:group-hover/user:text-blue-400 transition-colors">
              Samiksha P.
            </p>
            <p className="text-[12px] text-zinc-500 truncate">
              Pro Plan
            </p>
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute right-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </aside>
  );
}