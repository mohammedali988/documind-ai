"use client";

import React from "react";
import { Brain } from "lucide-react";
import { Message } from "../../types";
import { formatDate, getInitials } from "../../lib/utils";

import { SourceCitation } from "./SourceCitation";
import { trpc } from "@/lib/trpc/client";

export interface ChatMessageProps {
  message: Message;
  userName?: string;
}

export function ChatMessage({
  message,
  userName,
}: ChatMessageProps): React.JSX.Element {
  const isUser = message.role === "user";
  const nameToUse = userName || "User";

  const { data: currentUser } = trpc.user.getCurrentUser.useQuery();

  return (
    <div
      id={`chat-message-${message.id}`}
      className={`flex gap-3 w-full max-w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* Assistant Avatar (Left Side) */}
      {!isUser && (
        <div
          id={`assistant-avatar-${message.id}`}
          className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-600 flex items-center justify-center flex-shrink-0"
        >
          <Brain className="w-4 h-4" />
        </div>
      )}

      {/* Message Bubble Container */}
      <div className={`flex flex-col gap-1 max-w-[75%] sm:max-w-[70%]`}>
        {/* Bubble itself */}
        <div
          className={`p-3.5 text-xs font-medium leading-relaxed shadow-xs border ${
            isUser
              ? "bg-indigo-600 border-indigo-700 text-white rounded-tl-xl rounded-bl-xl rounded-tr-none"
              : "bg-white border-gray-200 text-gray-800 rounded-tr-xl rounded-br-xl rounded-tl-none"
          }`}
        >
          <p className="whitespace-pre-wrap font-sans">{message.content}</p>

          {/* Sources section (Only for assistant messages with sources) */}
          {!isUser && message.sources && message.sources.length > 0 && (
            <SourceCitation sources={message.sources} />
          )}
        </div>

        {/* Name and Timestamp under Bubble */}
        <div
          className={`flex items-center gap-1.5 text-[9px] text-gray-400 font-bold uppercase tracking-wider px-1 ${
            isUser ? "justify-end" : "justify-start"
          }`}
        >
          <span>
            {isUser ? currentUser?.tenant_id?.name : "DocuMind Agent"}
          </span>
          <span>•</span>
          <span>{formatDate(new Date(message.created_at))}</span>
        </div>
      </div>

      {/* User Avatar (Right Side) */}
      {isUser && (
        <div
          id={`user-avatar-${message.id}`}
          className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-150 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase flex-shrink-0"
          title={currentUser?.tenant_id?.name}
        >
          {getInitials(currentUser?.tenant_id?.name)}
        </div>
      )}
    </div>
  );
}
