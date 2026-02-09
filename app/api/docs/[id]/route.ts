import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    await prisma.doc.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete failed:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const { title, content } = await req.json();

    const doc = await prisma.doc.update({
      where: { id: params.id },
      data: { title, content },
    });

    return NextResponse.json(doc);
  } catch (err) {
    console.error("Update failed:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}