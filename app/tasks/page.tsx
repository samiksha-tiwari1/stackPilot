"use client";

import { useEffect, useState } from "react";

type Task = {
  id: string;
  title: string;
  status: "todo" | "doing" | "done";
  assignee: string | null;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetch("/api/tasks")
      .then((r) => r.json())
      .then(setTasks);
  }, []);

  const createTask = async () => {
    if (!newTask.trim()) return;

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
  };

  const deleteTask = async (id: string) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const onDrop = async (e: React.DragEvent, newStatus: Task["status"]) => {
    const id = e.dataTransfer.getData("taskId");

    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  const Column = (status: Task["status"], title: string, dot: string) => (
    <div
      className="flex-1 bg-white rounded-2xl border p-5 shadow-sm min-h-[520px]"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, status)}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${dot}`} />
          <h2 className="font-semibold">{title}</h2>
        </div>
      </div>

      <div className="space-y-3">
        {tasks
          .filter((t) => t.status === status)
          .map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("taskId", task.id)
              }
              className="group bg-gray-50 hover:bg-gray-100 border rounded-xl p-4 cursor-move transition"
            >
              <div className="flex justify-between items-center">
                <div className="font-medium">{task.title}</div>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-red-500 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Tasks</h1>

      {/* Create Task */}
      <div className="flex gap-3 mb-6">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Create a new task..."
          className="border rounded-lg px-3 py-2 w-80"
        />
        <button
          onClick={createTask}
          className="bg-black text-white px-4 rounded-lg"
        >
          Add Task
        </button>
      </div>

      <div className="flex gap-6">
        {Column("todo", "To Do", "bg-gray-400")}
        {Column("doing", "Doing", "bg-blue-500")}
        {Column("done", "Done", "bg-green-500")}
      </div>
    </div>
  );
}