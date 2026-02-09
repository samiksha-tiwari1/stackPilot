"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function useQuickActions() {
  const [openDoc, setOpenDoc] = useState(false);
  const [openTask, setOpenTask] = useState(false);

  const QuickModals = () => (
    <>
      {/* NEW DOC MODAL */}
      <Dialog open={openDoc} onOpenChange={setOpenDoc}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>New Document</DialogTitle>
          </DialogHeader>
          <iframe
            src="/docs/new"
            className="w-full h-[500px] border rounded-md"
          />
        </DialogContent>
      </Dialog>

      {/* NEW TASK MODAL */}
      <Dialog open={openTask} onOpenChange={setOpenTask}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>New Task</DialogTitle>
          </DialogHeader>
          <iframe
            src="/tasks/new"
            className="w-full h-[350px] border rounded-md"
          />
        </DialogContent>
      </Dialog>
    </>
  );

  return { setOpenDoc, setOpenTask, QuickModals };
}