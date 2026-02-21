"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

/* Added proper Doc type */
type Doc = {
    id: string;
    title: string;
    content: string;
};

export default function EditDocPage(props: { params: Promise<{ id: string }> }) {
    const params = use(props.params);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetch(`/api/docs`)
            .then((res) => res.json())
            .then((docs: Doc[]) => {   // ← typed properly
                const doc = docs.find((d) => d.id === params.id);  // ← removed any
                if (doc) {
                    setTitle(doc.title);
                    setContent(doc.content);
                }
                setLoading(false);
            });
    }, [params.id]);

    const saveDoc = async () => {
        if (!title.trim() || !content.trim()) return;

        try {
            setSaving(true);

            const res = await fetch(`/api/docs/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content }),
            });

            if (!res.ok) throw new Error("Save failed");

            router.refresh();
            router.push(`/docs/${params.id}`);
        } catch (err) {
            console.error("Save failed:", err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="flex justify-center px-6 py-12">
            <Card className="w-full max-w-3xl shadow-sm border border-border">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold">Edit Document</CardTitle>
                </CardHeader>

                <CardContent className="space-y-5">
                    <input
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
                    />

                    <textarea
                        placeholder="Content..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full border border-border rounded-md px-3 py-2 h-96 text-sm outline-none resize-none focus:ring-2 focus:ring-black/10"
                    />

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => router.back()}
                            className="px-4 py-2 text-sm text-gray-500 hover:text-black"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={saveDoc}
                            disabled={saving}
                            className="bg-black text-white px-4 py-2 rounded-md text-sm disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}