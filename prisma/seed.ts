
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding ...");

  // Clean up existing data
  await prisma.agentLog.deleteMany();
  await prisma.task.deleteMany();
  await prisma.doc.deleteMany();
  await prisma.workspaceMember.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.user.deleteMany();

  // Create User
  const user = await prisma.user.create({
    data: {
      email: "dev@stackpilot.com",
      name: "Dev User",
    },
  });

  console.log(`Created user with id: ${user.id}`);

  // Create Workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: "Demo Workspace",
      members: {
        create: {
          userId: user.id,
          role: "admin",
        },
      },
    },
  });

  console.log(`Created workspace with id: ${workspace.id}`);

  // Create Tasks
  await prisma.task.createMany({
    data: [
      {
        title: "Design login page UI",
        status: "todo",
        assignee: "Dev User",
        workspaceId: workspace.id,
      },
      {
        title: "Deploy backend server",
        status: "todo",
        assignee: "Dev User",
        workspaceId: workspace.id,
      },
      {
        title: "Write API documentation",
        status: "doing",
        assignee: "Dev User",
        workspaceId: workspace.id,
      },
      {
        title: "Setup database schema",
        status: "done",
        assignee: "Dev User",
        workspaceId: workspace.id,
      },
    ],
  });

  console.log("Created tasks");

  // Create Docs
  await prisma.doc.createMany({
    data: [
      {
        title: "Project Overview",
        content: "This is the initial project overview document.",
        workspaceId: workspace.id,
      },
      {
        title: "API Specifications",
        content: "Detailed API specs go here.",
        workspaceId: workspace.id,
      },
    ],
  });

  console.log("Created docs");

  // Create Notifications
  await prisma.notification.createMany({
    data: [
      {
        title: "Welcome to StackPilot",
        message: "Your workspace has been successfully created. Start by creating a new task or document.",
        type: "success",
        workspaceId: workspace.id,
      },
      {
        title: "System Update",
        message: "StackPilot has been updated to version 2.0 with a new premium UI.",
        type: "info",
        workspaceId: workspace.id,
      },
    ],
  });
  console.log("Created notifications");

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
