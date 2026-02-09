"use client";

import { Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuickActions } from "@/components/global/QuickActions";

export default function TopBar() {
  const { setOpenDoc, setOpenTask, QuickModals } = useQuickActions();

  return (
    <>
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-foreground">
            Workspace
          </span>
          <span className="text-muted-foreground text-[13px]">/</span>
          <span className="text-[13px] text-muted-foreground">
            StackPilot AI
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpenDoc(true)}
            className="h-8 text-[12px] gap-1.5 border-border bg-background"
          >
            <FileText className="w-3.5 h-3.5" />
            New Doc
          </Button>

          <Button
            size="sm"
            onClick={() => setOpenTask(true)}
            className="h-8 text-[12px] gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            New Task
          </Button>
        </div>
      </header>

      <QuickModals />
    </>
  );
}