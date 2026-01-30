"use client";

import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Message } from "@/types";

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === "user";

  return (
    <article 
      className={cn("flex gap-3 md:gap-4 p-3 md:p-4", isUser ? "flex-row-reverse" : "flex-row")}
      aria-label={`Message from ${isUser ? "you" : "MoltBot"}`}
    >
      <Avatar className="h-8 w-8 md:h-9 md:w-9 shrink-0 shadow-md">
        <AvatarFallback 
          className={cn(
            isUser 
              ? "bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-md shadow-sky-500/25" 
              : "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30"
          )}
          aria-label={isUser ? "Your avatar" : "MoltBot avatar"}
        >
          {isUser ? (
            <User className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Bot className="h-4 w-4" aria-hidden="true" />
          )}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "flex-1 space-y-1.5 md:space-y-2 overflow-hidden min-w-0",
          isUser ? "text-right" : "text-left"
        )}
      >
        <div
          className={cn(
            "inline-block rounded-2xl px-3 py-2 md:px-4 md:py-3 max-w-[90%] md:max-w-[85%] shadow-sm",
            isUser
              ? "bg-gradient-to-br from-sky-500 to-sky-600 text-white rounded-br-md shadow-sky-500/20"
              : "bg-muted/80 rounded-bl-md border border-border/50"
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap text-sm md:text-base">{message.content}</p>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none prose-pre:bg-background/50 prose-pre:border prose-pre:border-border/50 prose-p:text-sm md:prose-p:text-base prose-headings:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-code:bg-background/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-ul:text-sm prose-ol:text-sm">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {message.isStreaming && (
          <div className="flex items-center gap-1.5 text-muted-foreground mt-2" aria-label="MoltBot is typing">
            <span className="text-xs">MoltBot is thinking</span>
            <div className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse delay-75" />
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse delay-150" />
            </div>
            <span className="sr-only">MoltBot is typing...</span>
          </div>
        )}

        <time 
          className="text-[10px] md:text-xs text-muted-foreground"
          dateTime={message.timestamp.toISOString()}
        >
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </time>
      </div>
    </article>
  );
}
