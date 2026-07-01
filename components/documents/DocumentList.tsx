import React from "react";
import { FileText } from "lucide-react";
import { Document } from "../../types";
import { DocumentCard } from "./DocumentCard";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { ErrorState } from "../ui/ErrorState";
import { EmptyState } from "../ui/EmptyState";

export interface DocumentListProps {
  documents: Document[];
  isLoading?: boolean;
  error?: string | null;
  onViewDocument: (id: string) => void;
  onDeleteDocument: (id: string) => void;
  onUploadClick?: () => void;
}

export function DocumentList({
  documents,
  isLoading = false,
  error = null,
  onViewDocument,
  onDeleteDocument,
  onUploadClick,
}: DocumentListProps): React.JSX.Element {
  if (isLoading) {
    return (
      <div
        id="document-list-loading"
        className="py-12 flex justify-center items-center"
      >
        <LoadingSpinner message="Loading documents..." />
      </div>
    );
  }

  if (error) {
    return (
      <div id="document-list-error" className="py-8">
        <ErrorState message={error} />
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <div id="document-list-empty" className="py-8">
        <EmptyState
          icon={FileText}
          title="No documents yet"
          description="Upload your first document to get started"
          actionLabel="Upload Document"
          onAction={onUploadClick}
        />
      </div>
    );
  }

  return (
    <div
      id="document-grid"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {documents.map((doc) => (
        <div key={doc.id} id={`document-card-wrapper-${doc.id}`}>
          <DocumentCard
            document={doc}
            onView={() => onViewDocument(doc.id)}
            onDelete={() => onDeleteDocument(doc.id)}
          />
        </div>
      ))}
    </div>
  );
}
