"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Doc = {
  id: string;
  title: string;
  content: string;
};

export default function DocsGrid({ docs }: { docs: Doc[] }) {
  const router = useRouter();

  const deleteDoc = async (id: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    if (!confirm("Are you sure?")) return;

    await fetch(`/api/docs/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
      {docs.map((doc) => (
        <Link
          key={doc.id}
          href={`/docs/${doc.id}`}
          className="group relative block"
        >
          <div className="glass-card rounded-xl p-6 h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <FileText className="w-5 h-5" />
              </div>
            </div>

            <h2 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{doc.title}</h2>
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
              {doc.content}
            </p>

            <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10" onClick={(e) => { e.preventDefault(); router.push(`/docs/${doc.id}/edit`); }}>
                <Pencil className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-500/10" onClick={(e) => deleteDoc(doc.id, e)}>
                <Trash2 className="w-4 h-4 text-muted-foreground hover:text-red-500" />
              </Button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}