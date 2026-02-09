"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Good morning, Samiksha</h1>

      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tasks Created Today</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">12</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Actions Today</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">47</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">8</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Daily Standup</CardTitle>
        </CardHeader>
        <CardContent>
          The team completed tasks yesterday. Planner generated subtasks.
          Critic flagged scope issues. Assigner distributed tasks.
        </CardContent>
      </Card>
    </div>
  );
}