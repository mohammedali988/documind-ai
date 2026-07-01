"use client";

import React from "react";
import { Plus, MessageSquare } from "lucide-react";
import { Conversation } from "../../types";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { ConversationItem } from "./ConversationItem";

export interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  className?: string;
}

export function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  className,
}: ConversationListProps): React.JSX.Element {
  return (
    <div
      id="conversation-list-container"
      className={
        className ||
        "flex flex-col h-full bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-4"
      }
    >
      <Button
        id="btn-new-conversation"
        onClick={onNewConversation}
        className="w-full flex items-center justify-center gap-2 py-5"
      >
        <Plus className="w-4 h-4" />
        <span>New Conversation</span>
      </Button>

      <div
        id="conversations-scroller"
        className="flex-1 overflow-y-auto pr-1 space-y-2"
      >
        {conversations.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No conversations yet"
            description="Start a new conversation to begin"
          />
        ) : (
          conversations.map((conv) => (
            <div key={conv.id} id={`conversation-item-wrapper-${conv.id}`}>
              <ConversationItem
                conversation={conv}
                isActive={conv.id === activeConversationId}
                onClick={() => onSelectConversation(conv.id)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
