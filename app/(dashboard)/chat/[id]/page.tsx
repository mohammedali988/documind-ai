"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  mockConversations,
  mockMessages,
  mockTenants,
} from "../../../../lib/mockData";
import { ChatMessage } from "../../../../components/chat/ChatMessage";
import { PageHeader } from "../../../../components/ui/PageHeader";
import { ErrorState } from "../../../../components/ui/ErrorState";
import { Button } from "../../../../components/ui/Button";

interface ChatDetailPageProps {
  params: {
    id: string;
  };
}

export default function ChatDetailPage({
  params,
}: ChatDetailPageProps): React.JSX.Element {
  const router = useRouter();
  const tenant = mockTenants[0]; // Smith & Partners

  // Find the conversation
  const conversation = mockConversations.find((conv) => conv.id === params.id);

  // If conversation is not found, display the ErrorState component
  if (!conversation) {
    return (
      <div id="chat-detail-error" className="py-12">
        <ErrorState
          message={`Conversation with ID "${params.id}" could not be found.`}
          onRetry={() => router.push("/dashboard/chat")}
        />
      </div>
    );
  }

  // Get active conversation messages
  const activeMessages = mockMessages.filter(
    (msg) => msg.conversationId === params.id,
  );

  return (
    <div
      id="chat-detail-container"
      className="flex flex-col h-[calc(100vh-10rem)] max-h-[700px] animate-fade-in gap-6"
    >
      {/* Back button and Page Header row */}
      <div
        id="chat-detail-header-row"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div id="chat-detail-header-left" className="flex items-center gap-3">
          <Button
            id="btn-back-to-chats"
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/chat")}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </Button>
          <PageHeader
            title={conversation.title}
            description={`Viewing historical grounded discussion logs of ${tenant.name}.`}
          />
        </div>
      </div>

      {/* Messages listing box */}
      <div
        id="chat-detail-messages-wrapper"
        className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col"
      >
        <div
          id="chat-detail-scroller"
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          {activeMessages.length > 0 ? (
            activeMessages.map((msg) => (
              <div
                key={msg.id}
                id={`chat-message-wrapper-${msg.id}`}
                className="w-full"
              >
                <ChatMessage message={msg} userName={tenant.name} />
              </div>
            ))
          ) : (
            <div
              id="no-messages-placeholder"
              className="h-full flex flex-col items-center justify-center text-gray-400"
            >
              <p className="text-xs font-semibold">
                No messages in this conversation thread.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
