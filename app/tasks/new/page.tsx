"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function NewTaskPage() {
  const [title, setTitle] = useState("");
  const router = useRouter();

  const createTask = async () => {
    if (!title) return;

    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    router.push("/tasks");
  };

  return (
    <div className="p-6">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Create New Task</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            className="border rounded-md p-2 w-full"
            placeholder="Task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button
            onClick={createTask}
            className="bg-black text-white px-4 py-2 rounded-md"
          >
            Add Task
          </button>
        </CardContent>
      </Card>
    </div>
  );
}