import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Assuming prisma client is exported from here
import { cookies } from "next/headers";

// Helper to get workspace (simplified for this context)
async function getWorkspace() {
    // In a real app, this would get the workspace from the session or params
    // For this project, we might just grab the first one if not specified
    const firstWorkspace = await prisma.workspace.findFirst();
    return firstWorkspace?.id;
}

export async function GET(req: Request) {
    try {
        const workspaceId = await getWorkspace();
        if (!workspaceId) {
            return NextResponse.json({ error: "No workspace found" }, { status: 404 });
        }

        const notifications = await (prisma as any).notification.findMany({
            where: {
                workspaceId,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 20, // Limit to 20 for now
        });

        return NextResponse.json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json(
            { error: "Failed to fetch notifications" },
            { status: 500 }
        );
    }
}



export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { ids, all } = body;
        const workspaceId = await getWorkspace();

        if (!workspaceId) {
            return NextResponse.json({ error: "No workspace found" }, { status: 404 });
        }

        if (all) {
            await (prisma as any).notification.updateMany({
                where: {
                    workspaceId,
                    read: false,
                },
                data: {
                    read: true,
                },
            });
            return NextResponse.json({ success: true, message: "Marked all as read" });
        }

        if (ids && Array.isArray(ids)) {
            await (prisma as any).notification.updateMany({
                where: {
                    workspaceId,
                    id: { in: ids },
                },
                data: {
                    read: true,
                },
            });
            return NextResponse.json({ success: true, message: "Marked as read" });
        }

        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    } catch (error) {
        console.error("Error updating notifications:", error);
        return NextResponse.json(
            { error: "Failed to update notifications" },
            { status: 500 }
        );
    }
}
