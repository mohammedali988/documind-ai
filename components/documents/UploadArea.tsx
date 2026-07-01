"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, AlertCircle } from "lucide-react";
import { LoadingSpinner } from "../ui/LoadingSpinner";

export interface UploadAreaProps {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
  acceptedTypes?: string[]; // default: ['.pdf', '.docx']
}

export function UploadArea({
  onFileSelect,
  isUploading = false,
  acceptedTypes = [".pdf", ".docx"],
}: UploadAreaProps): React.JSX.Element {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const validateAndSelectFile = (file: File) => {
    setError(null);
    const fileName = file.name.toLowerCase();
    const isValidType = acceptedTypes.some((ext) => fileName.endsWith(ext));

    if (!isValidType) {
      setError(
        `Invalid file type. Only ${acceptedTypes.join(" and ")} files are accepted.`,
      );
      return;
    }

    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (isUploading) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSelectFile(e.target.files[0]);
    }
  };

  const onAreaClick = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  return (
    <div id="upload-area-container" className="w-full">
      <div
        id="upload-dropzone"
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onAreaClick}
        className={`w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
          isDragActive
            ? "border-indigo-500 bg-indigo-50/50"
            : "border-gray-300 bg-white hover:bg-gray-50/50 hover:border-gray-400"
        } ${isUploading ? "opacity-80 cursor-not-allowed" : ""}`}
      >
        <input
          id="upload-file-input"
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={acceptedTypes.join(",")}
          onChange={handleFileChange}
          disabled={isUploading}
        />

        {isUploading ? (
          <div
            id="upload-progress-state"
            className="flex flex-col items-center space-y-3 py-4"
          >
            <LoadingSpinner message="Uploading..." />
          </div>
        ) : (
          <div
            id="upload-idle-state"
            className="flex flex-col items-center space-y-3"
          >
            <div
              id="upload-icon-circle"
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isDragActive
                  ? "bg-indigo-100 text-indigo-600"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <UploadCloud className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <p
                id="upload-prompt"
                className="text-sm font-semibold text-gray-900"
              >
                Drag and drop your files here
              </p>
              <p
                id="upload-browse"
                className="text-xs text-indigo-600 font-semibold hover:text-indigo-700"
              >
                or click to browse
              </p>
            </div>
            <p
              id="upload-supported-formats"
              className="text-xs text-gray-400 font-medium"
            >
              Accepted file types: {acceptedTypes.join(", ")}
            </p>
          </div>
        )}
      </div>

      {error && (
        <div
          id="upload-error-message"
          className="mt-3 flex items-center gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-lg p-3 animate-fade-in"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}
    </div>
  );
}
