"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Log = {
  id: string;
  agent: string;
  message: string;
};

export default function ActivityPage() {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    fetch("/api/logs")
      .then((r) => r.json())
      .then(setLogs);
  }, []);

  const clearLogs = async () => {
    if (!confirm("Are you sure you want to clear all activity logs?")) return;
    await fetch("/api/logs", { method: "DELETE" });
    setLogs([]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>AI Activity Feed</CardTitle>
          <button
            onClick={clearLogs}
            className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
          >
            Clear Activity
          </button>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {logs.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No activity logs.
            </p>
          ) : (
            logs.map((log) => (
              <div key={log.id}>
                <strong>{log.agent}:</strong> {log.message}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}