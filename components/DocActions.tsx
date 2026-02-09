
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DocActions({ id }: { id: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const deleteDoc = async () => {
        if (!confirm("Are you sure you want to delete this document?")) return;

        setLoading(true);
        try {
            await fetch(`/api/docs/${id}`, { method: "DELETE" });
            router.refresh();
            router.push("/docs");
        } catch (err) {
            console.error("Delete failed", err);
            setLoading(false);
        }
    };

    return (
        <button
            onClick={deleteDoc}
            disabled={loading}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
        >
            {loading ? "Deleting..." : "Delete"}
        </button>
    );
}
