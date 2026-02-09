
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface NewWorkspaceModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function NewWorkspaceModal({ open, onOpenChange }: NewWorkspaceModalProps) {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCreate = async () => {
        if (!name.trim()) return;

        setLoading(true);
        try {
            const res = await fetch("/api/workspaces", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });

            if (!res.ok) throw new Error("Failed to create workspace");

            const workspace = await res.json();
            onOpenChange(false);
            setName("");
            router.refresh();
            // Optionally redirect to the new workspace if routing supports it
            // router.push(`/workspaces/${workspace.id}`); 
        } catch (error) {
            console.error(error);
            alert("Failed to create project");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Input
                        id="name"
                        placeholder="Project Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleCreate} disabled={loading}>
                        {loading ? "Creating..." : "Create Project"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
