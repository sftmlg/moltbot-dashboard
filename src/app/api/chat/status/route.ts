import { NextResponse } from "next/server";

import { createMoltBotClient } from "@/lib/moltbot-client";

export async function GET() {
  try {
    // Check for API keys in environment variables (priority order)
    const moltbotToken = process.env.NEXT_PUBLIC_MOLTBOT_TOKEN || process.env.MOLTBOT_TOKEN;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (moltbotToken) {
      // Try to connect to MoltBot gateway
      try {
        const client = createMoltBotClient();
        if (client) {
          return NextResponse.json({
            status: "connected",
            service: "MoltBot Gateway",
            timestamp: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.log("MoltBot not available, checking other services...");
      }
    }

    if (anthropicKey) {
      return NextResponse.json({
        status: "connected",
        service: "Claude API",
        timestamp: new Date().toISOString(),
      });
    }

    if (openaiKey) {
      return NextResponse.json({
        status: "connected",
        service: "OpenAI API", 
        timestamp: new Date().toISOString(),
      });
    }

    // No API configured
    return NextResponse.json({
      status: "disconnected",
      service: "none",
      message: "No AI service configured",
      timestamp: new Date().toISOString(),
    }, { status: 200 }); // Return 200 but with disconnected status

  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json({
      status: "error",
      message: "Failed to check connection status",
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}