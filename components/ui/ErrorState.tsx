import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Something went wrong",
  onRetry,
}: ErrorStateProps): React.JSX.Element {
  return (
    <div
      id="error-state-container"
      className="flex flex-col items-center justify-center text-center p-8 border border-red-100 rounded-xl bg-red-50/50 max-w-lg mx-auto"
    >
      <div
        id="error-state-icon-wrapper"
        className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4"
      >
        <AlertCircle
          id="error-state-icon"
          className="w-6 h-6"
          aria-hidden="true"
        />
      </div>
      <h3
        id="error-state-title"
        className="text-lg font-semibold text-gray-900 mb-1"
      >
        Error Encountered
      </h3>
      <p
        id="error-state-message"
        className="text-sm text-red-700 font-medium mb-6 max-w-sm"
      >
        {message}
      </p>
      {onRetry && (
        <button
          id="error-state-retry-button"
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-md transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Retry
        </button>
      )}
    </div>
  );
}
