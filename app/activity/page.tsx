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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Activity Feed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {logs.map((log) => (
            <div key={log.id}>
              <strong>{log.agent}:</strong> {log.message}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}