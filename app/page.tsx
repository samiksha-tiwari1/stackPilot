"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sparkles, Activity, CheckCircle2, Clock } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Greeting Section */}
      <header className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight mb-2">
          Good morning, Samiksha
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Here's what's happening in your workspace today.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card border-none text-card-foreground transition-transform hover:scale-[1.02] duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tasks Created</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">12</div>
            <p className="text-xs text-muted-foreground mt-1">+2 from yesterday</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-none text-card-foreground transition-transform hover:scale-[1.02] duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">AI Actions</CardTitle>
            <Sparkles className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">47</div>
            <p className="text-xs text-muted-foreground mt-1">+18% efficiency</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-none text-card-foreground transition-transform hover:scale-[1.02] duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">8</div>
            <p className="text-xs text-muted-foreground mt-1">4 high priority</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            AI Daily Standup
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground/90 leading-relaxed">
          The team completed <span className="text-foreground font-medium">14 tasks</span> yesterday.
          The Planner agent successfully generated subtasks for the upcoming sprint.
          Critic flagged 2 potential scope issues which were resolved. Assigner distributed tasks based on current load.
        </CardContent>
      </Card>
    </div>
  );
}