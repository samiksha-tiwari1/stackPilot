"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type Doc = {
  id: string;
  title: string;
  content: string;
};

export default function DocsGrid({ docs }: { docs: Doc[] }) {
  const router = useRouter();

  const deleteDoc = async (id: string) => {
    await fetch(`/api/docs/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {docs.map((doc) => (
        <div key={doc.id} className="group border rounded-xl p-6 relative">
          <Link href={`/docs/${doc.id}`}>
            <h2 className="text-lg font-semibold">{doc.title}</h2>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {doc.content}
            </p>
          </Link>

          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link
              href={`/docs/${doc.id}/edit`}
              className="text-sm bg-white border px-2 py-1 rounded hover:bg-gray-100"
            >
              Edit
            </Link>
            <button
              onClick={() => deleteDoc(doc.id)}
              className="text-sm bg-white border px-2 py-1 rounded text-red-500 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}