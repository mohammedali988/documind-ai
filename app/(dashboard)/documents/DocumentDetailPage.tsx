"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Download,
  Search,
  Sparkles,
  Clock,
  User,
  Calendar,
  Hash,
  FileText,
  Layers,
  Cpu,
  Copy,
  Check,
  ShieldAlert,
  Send,
  Loader2,
} from "lucide-react";
import { mockDocuments, mockUsers, mockTenants } from "../../../lib/mockData";
import { DocumentChunk } from "../../../types";
import { Button } from "../../../components/ui/Button";
import { DocumentStatus } from "../../../components/documents/DocumentStatus";
import { formatDate } from "../../../lib/utils";

// Dynamic mock chunks database indexed by document ID
const documentChunksDatabase: Record<string, string[]> = {
  "doc-smith-1": [
    "Welcome to Smith & Partners. We are committed to fostering a workplace of excellence, mutual respect, and client-first values. Our team consists of leading legal professionals operating across major corporate law sectors.",
    "Section 1.5 - Equal Opportunity Employment. Smith & Partners provides equal employment opportunities to all employees and applicants without regard to race, color, religion, gender, sexual orientation, or national origin.",
    "Section 3.1 - Working Hours and Hybrid Policy. Our standard office hours are 9:00 AM to 6:00 PM. Employees on the standard contract are permitted to work remotely on Tuesdays and Thursdays, subject to manager approval and client coverage.",
    "Section 4.2 - Billing and Retainers. All client consultations must be documented with accurate billing logs. Fee adjustments or disputes must be routed directly to the Managing Partner within fifteen (15) business days of invoice issuance.",
  ],
  "doc-smith-2": [
    'Section 1 - Definition of Confidential Information. "Confidential Information" refers to any proprietary information, trade secrets, technology, business plans, or client details shared by the Disclosing Party to the Receiving Party.',
    "Section 2 - Exclusions from Confidentiality. Confidential Information does not include information that: (a) is or becomes publicly available through no breach; (b) was already in the receiving party's possession; or (c) is independently developed.",
    "Section 3 - Obligations of Receiving Party. The Receiving Party agrees to: (a) keep the Confidential Information strictly confidential; (b) restrict disclosure to personnel with a strict need to know; and (c) not use it for commercial gain.",
    "Section 5 - Remedies for Breach. In the event of a breach of this Agreement, the Disclosing Party shall be entitled to seek injunctive relief to prevent unauthorized disclosure without the necessity of posting a bond, as well as monetary damages.",
    "Section 8 - Term and Survival. This Agreement and the confidentiality obligations hereunder shall survive the termination or expiration of this Agreement for a period of five (5) years from the date of disclosure.",
  ],
  "doc-smith-3": [
    "Section 1: Executive Summary & Legal Standings. Initial litigation strategy draft for the upcoming patent dispute. The case centers on distributed database cache consistency models patented in 2021.",
    "Section 2: Statement of Key Claims and Causes of Action. Smith & Partners asserts that the competitor's service directly violates Claims 3, 5, and 12 of our primary ledger synchronization patents.",
    "Section 3: Discovery Plan and Evidence Compilations. Requests for admission and key source code disclosures are scheduled to be served during Phase 1 discovery, beginning next quarter.",
  ],
  "doc-medicore-1": [
    "Section 1.1 - Commitment to Patient Privacy. MediCore Hospital is dedicated to safeguarding patient Protected Health Information (PHI) under federal and state HIPAA regulations. We use advanced electronic medical records encryption.",
    "Section 2.1 - Authorized Disclosures. Patient records may be disclosed to authorized medical practitioners directly involved in the patient's care, billing departments for insurance processing, and other parties with explicit written consent.",
    "Section 2.4 - Permitted Unconsented Disclosures. Patient Protected Health Information (PHI) may be disclosed without consent under four conditions: (1) Public Health reporting of communicable diseases, (2) Court subpoena or warrant, (3) Emergency medical care when patient is incapacitated, (4) Law enforcement suspect location search.",
  ],
  "doc-medicore-2": [
    "Section 1 - ICU Admission Standards. Patients are admitted to the Intensive Care Unit based on specific triage indicators, including respiratory distress, hemodynamical instability, or post-operative monitoring requirements.",
    "Section 5 - Patient Handoff Protocols (I-PASS Mnemonic). ICU handovers must follow the I-PASS standard: Illness Severity classification, Patient summary details, Action list items, Situation awareness plan, and Receiver Synthesis verification.",
  ],
  "doc-medicore-3": [
    "System Error: Could not parse document content. The file structure is corrupt or unreadable. Ingestion process aborted during text block segmentation extraction.",
  ],
  "doc-bytestack-1": [
    "Slide 1 - Mission Statement. ByteStack is building the next-generation serverless caching layer for high-throughput transactional database applications. Our platform reduces database cold-starts by 90%.",
    "Slide 5 - Market Opportunity. The serverless database market is projected to reach $24B by 2028. ByteStack sits at the intersection of performance caching and distributed ledger databases, addressing developer latency.",
    "Slide 14 - Infrastructure & Security Core. Our hosting infrastructure is multi-region and features SOC 2 Type II Certified data centers, ISO 27001 standard security frameworks, TLS 1.3 in transit, and AES-256 encryption at rest.",
  ],
  "doc-bytestack-2": [
    "Section 2.1 - Client Gateway & Ingress routing. All external client API requests route through our secure load balancer. WebSockets are routed to a persistent Node.js connection manager with a redis-backed pub/sub channel.",
    "Section 4.5 - Cache Invalidation and Replication. Our caching algorithm uses a modified Least Recently Used (LRU) policy. Cache updates are replicated asynchronously across three regional replica groups within 15ms.",
  ],
};

