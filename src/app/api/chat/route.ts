import { NextResponse } from "next/server";

import { createMoltBotClient } from "@/lib/moltbot-client";

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

    // Check for API keys in environment variables (priority order)
    const moltbotToken = process.env.NEXT_PUBLIC_MOLTBOT_TOKEN || process.env.MOLTBOT_TOKEN;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (moltbotToken) {
      // Use MoltBot gateway first (highest priority)
      try {
        const client = createMoltBotClient();
        if (!client) {
          throw new Error("Failed to create MoltBot client");
        }

        const response = await client.sendChatMessage(message, "moltbot:main");
        return NextResponse.json({
          response,
          timestamp: new Date().toISOString(),
          source: "moltbot",
        });
      } catch (error) {
        console.error("MoltBot error, falling back:", error);
        // Fall through to other APIs on error
      }
    }

    if (anthropicKey) {
      // Use Claude API
      const response = await callClaudeAPI(message, anthropicKey);
      return NextResponse.json({
        response,
        timestamp: new Date().toISOString(),
        source: "claude-api",
      });
    } else if (openaiKey) {
      // Use OpenAI API  
      const response = await callOpenAIAPI(message, openaiKey);
      return NextResponse.json({
        response,
        timestamp: new Date().toISOString(),
        source: "openai-api",
      });
    } else {
      // No API key configured - return helpful message
      const response = generateConfigurationMessage(message);
      
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      return NextResponse.json({
        response,
        timestamp: new Date().toISOString(),
        source: "demo-mode",
        needsConfiguration: true,
      });
    }
  } catch (error) {
    console.error("Chat API error:", error);
    
    // Return a user-friendly error response
    const response = `## 🔧 Connection Issue

I'm having trouble processing your request right now. This could be due to:

- **Network connectivity** - Check your internet connection
- **Service availability** - The AI service might be temporarily unavailable
- **Configuration** - Your API keys might need to be renewed

### 🛠️ Quick Fixes:
1. **Refresh the page** and try again
2. **Check your network** connection
3. **Verify API keys** in your environment settings

If the problem persists, the AI service might be experiencing temporary issues. Please try again in a few minutes.

---
*Error logged for debugging. If this keeps happening, check the console for more details.*`;

    return NextResponse.json({ 
      response,
      timestamp: new Date().toISOString(),
      source: "error-handler",
      error: true 
    }, { status: 200 }); // Return 200 with error message instead of 500
  }
}

async function callClaudeAPI(message: string, apiKey: string): Promise<string> {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1024,
        messages: [{ role: 'user', content: message }],
      }),
    });

    if (!response.ok) {
      throw new Error('Claude API request failed');
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Claude API error:', error);
    throw error;
  }
}

async function callOpenAIAPI(message: string, apiKey: string): Promise<string> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: message }],
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

function generateConfigurationMessage(message: string): string {
  return `## 🤖 MoltBot Chat - Setup Required

Hi there! I received your message:
> "${message}"

**I'd love to help, but I need to be connected to an AI service first.**

### 🔧 Quick Setup Options:

**🎯 Option 1: MoltBot Gateway (Recommended)**
Connect to your local MoltBot instance for the full experience:
- Set environment variable: \`MOLTBOT_TOKEN=your-token-here\`
- Gateway URL: \`ws://127.0.0.1:18789\`

**🤖 Option 2: Claude API**
Direct integration with Anthropic's Claude:
- Get API key: [Claude Console](https://console.anthropic.com/)
- Set: \`ANTHROPIC_API_KEY=your-key-here\`

**🚀 Option 3: OpenAI API**
Connect with OpenAI's GPT models:
- Get API key: [OpenAI Platform](https://platform.openai.com/)
- Set: \`OPENAI_API_KEY=your-key-here\`

### ⚡ Quick Start:
1. Add your API key to your environment variables
2. Restart the dashboard
3. Come back and start chatting!

### 🎉 Once Connected, I can:
- Answer questions and provide intelligent responses
- Help with coding, debugging, and development
- Assist with writing, research, and analysis
- Integrate with your existing MoltBot tools and workflows

**Ready to get started? Choose your preferred option above and let's chat!**

---
*💡 This message appears because no AI service is currently configured. It's not an error - just waiting for your setup!*`;
}