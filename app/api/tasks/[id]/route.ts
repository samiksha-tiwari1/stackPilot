import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const { status } = await req.json();

  const task = await prisma.task.update({
    where: { id: params.id },
    data: { status },
  });

  return NextResponse.json(task);
}

export async function DELETE(
  _req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  await prisma.task.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}