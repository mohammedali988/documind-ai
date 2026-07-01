import React from "react";
import { FileText, FileType, MessageSquare } from "lucide-react";
import { Document, Conversation } from "../../types";
import { formatDate, getStatusColor, truncateText } from "../../lib/utils";

export interface RecentActivityProps {
  documents: Document[];
  conversations: Conversation[];
}

export function RecentActivity({
  documents = [],
  conversations = [],
}: RecentActivityProps): React.JSX.Element {
  // Get last 3 items
  const recentDocs = [...documents]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 3);

  const recentConvs = [...conversations]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 3);

  return (
    <div
      id="recent-activity-section"
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full"
    >
      {/* Left Column: Recent Documents */}
      <div id="recent-documents-column" className="flex flex-col">
        <h3
          id="recent-documents-title"
          className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2"
        >
          Recent Documents
        </h3>
        <div
          id="recent-documents-card"
          className="flex-1 bg-white border border-gray-200 rounded-xl p-5 shadow-sm min-h-[280px] flex flex-col justify-between"
        >
          {recentDocs.length === 0 ? (
            <div
              id="recent-documents-empty"
              className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-100 rounded-lg bg-gray-50/50"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                No documents yet
              </h4>
              <p className="text-xs text-gray-500 max-w-[240px]">
                Upload PDF or DOCX files to start using your knowledge base.
              </p>
            </div>
          ) : (
            <ul
              id="recent-documents-list"
              className="divide-y divide-gray-100 flex-1 flex flex-col justify-between"
            >
              {recentDocs.map((doc) => {
                const IsPdf = doc.fileType === "pdf";
                return (
                  <li
                    key={doc.id}
                    id={`recent-doc-item-${doc.id}`}
                    className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        id={`recent-doc-icon-wrapper-${doc.id}`}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          IsPdf
                            ? "bg-rose-50 text-rose-600"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {IsPdf ? (
                          <FileText className="w-5 h-5" />
                        ) : (
                          <FileType className="w-5 h-5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p
                          id={`recent-doc-name-${doc.id}`}
                          className="text-sm font-semibold text-gray-900 truncate"
                          title={doc.name}
                        >
                          {truncateText(doc.name, 35)}
                        </p>
                        <p
                          id={`recent-doc-date-${doc.id}`}
                          className="text-xs text-gray-400 mt-0.5"
                        >
                          Uploaded on {formatDate(doc.createdAt)}
                        </p>
                      </div>
                    </div>
                    <span
                      id={`recent-doc-status-${doc.id}`}
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(
                        doc.status,
                      )}`}
                    >
                      {doc.status}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Right Column: Recent Conversations */}
      <div id="recent-conversations-column" className="flex flex-col">
        <h3
          id="recent-conversations-title"
          className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2"
        >
          Recent Conversations
        </h3>
        <div
          id="recent-conversations-card"
          className="flex-1 bg-white border border-gray-200 rounded-xl p-5 shadow-sm min-h-[280px] flex flex-col justify-between"
        >
          {recentConvs.length === 0 ? (
            <div
              id="recent-conversations-empty"
              className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-100 rounded-lg bg-gray-50/50"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                No conversations
              </h4>
              <p className="text-xs text-gray-500 max-w-[240px]">
                Ask questions and interact with your workspace documents.
              </p>
            </div>
          ) : (
            <ul
              id="recent-conversations-list"
              className="divide-y divide-gray-100 flex-1 flex flex-col justify-between"
            >
              {recentConvs.map((conv) => (
                <li
                  key={conv.id}
                  id={`recent-conv-item-${conv.id}`}
                  className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      id={`recent-conv-icon-wrapper-${conv.id}`}
                      className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0"
                    >
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p
                        id={`recent-conv-title-${conv.id}`}
                        className="text-sm font-semibold text-gray-900 truncate"
                        title={conv.title}
                      >
                        {truncateText(conv.title, 40)}
                      </p>
                      <p
                        id={`recent-conv-date-${conv.id}`}
                        className="text-xs text-gray-400 mt-0.5"
                      >
                        Last active {formatDate(conv.createdAt)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
