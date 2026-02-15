import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ---------- Helper: get workspace ----------
async function getWorkspace() {
  const firstWorkspace = await prisma.workspace.findFirst();
  return firstWorkspace?.id;
}

// ---------- GET notifications ----------
export async function GET() {
  try {
    const workspaceId = await getWorkspace();

    if (!workspaceId) {
      return NextResponse.json([], { status: 200 });
    }

    // Notifications are not implemented yet
    // Returning empty array keeps frontend stable
    return NextResponse.json([]);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json([], { status: 200 });
  }
}

// ---------- PATCH notifications ----------
export async function PATCH() {
  try {
    // Notifications not implemented yet
    return NextResponse.json({
      success: true,
      message: "Notifications feature not enabled yet",
    });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json({
      success: true,
    });
  }
}