// Starting recommended prompts for the AI grounded playground based on document ID
const documentSuggestedPrompts: Record<string, string[]> = {
  "doc-smith-1": [
    "Summarize the remote work and hybrid policy",
    "What is the billing policy for clients?",
    "Does the company have an equal opportunity policy?",
  ],
  "doc-smith-2": [
    "What are the remedies if there is a breach?",
    "What is excluded from confidential information?",
    "How long do the confidentiality obligations survive?",
  ],
  "doc-smith-3": [
    "What patents are involved in the dispute?",
    "When does discovery Phase 1 start?",
    "Summarize the litigation strategy",
  ],
  "doc-medicore-1": [
    "Under what conditions can data be disclosed without consent?",
    "Is patient privacy HIPAA compliant?",
    "Who is authorized to receive medical records?",
  ],
  "doc-medicore-2": [
    "Explain the I-PASS handoff protocol",
    "What are the ICU admission criteria?",
  ],
  "doc-bytestack-1": [
    "What security compliances are guaranteed?",
    "What is the market opportunity size?",
    "How does ByteStack reduce latency?",
  ],
  "doc-bytestack-2": [
    "How does cache replication work?",
    "Describe the client ingress routing architecture",
  ],
};

interface MessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: { index: number; text: string }[];
  timestamp: Date;
}

export interface DocumentDetailPageProps {
  documentId: string;
}

