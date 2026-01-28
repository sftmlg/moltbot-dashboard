import { NextResponse } from "next/server";

import type { Session } from "@/types";
import { createMoltBotClient } from "@/lib/moltbot-client";

// Mock data - fallback when MoltBot is not available
const mockSessions: Session[] = [
  {
    id: "1",
    title: "Project planning for Q1",
    createdAt: new Date(Date.now() - 120000),
    updatedAt: new Date(Date.now() - 120000),
    messageCount: 12,
    preview: "Let me help you outline the key milestones...",
  },
  {
    id: "2",
    title: "Email draft review",
    createdAt: new Date(Date.now() - 900000),
    updatedAt: new Date(Date.now() - 900000),
    messageCount: 8,
    preview: "I've refined the email to be more concise...",
  },
  {
    id: "3",
    title: "Code debugging session",
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(Date.now() - 3600000),
    messageCount: 24,
    preview: "The issue is in the async handler...",
  },
  {
    id: "4",
    title: "Meeting notes summary",
    createdAt: new Date(Date.now() - 10800000),
    updatedAt: new Date(Date.now() - 10800000),
    messageCount: 6,
    preview: "Here are the action items from today's call...",
  },
];

export async function GET() {
  const moltbotToken = process.env.NEXT_PUBLIC_MOLTBOT_TOKEN || process.env.MOLTBOT_TOKEN;
  
  // If no token is set, use mock data (useful for Vercel deployment)
  if (!moltbotToken) {
    console.log("No MoltBot token found, using mock data");
    return NextResponse.json({
      sessions: mockSessions,
      total: mockSessions.length,
      source: "mock"
    });
  }

  try {
    const client = createMoltBotClient();
    if (!client) {
      throw new Error("Failed to create MoltBot client");
    }

    const moltbotSessions = await client.getSessions();
    
    // Convert MoltBot sessions to our Session interface
    const sessions: Session[] = moltbotSessions.map(session => ({
      id: session.key,
      title: `${session.role || 'Agent'} (${session.device || session.key})`,
      createdAt: new Date(session.lastActivity),
      updatedAt: new Date(session.lastActivity),
      messageCount: session.tokens || 0,
      preview: `Status: ${session.status} | Model: ${session.model}`,
    }));

    return NextResponse.json({
      sessions,
      total: sessions.length,
      source: "moltbot"
    });
  } catch (error) {
    console.error("Failed to fetch MoltBot sessions:", error);
    
    // Fallback to mock data on error
    return NextResponse.json({
      sessions: mockSessions,
      total: mockSessions.length,
      source: "mock",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { title?: string };

    const newSession: Session = {
      id: crypto.randomUUID(),
      title: body.title || "New conversation",
      createdAt: new Date(),
      updatedAt: new Date(),
      messageCount: 0,
      preview: "",
    };

    // TODO: Save to database
    return NextResponse.json(newSession, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}
