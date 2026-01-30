"use client";

import { Bot, Wifi, WifiOff } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { ChatInput } from "@/components/chat/chat-input";
import { MessageItem } from "@/components/chat/message-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Message } from "@/types";

interface ConnectionStatus {
  status: 'connected' | 'connecting' | 'disconnected' | 'error';
  service?: string;
  lastChecked?: Date;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hello! I'm MoltBot, your AI assistant. How can I help you today?\n\nI can help with:\n- **Code review** and debugging\n- **Writing** and editing\n- **Research** and analysis\n- **Calendar** and email management\n\n*Feel free to ask me anything or start a conversation!*",
    timestamp: new Date(Date.now() - 60000),
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    status: 'disconnected'
  });
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

  // Check connection status on component mount
  useEffect(() => {
    const checkConnection = async () => {
      setConnectionStatus({ status: 'connecting' });
      
      try {
        const response = await fetch("/api/chat/status");
        if (response.ok) {
          const data = await response.json();
          setConnectionStatus({
            status: 'connected',
            service: data.service || 'Unknown',
            lastChecked: new Date()
          });
        } else {
          setConnectionStatus({ status: 'disconnected' });
        }
      } catch {
        setConnectionStatus({ status: 'error' });
      }
    };

    checkConnection();
  }, []);

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

    // Update connection status to show we're communicating
    setConnectionStatus(prev => ({ ...prev, status: 'connecting' }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Update connection status with service info
      if (data.source) {
        setConnectionStatus({
          status: 'connected',
          service: data.source,
          lastChecked: new Date()
        });
      }

      // Replace streaming message with actual response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === "streaming"
            ? {
                id: crypto.randomUUID(),
                role: "assistant" as const,
                content: data.response || "I received your message but couldn't generate a response.",
                timestamp: new Date(),
                isStreaming: false,
              }
            : msg
        )
      );
    } catch (error) {
      console.error("Chat error:", error);
      setConnectionStatus({ status: 'error' });
      
      // On error, show helpful error message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === "streaming"
            ? {
                id: crypto.randomUUID(),
                role: "assistant" as const,
                content: "I'm having trouble connecting right now. Please check your connection or try again in a moment.",
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

  const getStatusIndicator = () => {
    switch (connectionStatus.status) {
      case 'connected':
        return (
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <Wifi className="h-3 w-3" />
            <span className="text-xs font-medium">
              Connected {connectionStatus.service && `(${connectionStatus.service})`}
            </span>
          </div>
        );
      case 'connecting':
        return (
          <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400">
            <div className="h-3 w-3 rounded-full border-2 border-orange-600 border-t-transparent animate-spin" />
            <span className="text-xs font-medium">Connecting...</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
            <WifiOff className="h-3 w-3" />
            <span className="text-xs font-medium">Connection error</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
            <WifiOff className="h-3 w-3" />
            <span className="text-xs font-medium">Setup required</span>
          </div>
        );
    }
  };

  return (
    <main className="flex flex-col h-[calc(100vh-3.5rem)]" aria-label="Chat with MoltBot">
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <header className="border-b border-border/50 px-3 py-2.5 md:px-4 md:py-3 bg-gradient-to-r from-orange-500/5 to-sky-500/5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base md:text-lg font-semibold flex items-center gap-2">
                <Bot className="h-4 w-4 md:h-5 md:w-5 text-orange-500" />
                MoltBot Chat
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                Your intelligent AI assistant
              </p>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              {getStatusIndicator()}
            </div>
          </div>
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
          <ChatInput 
            onSend={handleSend} 
            disabled={isLoading} 
            placeholder={
              connectionStatus.status === 'connected' 
                ? "Type a message..." 
                : connectionStatus.status === 'connecting'
                ? "Connecting..."
                : "Setup required - see message above"
            }
          />
        </div>
      </div>
    </main>
  );
}
