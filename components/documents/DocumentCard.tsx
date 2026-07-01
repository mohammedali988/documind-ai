import React from "react";
import { Eye, Trash2, FileText, FileType } from "lucide-react";
import { Document } from "../../types";
import { formatDate, getStatusColor, truncateText } from "../../lib/utils";
import { mockUsers } from "../../lib/mockData";
import { Button } from "../ui/Button";

export interface DocumentCardProps {
  document: Document;
  onView?: () => void;
  onDelete?: () => void;
}

export function DocumentCard({
  document,
  onView,
  onDelete,
}: DocumentCardProps): React.JSX.Element {
  const isPdf = document.fileType === "pdf";

  // Find the uploader's name
  const uploader = mockUsers.find((u) => u.id === document.uploadedBy);
  const uploaderName = uploader ? uploader.name : "Unknown User";

  return (
    <div
      id={`document-card-${document.id}`}
      className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full"
    >
      {/* Top Section */}
      <div
        id={`document-card-top-${document.id}`}
        className="flex items-start justify-between gap-3 mb-4"
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Left: file type icon in colored circle */}
          <div
            id={`document-icon-wrapper-${document.id}`}
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              isPdf ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-600"
            }`}
          >
            {isPdf ? (
              <FileText className="w-5 h-5" />
            ) : (
              <FileType className="w-5 h-5" />
            )}
          </div>

          {/* Center: document name, uploaded by, date */}
          <div className="min-w-0">
            <h4
              id={`document-title-${document.id}`}
              className="text-sm font-bold text-gray-900 truncate"
              title={document.name}
            >
              {truncateText(document.name, 40)}
            </h4>
            <p
              id={`document-uploader-${document.id}`}
              className="text-xs text-gray-500 mt-0.5 font-medium"
            >
              By {uploaderName}
            </p>
            <p
              id={`document-date-${document.id}`}
              className="text-[11px] text-gray-400 mt-0.5"
            >
              {formatDate(document.createdAt)}
            </p>
          </div>
        </div>

        {/* Right: status badge */}
        <span
          id={`document-status-${document.id}`}
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(
            document.status,
          )}`}
        >
          {document.status}
        </span>
      </div>

      {/* Bottom Section: action buttons */}
      <div
        id={`document-actions-${document.id}`}
        className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100 mt-auto"
      >
        <Button
          id={`btn-document-view-${document.id}`}
          variant="outline"
          size="sm"
          onClick={onView}
          className="flex-1 flex items-center justify-center gap-1.5 border-gray-200 text-gray-700 hover:bg-gray-50 text-xs"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View</span>
        </Button>
        <Button
          id={`btn-document-delete-${document.id}`}
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="flex-1 flex items-center justify-center gap-1.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700 text-xs"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </Button>
      </div>
    </div>
  );
}
