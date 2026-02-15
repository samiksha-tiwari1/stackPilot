"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sparkles, Activity, CheckCircle2, Clock } from "lucide-react";

type DashboardData = {
  tasksCreated: number;
  aiActions: number;
  pending: number;
  standup: string;
};

export default function Dashboard() {
  const router = useRouter();

  // ---------- fallback example data ----------
  const exampleData: DashboardData = {
    tasksCreated: 0,
    aiActions: 0,
    pending: 0,
    standup: "No activity yet. Your AI agents will appear here.",
  };

  const [data, setData] = useState<DashboardData>(exampleData);
  const [loading, setLoading] = useState(true);

  // ---------- fetch dashboard data ----------
  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/dashboard");

      if (!res.ok) throw new Error("Failed to fetch dashboard");

      const json = await res.json();

      setData({
        tasksCreated: json.tasksCreated ?? 0,
        aiActions: json.aiActions ?? 0,
        pending: json.pending ?? 0,
        standup:
          json.standup ??
          "No activity yet. Your AI agents will appear here.",
      });
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------- load once ----------
 useEffect(() => {
  fetchDashboard();

  // auto refresh every 5 seconds
  const interval = setInterval(fetchDashboard, 5000);

  return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Greeting */}
      <header className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight mb-2">
          Good morning, Samiksha
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Here&apos;s what&apos;s happening in your workspace today.
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Tasks Created */}
        <Card
          onClick={() => router.push("/tasks")}
          className="glass-card cursor-pointer border-none hover:shadow-lg transition-all hover:scale-[1.02] duration-300"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tasks Created
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? "--" : data.tasksCreated}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Click to view tasks
            </p>
          </CardContent>
        </Card>

        {/* AI Actions */}
        <Card
          onClick={() => router.push("/agents")}
          className="glass-card cursor-pointer border-none hover:shadow-lg transition-all hover:scale-[1.02] duration-300"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              AI Actions
            </CardTitle>
            <Sparkles className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? "--" : data.aiActions}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Click to view AI agents
            </p>
          </CardContent>
        </Card>

        {/* Pending */}
        <Card
          onClick={() => router.push("/tasks?filter=pending")}
          className="glass-card cursor-pointer border-none hover:shadow-lg transition-all hover:scale-[1.02] duration-300"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? "--" : data.pending}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Click to view pending tasks
            </p>
          </CardContent>
        </Card>

      </div>

      {/* AI Standup */}
      <Card className="glass-card border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            AI Daily Standup
          </CardTitle>
        </CardHeader>

        <CardContent className="text-muted-foreground leading-relaxed">
          {data.standup}
        </CardContent>
      </Card>
    </div>
  );
}