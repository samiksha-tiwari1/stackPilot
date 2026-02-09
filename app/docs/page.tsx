import { prisma } from "@/lib/prisma";
import DocsGrid from "@/components/DocsGrid";
import Link from "next/link";
import { getWorkspace } from "@/lib/getWorkspace";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function DocsPage() {
  const workspaceId = await getWorkspace();  // ← string

  const docs = await prisma.doc.findMany({
    where: {
      workspaceId: workspaceId,  // ← MUST be explicit
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      content: true,
    },
  });

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Documents</h1>
          <p className="text-muted-foreground text-sm">
            Team documents and knowledge base.
          </p>
        </div>

        <Link
          href="/docs/new"
          className="bg-black text-white px-4 py-2 rounded-md text-sm"
        >
          New Doc
        </Link>
      </div>

      <DocsGrid docs={docs} />
    </div>
  );
}