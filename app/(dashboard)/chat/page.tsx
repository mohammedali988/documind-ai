"use client";

import React, { useState, useRef, useEffect } from "react";
import { BookOpen, Brain } from "lucide-react";
import { PageHeader } from "../../../components/ui/PageHeader";
import {
  mockDocuments,
  mockConversations,
  mockMessages,
  mockTenants,
} from "../../../lib/mockData";
import { Conversation, Message } from "../../../types";
import { ConversationList } from "../../../components/chat/ConversationList";
import { ChatMessage } from "../../../components/chat/ChatMessage";
import { ChatInput } from "../../../components/chat/ChatInput";

export default function ChatPage(): React.JSX.Element {
  const tenant = mockTenants[0]; // Smith & Partners

  // States
  const tenantDocs = mockDocuments.filter((doc) => doc.tenantId === tenant.id);
  const tenantConvs = mockConversations.filter((c) => c.tenantId === tenant.id);

  const [conversations, setConversations] =
    useState<Conversation[]>(tenantConvs);
  const [activeConvId, setActiveConvId] = useState<string>(
    tenantConvs[0]?.id || "",
  );

  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>(
    tenantDocs.map((doc) => doc.id),
  );

  const [isAiResponding, setIsAiResponding] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages or active chat change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeConvId, isAiResponding]);

  // Current active conversation's messages
  const activeMessages = messages.filter(
    (msg) => msg.conversationId === activeConvId,
  );

  // Toggle document selection for grounding
  const handleToggleDoc = (id: string) => {
    setSelectedDocIds((prev) =>
      prev.includes(id) ? prev.filter((dId) => dId !== id) : [...prev, id],
    );
  };

  // Create a new chat session
  const handleNewChat = () => {
    const newId = `conv-simulated-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      tenantId: tenant.id,
      userId: "user-smith-admin",
      title: "New Conversation",
      createdAt: new Date(),
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveConvId(newId);
  };

  // Submitting a query to the AI
  const handleSendMessage = (text: string) => {
    if (!text.trim() || isAiResponding) return;

    const userMsg: Message = {
      id: `msg-user-${Date.now()}`,
      conversationId: activeConvId,
      role: "user",
      content: text,
      sources: [],
      createdAt: new Date(),
    };

    // If it's a "New Conversation" thread, rename the title to the user's first query
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId && c.title === "New Conversation"
          ? {
              ...c,
              title: text.length > 32 ? `${text.substring(0, 32)}...` : text,
            }
          : c,
      ),
    );

    setMessages((prev) => [...prev, userMsg]);
    setIsAiResponding(true);

    // Simulate RAG (Retrieval-Augmented Generation) response delay
    setTimeout(() => {
      // Formulate a smart response based on keywords and selected documents
      const queryLower = userMsg.content.toLowerCase();
      let replyContent = "";
      let citations: string[] = [];

      // Grounding sources based on selected documents
      const selectedDocs = tenantDocs.filter((d) =>
        selectedDocIds.includes(d.id),
      );

      if (selectedDocs.length === 0) {
        replyContent =
          "I don't have access to any grounded context because you have unselected all documents. Please select at least one document from the sidebar to ground my knowledge base.";
      } else {
        // Keyword routing for intelligent simulated answers
        if (
          queryLower.includes("nda") ||
          queryLower.includes("remedy") ||
          queryLower.includes("breach")
        ) {
          replyContent = `Based on the **NDA Template.docx**:\n\n1. **Injunction Relief:** Section 5 states that any breach will cause irreparable harm. The disclosing party can seek an immediate injunction without needing to post a bond.\n2. **Survival Clauses:** These confidentiality covenants survive for a duration of **five (5) years** after the agreement terminates.\n3. **Notice Period:** If a party is required by law or subpoena to disclose confidential information, they must notify the other party immediately to allow them to seek a protective order.`;
          citations = [
            "NDA Template.docx - Section 5: Remedies for Breach",
            "NDA Template.docx - Section 8: Term and Survival",
          ];
        } else if (
          queryLower.includes("handbook") ||
          queryLower.includes("refund") ||
          queryLower.includes("billing")
        ) {
          replyContent = `According to the **Employee Handbook 2024.pdf** (specifically Section 4.2):\n\n* **Billing transparency:** Fee disputes must be reported within **15 days** of receiving the invoice to the Managing Partner.\n* **Client communications:** Staff must maintain transparent communication regarding pricing and hours log to avoid payment frictions.\n* There are no active customer refund clauses in the handbook because it governs internal employee conduct.`;
          citations = [
            "Employee Handbook 2024.pdf - Section 4.2: Billing and Retainers",
          ];
        } else if (
          queryLower.includes("litigation") ||
          queryLower.includes("strategy") ||
          queryLower.includes("court")
        ) {
          replyContent = `Based on the **Litigation Strategy Draft.pdf**:\n\n* The defense strategy focuses heavily on immediate motion filings challenging jurisdiction.\n* Settlement options are outlined in Phase 2 if early summary judgment is not granted.\n* Client billing records and hours projections have been aligned to resource allocations for Q3-Q4.`;
          citations = [
            "Litigation Strategy Draft.pdf - Page 4: Tactical Jurisdictional Challenges",
          ];
        } else {
          // General fallback smart response citing whatever documents are selected
          const activeDocsList = selectedDocs.map((d) => d.name).join(", ");
          replyContent = `I have searched across your active workspace documents (${activeDocsList}) but couldn't find a direct match for that specific question. However, using general enterprise knowledge from your indexed documents:\n\n* The organization follows SOC 2 and GDPR compliance standards.\n* Document permissions are strictly isolated on a tenant-by-tenant level.\n* For specific legal or employee guidelines, please query terms like **"NDA remedies"** or **"Employee billing handbook"**.`;
          citations = selectedDocs
            .slice(0, 2)
            .map((d) => `${d.name} - General Index`);
        }
      }

      const aiMsg: Message = {
        id: `msg-ai-${Date.now()}`,
        conversationId: activeConvId,
        role: "assistant",
        content: replyContent,
        sources: citations,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsAiResponding(false);
    }, 2200);
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
            conversations={conversations}
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
