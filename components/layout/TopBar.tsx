"use client";

import { Plus, FileText, FolderPlus, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { NewWorkspaceModal } from "@/components/NewWorkspaceModal";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TopBar() {
  const [openProject, setOpenProject] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const router = useRouter();

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = async () => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        body: JSON.stringify({ all: true }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        // Optimistically update UI
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      }
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  return (
    <>
      <header className="h-24 flex items-center justify-between px-8 sticky top-0 z-40 pointer-events-none">
        {/* Floating Glass Bar - Pointer events auto to make it interactive */}
        <div className="pointer-events-auto absolute inset-x-8 top-6 bottom-4 rounded-2xl border border-zinc-200/50 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-lg flex items-center justify-between px-6 transition-all duration-300">
          <div className="flex items-center gap-4">
            {/* Breadcrumbs or Status */}
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Workspace</span>
              <span className="text-[15px] font-bold text-zinc-900 dark:text-white tracking-tight">StackPilot AI</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors relative"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2.5 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-zinc-950" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-0">
                <DropdownMenuLabel className="px-4 py-3 font-semibold text-sm border-b dark:border-white/10">
                  Notifications
                </DropdownMenuLabel>
                <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
                  {notifications.length === 0 ? (
                    <p className="text-center text-muted-foreground text-xs py-4">
                      No notifications
                    </p>
                  ) : (
                    notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className="cursor-pointer flex flex-col items-start gap-1 p-3"
                      >
                        <div className="flex items-center gap-2 w-full">
                          <div
                            className={`h-2 w-2 rounded-full ${notification.read ? "bg-gray-300" : "bg-blue-500"
                              }`}
                          />
                          <span className="font-medium text-xs">
                            {notification.title}
                          </span>
                          <span className="ml-auto text-[10px] text-muted-foreground">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground pl-4 line-clamp-2">
                          {notification.message}
                        </p>
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs h-8"
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                  >
                    Mark all as read
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-5 w-px bg-zinc-300 dark:bg-white/10 mx-2" />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpenProject(true)}
              className="h-9 text-[13px] font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 gap-2 rounded-lg transition-all"
            >
              <FolderPlus className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              New Project
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/docs/new")}
              className="h-9 text-[13px] font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 gap-2 rounded-lg transition-all"
            >
              <FileText className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              New Doc
            </Button>

            <Button
              size="sm"
              onClick={() => router.push("/tasks")}
              className="h-9 px-4 text-[13px] font-semibold gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/25 border-none rounded-lg transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              New Task
            </Button>
          </div>
        </div>
      </header>

      <NewWorkspaceModal open={openProject} onOpenChange={setOpenProject} />
    </>
  );
}