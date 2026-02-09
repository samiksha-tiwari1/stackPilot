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
    <aside className="fixed left-0 top-0 bottom-0 w-[220px] bg-sidebar text-sidebar-foreground flex flex-col z-50 border-r border-sidebar-border">
      {/* Logo */}
      <div className="px-5 pt-6 pb-8 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
          <Zap className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-semibold text-[15px] tracking-tight text-sidebar-accent-foreground">
          StackPilot
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = isActivePath(item.path);

          return (
            <Link
              key={item.path}
              href={item.path}
              className="relative flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium group"
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-sidebar-accent rounded-lg"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}

              <item.icon
                className={`relative z-10 w-4 h-4 ${
                  isActive
                    ? "text-sidebar-accent-foreground"
                    : "text-sidebar-foreground group-hover:text-sidebar-accent-foreground"
                }`}
              />

              <span
                className={`relative z-10 ${
                  isActive
                    ? "text-sidebar-accent-foreground"
                    : "text-sidebar-foreground group-hover:text-sidebar-accent-foreground"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-sidebar-border bg-sidebar">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-[11px] font-semibold text-sidebar-accent-foreground">
            SP
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-sidebar-accent-foreground truncate">
              Samiksha P.
            </p>
            <p className="text-[11px] text-sidebar-foreground truncate">
              samiksha@stackpilot.ai
            </p>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}