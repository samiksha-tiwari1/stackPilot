import { callOllama } from "@/lib/ai/ollama";
import { NextResponse } from "next/server";

export async function GET() {
  const res = await callOllama("Say hello from StackPilot AI");
  return NextResponse.json({ res });
}