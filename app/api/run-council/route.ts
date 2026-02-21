import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runAgents } from "@/lib/ai/agentRunner";

/* ===================================================== */
/* Convert Documents → Structured Text                  */
/* ===================================================== */

function docsToText(
  docs: {
    title: string;
    content: string;
  }[]
) {
  if (!docs.length) return "No documents.";

  return docs
    .map(
      (d) =>
        `Document: ${d.title}\n${d.content}\n`
    )
    .join("\n");
}

/* ===================================================== */
/* POST: Run AI Council                                 */
/* ===================================================== */

export async function POST() {
  try {
    /* 1. Get latest workspace */
    const workspace = await prisma.workspace.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!workspace) {
      return NextResponse.json(
        { error: "No workspace found." },
        { status: 404 }
      );
    }

    console.log("Using Workspace:", workspace.id);

    /* 2. Fetch recent documents only */
    const docs = await prisma.doc.findMany({
      where: { workspaceId: workspace.id },
      orderBy: { createdAt: "desc" },
      take: 3,
    });

    console.log("DOCS:", docs.map((d) => d.title));

    /* 3. Build document-only context */
    const documentContext = `
Workspace: ${workspace.name}

===== DOCUMENTS =====
${docsToText(docs)}
`;

    /* 4. Run pipeline */
    await runAgents(documentContext, workspace.id);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Run Council Error:", error);

    return NextResponse.json(
      { error: "Failed to run council." },
      { status: 500 }
    );
  }
}