"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "../ui/Button";
import { LoadingSpinner } from "../ui/LoadingSpinner";

export interface ChatInputProps {
  onSendMessage: (message: string, conversationId: string) => void;
  isLoading?: boolean;
  conversationId: string;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSendMessage,
  isLoading,
  conversationId,
  disabled,
  placeholder = "Type a message...",
}: ChatInputProps): React.JSX.Element {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea logic
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to recalculate scrollHeight
    textarea.style.height = "auto";

    // Calculate height (limit max height to about 4 rows, i.e., 96px)
    const newHeight = Math.min(textarea.scrollHeight, 120);
    textarea.style.height = `${newHeight}px`;
  }, [text]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || isLoading || disabled) return;

    onSendMessage(text.trim(), conversationId);
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isInputDisabled = disabled || isLoading;

  return (
    <form
      id="chat-input-form"
      onSubmit={handleSubmit}
      className="border border-gray-200 rounded-lg p-2.5 bg-white flex items-end gap-2.5 shadow-sm focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-shadow"
    >
      <textarea
        id="chat-input-textarea"
        ref={textareaRef}
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isInputDisabled}
        className="flex-1 resize-none overflow-y-auto max-h-[120px] bg-transparent text-xs font-medium leading-relaxed text-gray-800 placeholder-gray-400 focus:outline-none py-1.5 px-1 min-h-[32px]"
      />

      <Button
        id="btn-chat-submit"
        type="submit"
        disabled={isInputDisabled || !text.trim()}
        className="h-8 w-8 rounded-md shrink-0 flex items-center justify-center p-0"
      >
        {isLoading ? (
          <LoadingSpinner size="sm" />
        ) : (
          <Send className="w-3.5 h-3.5 text-white" />
        )}
      </Button>
    </form>
  );
}
