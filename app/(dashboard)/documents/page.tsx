"use client";

import React, { useState } from "react";
import {
  FileText,
  Search,
  Trash2,
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  Upload,
  LayoutGrid,
  List,
  Eye,
} from "lucide-react";
import { PageHeader } from "../../../components/ui/PageHeader";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { UploadArea } from "../../../components/documents/UploadArea";
import { DocumentList } from "../../../components/documents/DocumentList";
import { trpc } from "@/lib/trpc/client";
import { uploadFileToSupabase } from "@/server/services/storage";

export default function DocumentsPage(): React.JSX.Element {
  // Set up local state for list of documents
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [viewType, setViewType] = useState<"table" | "grid">("table");
  const [showUploadArea, setShowUploadArea] = useState<boolean>(false);

  const utils = trpc.useUtils();

  const me = trpc.user.me.useQuery();
  const addDocumentMutation = trpc.documents.addDocumentsProcedure.useMutation({
    onSuccess: () => utils.documents.listDocuments.invalidate(),
  });

  const documents = trpc.documents.listDocuments.useQuery(undefined, {
    refetchInterval: (query) => {
      const hasProcessing = query.state.data?.some(
        (doc) => doc.status === "processing",
      );
      return hasProcessing ? 2000 : false; // poll every 2s while anything is processing, otherwise stop
    },
  });

  // Filter documents based on search and status filter
  const filteredDocs = documents.data?.filter((doc) => {
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // // Handle document deletion
  // const handleDeleteDoc = (id: string, name: string) => {
  //   // Check if user is a viewer
  //   if (currentUser.role === "viewer") {
  //     alert("Unauthorized! Viewers cannot delete documents in this workspace.");
  //     return;
  //   }

  //   if (
  //     confirm(
  //       `Are you sure you want to delete "${name}"? This will permanently remove it from the knowledge base.`,
  //     )
  //   )
  // };

  // Simulated upload function
  const handleSimulatedUpload = async (file: File) => {
    setIsUploading(true);

    try {
      const { publicUrl, filePath } = await uploadFileToSupabase(
        file,
        me.data?.orgId || "",
        file.name,
      );

      if (!documents) {
        throw new Error("Failed to upload document to Supabase.");
      }

      const document = addDocumentMutation.mutate({
        fileName: file.name,
        fileType: file.type,
        fileUrl: publicUrl,
        filePath: filePath,
      });

      console.log("Document added successfully:", document);
    } catch (error) {
      console.error("Error uploading document:", error);
    }

    setIsUploading(false);
  };

  const getStatusBadge = (status: "ready" | "processing" | "failed") => {
    switch (status) {
      case "ready":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Ready</span>
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100 animate-pulse">
            <Clock className="w-3.5 h-3.5" />
            <span>Processing</span>
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Failed</span>
          </span>
        );
    }
  };

  // const getUserName = (userId: string) => {
  //   const user = mockUsers.find((u) => u.id === userId);
  //   return user ? user.name : "System";
  // };

  return (
    <div id="documents-page" className="space-y-8 animate-fade-in">
      <PageHeader
        title="Knowledge Base"
        description="Index and manage the corpus of documents loaded into DocuMind AI."
        action={
          <Button
            id="btn-toggle-upload"
            onClick={() => setShowUploadArea(!showUploadArea)}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>{showUploadArea ? "Close Dropper" : "Add Document"}</span>
          </Button>
        }
      />

      {/* Expandable Upload Area */}
      {showUploadArea && (
        <div
          id="upload-area-wrapper"
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm animate-fade-in space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">
              Upload Knowledge Assets
            </h3>
            <span className="text-xs text-gray-400">
              PDF and DOCX formats accepted
            </span>
          </div>
          <UploadArea
            onFileSelect={(file) => {
              handleSimulatedUpload(file);
              setShowUploadArea(false);
            }}
            isUploading={isUploading}
          />
        </div>
      )}

      {/* Main card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Table filters */}
        <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left: Search input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
            <Input
              id="doc-search-input"
              type="text"
              placeholder="Search documents by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9.5 h-10"
            />
          </div>

          {/* Right: Status filter tabs & View Switcher */}
          <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">
                Status:
              </span>
              {[
                { id: "all", label: "All Files" },
                { id: "ready", label: "Ready" },
                { id: "processing", label: "Processing" },
                { id: "failed", label: "Failed" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  id={`filter-tab-${tab.id}`}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors whitespace-nowrap ${
                    statusFilter === tab.id
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm"
                      : "text-gray-500 hover:text-gray-900 bg-gray-50/50 hover:bg-gray-50 border border-transparent"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* View switcher */}
            <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1 bg-gray-50/50">
              <button
                id="btn-view-table"
                type="button"
                onClick={() => setViewType("table")}
                className={`p-1.5 rounded cursor-pointer transition-colors ${
                  viewType === "table"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-400 hover:text-gray-900"
                }`}
                title="Table view"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                id="btn-view-grid"
                type="button"
                onClick={() => setViewType("grid")}
                className={`p-1.5 rounded cursor-pointer transition-colors ${
                  viewType === "grid"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-400 hover:text-gray-900"
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content render container */}
        {viewType === "grid" ? (
          <div className="p-6">
            <DocumentList
              documents={filteredDocs || []}
              isLoading={isUploading}
              onViewDocument={(id) => {
                window.history.pushState({}, "", `/documents/${id}`);
                window.dispatchEvent(new Event("pushstate"));
              }}
              onDeleteDocument={(id) => {
                // const doc = documents.data?.find((d) => d.id === id);
                // if (doc) handleDeleteDoc(id, doc.name);
              }}
              onUploadClick={() => setShowUploadArea(true)}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            {(filteredDocs?.length ?? 0 > 0) ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Format</th>
                    <th className="px-6 py-4">Ingestion Status</th>
                    <th className="px-6 py-4">Uploaded By</th>
                    <th className="px-6 py-4">Upload Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredDocs?.map((doc) => (
                    <tr
                      key={doc.id}
                      id={`doc-row-${doc.id}`}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      {/* Document details */}
                      <td
                        className="px-6 py-4 cursor-pointer group/doc"
                        onClick={() => {
                          window.history.pushState(
                            {},
                            "",
                            `/dashboard/documents/${doc.id}`,
                          );
                          window.dispatchEvent(new Event("pushstate"));
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 group-hover/doc:bg-indigo-600 group-hover/doc:text-white transition-colors">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-gray-900 group-hover/doc:text-indigo-600 transition-colors truncate max-w-[200px] sm:max-w-xs">
                              {doc.name}
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium mt-0.5">
                              ID: {doc.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* File extension type */}
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-gray-500 uppercase font-semibold">
                          {doc.file_type}
                        </span>
                      </td>

                      {/* Badge */}
                      <td className="px-6 py-4">
                        {getStatusBadge(doc.status)}
                      </td>

                      {/* Uploader Name */}
                      <td className="px-6 py-4 text-xs font-semibold text-gray-600">
                        {doc.uploaded_by_user.name}
                      </td>

                      {/* Created Date */}
                      <td className="px-6 py-4 text-xs font-medium text-gray-500">
                        {new Date(doc.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      {/* Action buttons */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View details button */}
                          <button
                            id={`view-doc-${doc.id}`}
                            type="button"
                            onClick={() => {
                              window.history.pushState(
                                {},
                                "",
                                `/dashboard/documents/${doc.id}`,
                              );
                              window.dispatchEvent(new Event("pushstate"));
                            }}
                            className="p-1.5 hover:bg-indigo-50 text-gray-500 hover:text-indigo-600 rounded-lg transition-colors cursor-pointer"
                            title="View document details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Download button */}
                          <a
                            id={`download-doc-${doc.id}`}
                            href={doc.fileUrl}
                            className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-gray-900 rounded-lg transition-colors cursor-pointer"
                            title="Download document source"
                          >
                            <Download className="w-4 h-4" />
                          </a>

                          {/* Delete button with permissions gate */}
                          <button
                            id={`delete-doc-${doc.id}`}
                            type="button"
                            // onClick={() => handleDeleteDoc(doc.id, doc.name)}
                            className="p-1.5 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                            title="Delete document"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-20 text-center text-gray-400">
                <FileText className="w-14 h-14 text-gray-200 mx-auto mb-4" />
                <h4 className="text-base font-bold text-gray-900">
                  No documents indexed
                </h4>
                <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1 leading-relaxed">
                  We couldn&apos;t find any documents matching your current
                  criteria. Adjust your search or upload a new file.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
