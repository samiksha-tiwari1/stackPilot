"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatAgentMessage } from "@/lib/ai/formatAgentMessage";

/* ===================================================== */
/* TYPES */
/* ===================================================== */

/*
  Represents a single AI activity log entry
*/
type Log = {
  id: string;
  agent: string;
  message: string;
};

/* ===================================================== */
/* PAGE COMPONENT */
/* ===================================================== */

export default function ActivityPage() {
  /*
    Local state to store activity logs fetched from API
  */
  const [logs, setLogs] = useState<Log[]>([]);

  /*
    Fetch logs once when page loads
  */
  useEffect(() => {
    fetch("/api/logs")
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .catch((err) => {
        console.error("Failed to fetch activity logs:", err);
      });
  }, []);

  /*
    Clear all logs from database
    Called after confirmation dialog
  */
  const clearLogs = async () => {
    try {
      await fetch("/api/logs", { method: "DELETE" });
      setLogs([]); // instantly update UI
    } catch (error) {
      console.error("Failed to clear logs:", error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        {/* Header Section */}
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>AI Activity Feed</CardTitle>

          {/* Custom Confirmation Dialog */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200">
                Clear Activity
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to clear all activity logs?
                </AlertDialogTitle>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={clearLogs}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardHeader>

        {/* Content Section */}
        <CardContent className="space-y-4 text-sm">
          {logs.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No activity logs.
            </p>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="border rounded-lg p-4 bg-muted/40"
              >
                {/* Agent Name */}
                <p className="font-semibold mb-2 text-base">
                  {log.agent}
                </p>

                {/* Formatted AI Output */}
                <p className="whitespace-pre-line leading-relaxed text-sm">
                  {formatAgentMessage(log.message)}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}