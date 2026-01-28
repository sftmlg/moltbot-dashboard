"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ChatInput } from "@/components/chat/chat-input";
import { MessageItem } from "@/components/chat/message-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Message } from "@/types";

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hello! I'm MoltBot, your AI assistant. How can I help you today?\n\nI can help with:\n- **Code review** and debugging\n- **Writing** and editing\n- **Research** and analysis\n- **Calendar** and email management",
    timestamp: new Date(Date.now() - 60000),
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
    // eslint-disable-next-line -- we intentionally want to scroll when messages change
  }, [messages.length, scrollToBottom]);

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Add streaming indicator
    const streamingMessage: Message = {
      id: "streaming",
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    };
    setMessages((prev) => [...prev, streamingMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });

      const data = (await response.json()) as { response: string };

      // Replace streaming message with actual response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === "streaming"
            ? {
                id: crypto.randomUUID(),
                role: "assistant" as const,
                content: data.response,
                timestamp: new Date(),
                isStreaming: false,
              }
            : msg
        )
      );
    } catch {
      // On error, show error message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === "streaming"
            ? {
                id: crypto.randomUUID(),
                role: "assistant" as const,
                content: "Sorry, I encountered an error. Please try again.",
                timestamp: new Date(),
                isStreaming: false,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-[calc(100vh-3.5rem)]" aria-label="Chat with MoltBot">
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <header className="border-b border-border/50 px-3 py-2.5 md:px-4 md:py-3 bg-gradient-to-r from-orange-500/5 to-sky-500/5">
          <h1 className="text-base md:text-lg font-semibold flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            Chat
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground">Conversation with MoltBot</p>
        </header>

        {/* Messages */}
        <ScrollArea className="flex-1 scrollbar-hide" ref={scrollRef}>
          <div className="max-w-3xl mx-auto pb-2">
            {messages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))}
          </div>
        </ScrollArea>

        {/* Input - full width on mobile, constrained on desktop */}
        <div className="w-full max-w-3xl mx-auto">
          <ChatInput onSend={handleSend} disabled={isLoading} />
        </div>
      </div>
    </main>
  );
}
