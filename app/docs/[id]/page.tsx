import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { DocActions } from "@/components/DocActions";

export default async function DocView(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  const doc = await prisma.doc.findUnique({
    where: { id: params.id },
  });

  if (!doc) {
    return <div className="p-8">Document not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-10">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-semibold">{doc.title}</h1>
        <div className="flex gap-2">
          <Link
            href={`/docs/${doc.id}/edit`}
            className="px-4 py-2 text-sm border border-border rounded-md hover:bg-black hover:text-white transition-colors"
          >
            Edit
          </Link>
          <DocActions id={doc.id} />
        </div>
      </div>
      <p className="whitespace-pre-wrap">{doc.content}</p>
    </div>
  );
}