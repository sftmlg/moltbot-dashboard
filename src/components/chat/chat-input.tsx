"use client";

import { Send } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled, placeholder = "Type a message..." }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;

    onSend(trimmed);
    setInput("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  };

  return (
    <div className="flex items-end gap-3 p-3 md:p-4 border-t border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex-1 relative">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          aria-label="Message input"
          className="min-h-11 md:min-h-[44px] max-h-[200px] resize-none text-base md:text-sm border-border/50 focus:border-orange-500/50 focus:ring-orange-500/20 rounded-2xl bg-background/50"
          rows={1}
        />
      </div>
      <Button 
        onClick={handleSubmit} 
        disabled={disabled || !input.trim()} 
        size="icon"
        aria-label="Send message"
        className={cn(
          "h-11 w-11 md:h-10 md:w-10 shrink-0 rounded-xl shadow-md transition-all duration-200",
          disabled || !input.trim()
            ? "bg-muted text-muted-foreground shadow-none"
            : "bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-orange-500/25 hover:shadow-orange-500/40"
        )}
      >
        <Send className="h-5 w-5 md:h-4 md:w-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
