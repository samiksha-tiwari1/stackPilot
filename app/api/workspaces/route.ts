
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getWorkspace } from "@/lib/getWorkspace"; // Reuse for user context if needed, but here we create new

export async function POST(req: Request) {
    try {
        const { name } = await req.json();

        // In a real app we'd get the current user. For now, we'll associate with the first user found or just create it.
        // The schema requires a user relationship for members.

        // Quick fix: Find the first user (the one we seeded) to make them admin
        const user = await prisma.user.findFirst();

        if (!user) {
            return NextResponse.json({ error: "No users found" }, { status: 400 });
        }

        const workspace = await prisma.workspace.create({
            data: {
                name,
                members: {
                    create: {
                        userId: user.id,
                        role: "ADMIN"
                    }
                }
            },
        });

        return NextResponse.json(workspace);
    } catch (error) {
        console.error("Failed to create workspace:", error);
        return NextResponse.json({ error: "Failed to create workspace" }, { status: 500 });
    }
}
