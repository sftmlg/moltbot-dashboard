import { NextResponse } from "next/server";

interface ChatRequest {
  message: string;
  sessionId?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequest;
    const { message } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // TODO: Connect to actual AI backend (Claude API, MoltBot gateway, etc.)
    // For now, return a stub response
    const response = generateStubResponse(message);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function generateStubResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
    return "Hello! I'm MoltBot, your AI assistant. How can I help you today?";
  }

  if (lowerMessage.includes("code") || lowerMessage.includes("function")) {
    return `Here's an example code snippet:

\`\`\`typescript
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

// Usage
console.log(greet("World"));
\`\`\`

This is a stub response. Connect me to Claude API for real code generation!`;
  }

  if (lowerMessage.includes("help")) {
    return `I can help you with:

- **Chat**: Ask me anything
- **Code**: Generate, review, or debug code
- **Writing**: Draft emails, documents, etc.
- **Custom UI**: Build interfaces with the Custom Builder

What would you like to do?`;
  }

  return `Thanks for your message! This is a stub response from the MoltBot Dashboard API.

To connect to a real AI backend:
1. Set up your API key in Settings
2. Configure the API endpoint
3. The dashboard will route messages to your AI service

Your message was: "${message}"`;
}
