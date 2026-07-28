"use client";

import React, { useState, useRef, useEffect } from "react";
import { BookOpen, Brain } from "lucide-react";
import { PageHeader } from "../../../components/ui/PageHeader";
import { mockDocuments, mockTenants } from "../../../lib/mockData";
import { Message } from "../../../types";
import { ConversationList } from "../../../components/chat/ConversationList";
import { ChatMessage } from "../../../components/chat/ChatMessage";
import { ChatInput } from "../../../components/chat/ChatInput";
import { trpc } from "@/lib/trpc/client";

export default function ChatPage(): React.JSX.Element {
  const tenant = mockTenants[0]; // Smith & Partners

  const me = trpc.user.me.useQuery();
  const utils = trpc.useUtils();

  // States
  const tenantDocs = mockDocuments.filter((doc) => doc.tenantId === tenant.id);

  const {
    data: conversations,
    isLoading,
    error,
  } = trpc.conversations.listAllConversations.useQuery();

  const [activeConvId, setActiveConvId] = useState<string>(
    conversations?.[0]?.id || "",
  );

  const [selectedDocIds, setSelectedDocIds] = useState<string[]>(
    tenantDocs.map((doc) => doc.id),
  );

  const [isAiResponding, setIsAiResponding] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const addConversationMutation =
    trpc.conversations.createConversation.useMutation({
      onSuccess: () => utils.conversations.listAllConversations.invalidate(),
    });
  const searchAi = trpc.conversations.aiSearchingProcedure.useMutation({
    onSuccess: () => console.log("hello there"),
  });

  const { data: messages, isLoading: messagesLoading } =
    trpc.messages.getAllMessagesForConversation.useQuery(
      {
        conversationId: activeConvId,
      },
      {
        enabled: !!activeConvId,
      },
    );

  // Scroll to bottom when messages or active chat change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeConvId, isAiResponding]);

  // Toggle document selection for grounding
  const handleToggleDoc = (id: string) => {
    setSelectedDocIds((prev) =>
      prev.includes(id) ? prev.filter((dId) => dId !== id) : [...prev, id],
    );
  };

  // Create a new chat session
  const handleNewChat = () => {
    addConversationMutation.mutate({
      title: "new Conversation",
    });
  };

  // Submitting a query to the AI
  const handleSendMessage = (text: string, conversationId: string) => {
    if (!text.trim() || isAiResponding) return;

    const document = searchAi.mutate({
      userText: text,
      conversationId: conversationId,
    });

    setIsAiResponding(true);
  };

  return (
    <div
      id="chat-page"
      className="flex flex-col h-[calc(100vh-10rem)] max-h-[700px] animate-fade-in gap-6"
    >
      {/* Page Header */}
      <PageHeader
        title="AI Assistant"
        description="Interact, search, and extract reasoning from your grounded document knowledge base."
      />

      <div
        id="chat-wrapper"
        className="flex flex-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden min-h-0"
      >
        {/* Left column: Conversations sidebar */}
        <div
          id="chat-conversations-sidebar"
          className="w-64 border-r border-gray-100 flex flex-col shrink-0 bg-gray-50/50"
        >
          <ConversationList
            conversations={conversations || []}
            activeConversationId={activeConvId}
            onSelectConversation={setActiveConvId}
            onNewConversation={handleNewChat}
            className="flex flex-col h-full bg-transparent border-0 rounded-none p-4 space-y-4 shadow-none"
          />
        </div>

        {/* Center column: Active chat thread */}
        <div
          id="chat-thread-column"
          className="flex-1 flex flex-col bg-white min-w-0"
        >
          {/* Active conversation messages area */}
          <div
            id="messages-scroller"
            className="flex-1 overflow-y-auto p-6 space-y-6"
          >
            {messages ? (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  id={`chat-message-wrapper-${msg.id}`}
                  className="w-full"
                >
                  <ChatMessage message={msg} userName={tenant.name} />
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <Brain className="w-12 h-12 text-gray-300 mb-3 animate-pulse" />
                <h4 className="text-sm font-bold text-gray-900">
                  Start new RAG queries
                </h4>
                <p className="text-xs text-gray-500 max-w-xs text-center mt-1">
                  Type a question below to query your active document knowledge
                  vault in real time.
                </p>
              </div>
            )}

            {/* AI responding thinking state */}
            {isAiResponding && (
              <div className="flex gap-4 max-w-2xl mr-auto">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm shrink-0">
                  <Brain className="w-4.5 h-4.5 animate-spin" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-gray-400 tracking-wide uppercase">
                    DocuMind AI
                  </span>
                  <div className="p-4 rounded-2xl text-sm bg-gray-50 text-gray-500 border border-gray-100 rounded-tl-sm flex items-center gap-3">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                    </span>
                    <span className="font-semibold text-xs text-gray-500 animate-pulse">
                      Retrieving contexts and generating answer...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Message input bar */}
          <div className="p-4 border-t border-gray-100">
            <ChatInput
              onSendMessage={handleSendMessage}
              conversationId={activeConvId}
              isLoading={isAiResponding}
              placeholder="Ask a question about your grounded documents (e.g. 'explain the NDA breach clauses')..."
            />
          </div>
        </div>

        {/* Right column: Grounding documents selection widget */}
        <div
          id="chat-grounding-sidebar"
          className="w-64 border-l border-gray-100 flex flex-col bg-gray-50/30 shrink-0"
        >
          <div className="p-4 border-b border-gray-100 flex items-center gap-2 text-xs font-bold text-gray-800">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Grounded Documents</span>
          </div>

          <div
            id="grounded-docs-checkbox-container"
            className="flex-1 overflow-y-auto p-4 space-y-3"
          >
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block mb-2">
              Select Sources to Query:
            </span>
            {tenantDocs.map((doc) => {
              const isSelected = selectedDocIds.includes(doc.id);
              return (
                <div
                  key={doc.id}
                  id={`grounding-doc-item-${doc.id}`}
                  className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white border-indigo-200 shadow-sm"
                      : "bg-transparent border-transparent opacity-60 hover:opacity-100"
                  }`}
                  onClick={() => handleToggleDoc(doc.id)}
                >
                  <input
                    id={`checkbox-ground-${doc.id}`}
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}} // toggled by parent click
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mt-0.5 pointer-events-none"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-gray-800 truncate leading-snug">
                      {doc.name}
                    </span>
                    <span className="text-[9px] font-mono text-gray-400 uppercase mt-0.5 font-semibold">
                      {doc.fileType}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected summary */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/50 text-[10px] text-gray-400 font-semibold leading-relaxed">
            Query is scoped strictly inside the{" "}
            <span className="text-indigo-600 font-bold">
              {selectedDocIds.length} selected
            </span>{" "}
            sources.
          </div>
        </div>
      </div>
    </div>
  );
}
