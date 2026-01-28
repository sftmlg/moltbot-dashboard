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
      <Avatar className="h-8 w-8 md:h-8 md:w-8 shrink-0">
        <AvatarFallback 
          className={cn(
            isUser 
              ? "bg-sky-500 text-white" 
              : "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25"
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
            "inline-block rounded-2xl px-3 py-2 md:px-4 md:py-2 max-w-[90%] md:max-w-[85%]",
            isUser
              ? "bg-sky-500 text-white rounded-br-md"
              : "bg-muted rounded-bl-md"
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap text-sm md:text-base">{message.content}</p>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none prose-pre:bg-background/50 prose-pre:border prose-pre:border-border/50 prose-p:text-sm md:prose-p:text-base">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {message.isStreaming && (
          <div className="flex items-center gap-1 text-muted-foreground" aria-label="MoltBot is typing">
            <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse delay-75" />
            <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse delay-150" />
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
