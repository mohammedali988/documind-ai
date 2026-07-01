"use client";

import React from "react";
import { MessageSquare } from "lucide-react";
import { Conversation } from "../../types";
import { formatDate } from "../../lib/utils";

export interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export function ConversationItem({
  conversation,
  isActive,
  onClick,
}: ConversationItemProps): React.JSX.Element {
  // Truncate title to 40 characters
  const truncatedTitle =
    conversation.title.length > 40
      ? `${conversation.title.substring(0, 40)}...`
      : conversation.title;

  return (
    <button
      id={`conversation-item-${conversation.id}`}
      type="button"
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg flex items-start gap-3 transition-colors cursor-pointer border-l-2 ${
        isActive
          ? "bg-indigo-50 border-indigo-600 text-indigo-950"
          : "bg-white border-transparent hover:bg-gray-50 text-gray-700 hover:text-gray-900"
      }`}
    >
      <MessageSquare
        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
          isActive ? "text-indigo-600" : "text-gray-400"
        }`}
      />
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-bold truncate leading-snug">
          {truncatedTitle}
        </h4>
        <span
          className={`text-[10px] font-medium block mt-1 ${
            isActive ? "text-indigo-400 font-semibold" : "text-gray-400"
          }`}
        >
          {formatDate(conversation.createdAt)}
        </span>
      </div>
    </button>
  );
}
