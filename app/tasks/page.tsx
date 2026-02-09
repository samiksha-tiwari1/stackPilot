"use client";

import { useEffect, useState } from "react";
import { Plus, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Task = {
  id: string;
  title: string;
  status: "todo" | "doing" | "done";
  assignee: string | null;
};

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch("/api/tasks")
      .then((r) => r.json())
      .then(setTasks);
  }, []);

  const createTask = async () => {
    if (!newTask.trim()) return;
    setIsLoading(true);

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTask }),
    });

    if (res.ok) {
      const task = await res.json();
      setTasks((prev) => [...prev, task]);
      setNewTask("");
    } else {
      console.error("Failed to create task");
    }
    setIsLoading(false);
  };

  const deleteTask = async (id: string) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const clearColumn = async (status: Task["status"]) => {
    if (!confirm(`Are you sure you want to clear all "${status}" tasks?`)) return;

    await fetch(`/api/tasks?status=${status}`, { method: "DELETE" });
    setTasks((prev) => prev.filter((t) => t.status !== status));
  };

  const onDrop = async (e: React.DragEvent, newStatus: Task["status"]) => {
    const id = e.dataTransfer.getData("taskId");
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );

    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
  };

  const Column = (status: Task["status"], title: string, dotColor: string) => (
    <div
      className="flex-1 glass-card rounded-2xl p-5 min-h-[600px] flex flex-col gap-4 transition-colors duration-300"
      onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('bg-white/5'); }}
      onDragLeave={(e) => e.currentTarget.classList.remove('bg-white/5')}
      onDrop={(e) => { e.currentTarget.classList.remove('bg-white/5'); onDrop(e, status); }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`h-2.5 w-2.5 rounded-full ${dotColor} shadow-[0_0_10px_currentColor]`} />
          <h2 className="font-semibold text-foreground tracking-tight">{title}</h2>
          <span className="text-xs font-medium text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
            {tasks.filter((t) => t.status === status).length}
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 cursor-pointer"
              onClick={() => clearColumn(status)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-3 flex-1">
        {tasks
          .filter((t) => t.status === status)
          .map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("taskId", task.id)
              }
              className="group bg-card/50 hover:bg-card border border-white/5 hover:border-primary/20 rounded-xl p-4 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-lg transition-all duration-200 animate-scale-in"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="font-medium text-sm leading-snug">{task.title}</div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTask(task.id)}
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 -mt-1 -mr-1 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in h-[calc(100vh-80px)]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Kanban Board</h1>
          <p className="text-muted-foreground">Manage your tasks and workflows.</p>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="New task..."
              className="w-80 bg-background/50 border-white/10 focus:border-primary/50 pr-24"
              onKeyDown={(e) => e.key === "Enter" && createTask()}
            />
            <div className="absolute right-1 top-1">
              <Button
                size="sm"
                onClick={createTask}
                disabled={isLoading}
                className="h-8 text-xs bg-primary/20 text-primary hover:bg-primary/30 border border-primary/20"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-6 h-full pb-4 items-start overflow-x-auto">
        {Column("todo", "To Do", "bg-zinc-400 text-zinc-400")}
        {Column("doing", "In Progress", "bg-indigo-500 text-indigo-500")}
        {Column("done", "Completed", "bg-emerald-500 text-emerald-500")}
      </div>
    </div>
  );
}