export function DocumentDetailPage({
  documentId,
}: DocumentDetailPageProps): React.JSX.Element {
  const document = mockDocuments.find((d) => d.id === documentId);
  const uploader = document
    ? mockUsers.find((u) => u.id === document.uploadedBy)
    : null;
  const tenant = document
    ? mockTenants.find((t) => t.id === document.tenantId)
    : null;

  const chunksText = documentChunksDatabase[documentId] || [
    "No text content has been processed for this document type.",
  ];

  // Map text lines into full DocumentChunk objects
  const chunks: DocumentChunk[] = chunksText.map((text, idx) => ({
    id: `chunk-${documentId}-${idx}`,
    documentId: documentId,
    tenantId: document?.tenantId || "",
    content: text,
    chunkIndex: idx,
    createdAt: document?.created_at || new Date(),
  }));

  const suggestedPrompts = documentSuggestedPrompts[documentId] || [
    "What are the key points in this document?",
    "Can you summarize this file?",
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChunkId, setSelectedChunkId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSources, setActiveSources] = useState<
    { index: number; text: string }[]
  >([]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  // Initial greeting from AI assistant
  useEffect(() => {
    if (!document) return;
    const documentName = document.name;
    const initialMessage: MessageItem = {
      id: "welcome-msg",
      role: "assistant",
      content: `Hello! I have indexed **${documentName}** into DocuMind's semantic layer.

You can ask me anything about its contents. I will cite exact sections from the **${chunks.length} chunks** extracted below. Try one of the suggested prompts to see me query the knowledge base in real-time!`,
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  }, [documentId]);

  if (!document) {
    return (
      <div
        id="doc-not-found"
        className="p-8 max-w-4xl mx-auto text-center space-y-4"
      >
        <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900">Document Not Found</h2>
        <p className="text-sm text-gray-500">
          The document with ID &quot;{documentId}&quot; could not be located in
          your knowledge base.
        </p>
        <Button
          onClick={() => {
            window.history.pushState({}, "", "/dashboard/documents");
            window.dispatchEvent(new Event("pushstate"));
          }}
          variant="outline"
          className="inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Knowledge Base</span>
        </Button>
      </div>
    );
  }

  const filteredChunks = chunks.filter((chunk) =>
    chunk.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCopyChunk = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleBackToDocuments = () => {
    window.history.pushState({}, "", "/dashboard/documents");
    window.dispatchEvent(new Event("pushstate"));
  };

  // Perform dynamic, semantic retrieval-oriented response generation
  const handleQueryAI = async (queryText: string) => {
    if (!queryText.trim() || isGenerating) return;

    const userMsg: MessageItem = {
      id: `user-msg-${Date.now()}`,
      role: "user",
      content: queryText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsGenerating(true);

    // Dynamic chunk retrieval ranking
    const queryWords = queryText
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 2);
    const scoredChunks = chunks.map((chunk) => {
      let score = 0;
      queryWords.forEach((word) => {
        if (chunk.content.toLowerCase().includes(word)) {
          score += 1;
        }
      });
      return { chunk, score };
    });

    // Filter chunks with score > 0, sort desc, take up to 2
    const retrieved = scoredChunks
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => ({
        index: item.chunk.chunkIndex,
        text: item.chunk.content,
      }));

    // Fallback: if no matching words, use first chunk as primary context reference
    const primarySources =
      retrieved.length > 0
        ? retrieved
        : [{ index: 0, text: chunks[0].content }];

    // Set active sources visual highlight
    setActiveSources(primarySources);

    // Simulate RAG generation latency
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Dynamic natural synthesis generator depending on context
    let synthesizedAnswer = "";
    const srcTexts = primarySources.map((s) => s.text).join(" ");

    if (document.status === "processing") {
      synthesizedAnswer = `I cannot fully extract specific cited information from **${document.name}** right now because its current ingestion state is **Processing**.

Please wait a moment for the background segmentation pipelines to finalize indexing before querying detailed clauses.`;
    } else if (document.status === "failed") {
      synthesizedAnswer = `I am unable to answer queries about **${document.name}** because the file ingestion pipeline **Failed**.

The system logs indicate this PDF structure is either password-protected or contains corrupted binaries. Please delete this record and upload a clean copy of the document.`;
    } else {
      // Synthesize based on keywords or general content
      const lowerQuery = queryText.toLowerCase();
      if (
        lowerQuery.includes("remote") ||
        lowerQuery.includes("hybrid") ||
        lowerQuery.includes("work")
      ) {
        synthesizedAnswer = `Based on Section 3.1 of the Employee Handbook, our hybrid workplace policy designates **Tuesdays and Thursdays** as eligible remote work days, provided that you have formal manager approval and appropriate coverage for client-facing tasks.

The core working hours remain standard: **9:00 AM to 6:00 PM**.`;
      } else if (
        lowerQuery.includes("billing") ||
        lowerQuery.includes("fee") ||
        lowerQuery.includes("refund") ||
        lowerQuery.includes("dispute")
      ) {
        synthesizedAnswer = `According to Section 4.2 of the Handbook, Smith & Partners requires precise billing logs for legal consultations.

If any client raises a billing dispute or fee adjustment request, it must be officially submitted to the **Managing Partner** within **fifteen (15) business days** of invoice issuance. There are no general refund pathways detailed inside this internal staff handbook.`;
      } else if (
        lowerQuery.includes("remedies") ||
        lowerQuery.includes("breach") ||
        lowerQuery.includes("violate")
      ) {
        synthesizedAnswer = `Under Section 5 (Remedies for Breach) of the Non-Disclosure Agreement, a violation of confidentiality entitles the Disclosing Party to seek **injunctive relief** to immediately halt unauthorized dissemination of secrets, without the requirement of posting a bond.

Additionally, the Disclosing Party may pursue **monetary damages** for the direct business losses incurred due to the leak.`;
      } else if (
        lowerQuery.includes("equal") ||
        lowerQuery.includes("opportunity") ||
        lowerQuery.includes("discrimination")
      ) {
        synthesizedAnswer = `Yes, Section 1.5 strictly outlines Smith & Partners' dedication to **Equal Employment Opportunity**.

The firm guarantees a workplace environment completely free of bias or harassment, ensuring identical opportunities for career growth regardless of race, color, gender, sexual orientation, religion, or national origin.`;
      } else if (
        lowerQuery.includes("exclusion") ||
        lowerQuery.includes("public") ||
        lowerQuery.includes("not confidential")
      ) {
        synthesizedAnswer = `According to Section 2 of the NDA, Confidential Information does not cover data that:
1. **Public Domain:** Is already public or becomes publicly known through no wrongdoing of the receiving party.
2. **Prior Knowledge:** Was already in the possession of the receiving party prior to signing.
3. **Independent Creation:** Is independently developed by the receiving party's engineers without referencing the disclosed assets.`;
      } else if (
        lowerQuery.includes("how long") ||
        lowerQuery.includes("survival") ||
        lowerQuery.includes("term")
      ) {
        synthesizedAnswer = `As specified in Section 8 (Term and Survival), the receiving party's obligation to keep all proprietary materials confidential survives for **five (5) years** from the exact date the information was initially disclosed, even if the surrounding commercial relationship terminates.`;
      } else if (
        lowerQuery.includes("unconsent") ||
        lowerQuery.includes("without consent") ||
        lowerQuery.includes("no consent")
      ) {
        synthesizedAnswer = `According to Section 2.4 of the Patient Privacy Policy, MediCore Hospital is authorized to release Protected Health Information (PHI) without patient consent in **four strict scenarios**:
1. **Public Health Reporting:** Reporting mandated outbreaks, infectious diseases, or vaccine reactions.
2. **Legal Orders:** Complying with a certified court-issued subpoena or warrant.
3. **Medical Emergency:** Providing life-saving clinical records to emergency staff when the patient is unconscious or incapacitated.
4. **Fugitive Search:** Helping law enforcement locate active suspects or missing persons.`;
      } else if (
        lowerQuery.includes("ipass") ||
        lowerQuery.includes("i-pass") ||
        lowerQuery.includes("handoff") ||
        lowerQuery.includes("handover")
      ) {
        synthesizedAnswer = `ICU Standard Operating Procedures mandate the **I-PASS Mnemonic protocol** for clinical handovers to eliminate diagnostic misunderstandings:
- **I (Illness Severity):** Grouping patient status into Stable, Watcher, or Unstable.
- **P (Patient Summary):** Synthesizing recent medical events, diagnoses, and treatments.
- **A (Action List):** Outlining active to-do tasks and identifying responsible owners.
- **S (Situation Awareness):** Creating precautionary plans for prospective complications.
- **S (Synthesis by Receiver):** The incoming nurse repeats the key critical items to verify transfer of understanding.`;
      } else if (
        lowerQuery.includes("security") ||
        lowerQuery.includes("compliance") ||
        lowerQuery.includes("infrastructure")
      ) {
        synthesizedAnswer = `Our infrastructure (referenced on Slide 14 of the Series A Deck) features advanced security implementations:
- **SOC 2 Type II Certified** data centers.
- **ISO 27001** alignment for top-tier security standards.
- **Encryption:** Fully secured with **TLS 1.3** in transit and **AES-256** encryption at rest.`;
      } else if (
        lowerQuery.includes("cache") ||
        lowerQuery.includes("replication") ||
        lowerQuery.includes("consistency")
      ) {
        synthesizedAnswer = `According to Section 4.5 of the Technical Architecture Schema, cache replication is handled **asynchronously** across three geographical backup clusters.

It uses a modified **Least Recently Used (LRU)** caching strategy, and all replication transfers are optimized to complete within **15 milliseconds** to ensure high-speed ledger synchronization.`;
      } else if (
        lowerQuery.includes("ingress") ||
        lowerQuery.includes("gateway") ||
        lowerQuery.includes("websocket")
      ) {
        synthesizedAnswer = `In Section 2.1, all external API ingress traffic is managed by a secure load balancer.

Persistent client WebSockets are routed to a custom **Node.js connection manager** linked to a high-speed Redis-backed pub/sub cluster.`;
      } else {
        // Generative general summary RAG response
        synthesizedAnswer = `Based on the segments analyzed in **${document.name}**, here are the key findings matching your query:

* **Extracted Theme:** The document covers detailed operational protocols and standard compliance frameworks.
* **Context Reference:** "${primarySources[0].text.substring(0, 100)}..."
* **Suggested Action:** Let me know if you would like me to detail a specific clause or explain the integration of these policies in your active workspace!`;
      }
    }

    const aiMsg: MessageItem = {
      id: `ai-msg-${Date.now()}`,
      role: "assistant",
      content: synthesizedAnswer,
      sources: primarySources,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMsg]);
    setIsGenerating(false);
  };

  const isPdf = document.fileType === "pdf";

  return (
    <div id={`document-detail-page-${documentId}`} className="space-y-6">
      {/* Header back row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button
          id="btn-back-to-kb"
          onClick={handleBackToDocuments}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-indigo-600 transition-colors cursor-pointer group w-fit"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Knowledge Base</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-400">
            Current Scope:
          </span>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md">
            {tenant ? tenant.name : "Organization Corpus"}
          </span>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column (8 cols): Metadata Card & Chunk Browser */}
        <div className="lg:col-span-7 space-y-6">
          {/* Document Summary Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-6">
            {/* File Icon */}
            <div
              className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
                isPdf
                  ? "bg-rose-50 text-rose-600 border border-rose-100"
                  : "bg-blue-50 text-blue-600 border border-blue-100"
              }`}
            >
              <FileText className="w-7 h-7" />
            </div>

            {/* Title & Metadata details */}
            <div className="space-y-3 flex-1 min-w-0">
              <div>
                <h2
                  className="text-base font-bold text-gray-900 leading-snug truncate"
                  title={document.name}
                >
                  {document.name}
                </h2>
                <div className="flex flex-wrap items-center gap-2.5 mt-1.5">
                  <span className="font-mono text-xs uppercase font-bold text-gray-400 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded">
                    {document.fileType}
                  </span>
                  <DocumentStatus status={document.status} />
                </div>
              </div>

              {/* Attributes grid */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                    Uploaded By
                  </span>
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-700 truncate">
                      {uploader ? uploader.name : "System Pipeline"}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                    Ingested Date
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs font-medium text-gray-600">
                      {formatDate(document.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions Row */}
              <div className="flex flex-wrap gap-2 pt-3">
                <a
                  id="btn-download-original"
                  href={document.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-lg border border-gray-200 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Original</span>
                </a>
                <Button
                  id="btn-doc-uuid"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyChunk("doc-id-copy", document.id)}
                  className="text-gray-400 text-xs"
                >
                  {copiedId === "doc-id-copy" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Hash className="w-3.5 h-3.5" />
                  )}
                  <span>ID: {document.id}</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Segment Browser Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-500" />
                  <span>Semantic Knowledge Chunks</span>
                </h3>
                <p className="text-xs text-gray-500">
                  View and search the raw vectorized text blocks indexed from
                  the file
                </p>
              </div>
              <div className="text-[11px] font-bold text-indigo-600 bg-indigo-50/60 border border-indigo-100/50 px-2 py-0.5 rounded-md">
                {chunks.length} Extracted Blocks
              </div>
            </div>

            {/* Chunk Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                id="chunk-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search raw text blocks..."
                className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50/30"
              />
            </div>

            {/* Chunks List */}
            <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1">
              {filteredChunks.length > 0 ? (
                filteredChunks.map((chunk) => {
                  const isHighlighted = activeSources.some(
                    (s) => s.index === chunk.chunkIndex,
                  );
                  const isSelected = selectedChunkId === chunk.id;

                  return (
                    <div
                      key={chunk.id}
                      id={`chunk-block-${chunk.chunkIndex}`}
                      onClick={() =>
                        setSelectedChunkId(isSelected ? null : chunk.id)
                      }
                      className={`border rounded-lg p-4 transition-all duration-200 cursor-pointer ${
                        isHighlighted
                          ? "border-indigo-400 bg-indigo-50/30 shadow-sm ring-1 ring-indigo-400"
                          : isSelected
                            ? "border-gray-400 bg-gray-50/50"
                            : "border-gray-150 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide bg-indigo-50 border border-indigo-100/40 px-1.5 py-0.5 rounded">
                            Chunk #{chunk.chunkIndex}
                          </span>
                          <span className="text-[10px] font-medium text-gray-400">
                            {chunk.content.length} chars
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            id={`btn-copy-chunk-${chunk.chunkIndex}`}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyChunk(chunk.id, chunk.content);
                            }}
                            className="p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded transition-colors"
                            title="Copy text block"
                          >
                            {copiedId === chunk.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-gray-700 leading-relaxed font-sans font-medium whitespace-pre-wrap">
                        {chunk.content}
                      </p>

                      {isSelected && (
                        <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-medium text-gray-400">
                          <span className="flex items-center gap-1">
                            <Cpu className="w-3 h-3" /> Embeddings: Vector Layer
                            v1
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Parsed:{" "}
                            {formatDate(chunk.createdAt)}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-gray-400 border border-dashed border-gray-200 rounded-lg">
                  <Search className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-700">
                    No matching segments found
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Try clear your search query filter to see all segments
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column (5 cols): AI Grounded Playground */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-[650px]">
            {/* Playground Header */}
            <div className="bg-gray-50 border-b border-gray-200 p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-900 leading-none">
                    Document AI Copilot
                  </h3>
                  <p className="text-[10px] text-gray-500 mt-0.5 font-medium">
                    Grounded exclusively on this resource
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping" />
                <span>RAG Layer Live</span>
              </div>
            </div>

            {/* Conversation Log */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col gap-1.5 max-w-[85%] ${
                    msg.role === "user"
                      ? "ml-auto items-end"
                      : "mr-auto items-start"
                  }`}
                >
                  <div
                    className={`p-3.5 rounded-xl text-xs leading-relaxed font-medium ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white rounded-tr-none"
                        : "bg-gray-100 text-gray-800 rounded-tl-none border border-gray-150"
                    }`}
                  >
                    <p className="whitespace-pre-wrap font-sans">
                      {msg.content}
                    </p>

                    {/* Citations/Sources inline display */}
                    {msg.role === "assistant" &&
                      msg.sources &&
                      msg.sources.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-gray-200/50 flex flex-col gap-1.5">
                          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide block">
                            Grounded Citations:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {msg.sources.map((src) => (
                              <button
                                key={`cite-${src.index}`}
                                type="button"
                                onClick={() => {
                                  const element =
                                    window.document.getElementById(
                                      `chunk-block-${src.index}`,
                                    );
                                  if (element) {
                                    element.scrollIntoView({
                                      behavior: "smooth",
                                      block: "center",
                                    });
                                    element.classList.add(
                                      "ring-2",
                                      "ring-indigo-500",
                                      "duration-500",
                                    );
                                    setTimeout(() => {
                                      element.classList.remove(
                                        "ring-2",
                                        "ring-indigo-500",
                                      );
                                    }, 2000);
                                  }
                                }}
                                className="inline-flex items-center gap-1 text-[9px] font-semibold bg-white border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-300 px-1.5 py-0.5 rounded transition-colors"
                              >
                                <Layers className="w-2.5 h-2.5 text-gray-400" />
                                <span>Block #{src.index}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                  <span className="text-[9px] text-gray-400 font-bold px-1 uppercase">
                    {msg.role === "user" ? "You" : "DocuMind Agent"}
                  </span>
                </div>
              ))}

              {isGenerating && (
                <div className="flex flex-col gap-1.5 mr-auto items-start max-w-[85%]">
                  <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-150 text-xs text-gray-500 flex items-center gap-2.5 rounded-tl-none">
                    <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                    <span className="font-medium animate-pulse">
                      Consulting chunk indices & synthesizing response...
                    </span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Recommended quick clicks */}
            <div className="p-3 bg-gray-50/50 border-t border-gray-100 shrink-0 space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block px-1">
                Suggested Inquiries:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={`suggested-${idx}`}
                    id={`suggested-prompt-${idx}`}
                    type="button"
                    onClick={() => handleQueryAI(prompt)}
                    disabled={isGenerating}
                    className="text-[10px] font-semibold text-gray-600 bg-white border border-gray-200 hover:border-indigo-400 hover:text-indigo-700 px-2.5 py-1 rounded-lg shadow-2xs transition-colors cursor-pointer text-left whitespace-nowrap overflow-hidden max-w-full text-ellipsis disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Row */}
            <form
              id="ai-playground-input-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleQueryAI(inputMessage);
              }}
              className="p-3 border-t border-gray-200 bg-white shrink-0 flex items-center gap-2"
            >
              <input
                id="ai-chat-input"
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  document.status === "ready"
                    ? "Query this document..."
                    : "Index is not ready for chat"
                }
                disabled={isGenerating || document.status !== "ready"}
                className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
              <Button
                id="btn-send-chat"
                type="submit"
                size="sm"
                disabled={
                  isGenerating ||
                  !inputMessage.trim() ||
                  document.status !== "ready"
                }
                className="p-2 h-9 w-9 shrink-0 flex items-center justify-center"
              >
                <Send className="w-4 h-4 text-white" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
