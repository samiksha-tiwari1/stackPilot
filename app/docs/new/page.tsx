"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function NewDocPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const saveDoc = async () => {
    if (!title.trim() || !content.trim()) return;

    try {
      setLoading(true);

      const res = await fetch("/api/docs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) throw new Error("Save failed");

      //  THIS ORDER IS IMPORTANT
      router.refresh();   // re-fetch server components
      router.push("/docs"); // then go back
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center px-6 py-12">
      <Card className="w-full max-w-3xl shadow-sm border border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            New Document
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20"
          />

          <textarea
            placeholder="Write meeting notes here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-transparent border border-border rounded-md px-3 py-2 h-40 text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none focus:ring-2 focus:ring-primary/20"
          />

          <button
            onClick={saveDoc}
            disabled={loading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-4 py-2 rounded-md text-sm disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Doc"}
          </button>
        </CardContent>
      </Card>
    </div>
  );
}