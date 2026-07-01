import React from "react";
import { Loader2 } from "lucide-react";

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
  fullPage?: boolean;
}

export function LoadingSpinner({
  size = "md",
  message,
  fullPage = false,
}: LoadingSpinnerProps): React.JSX.Element {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const spinnerElement = (
    <div
      id="loading-spinner-container"
      className="flex flex-col items-center justify-center gap-3"
    >
      <Loader2
        id="loading-spinner-icon"
        className={`${sizeClasses[size]} animate-spin text-indigo-600`}
        aria-hidden="true"
      />
      {message && (
        <p
          id="loading-spinner-message"
          className="text-sm font-medium text-gray-500"
        >
          {message}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div
        id="loading-spinner-fullpage"
        className="fixed inset-0 z-50 flex items-center justify-center bg-white"
      >
        {spinnerElement}
      </div>
    );
  }

  return spinnerElement;
}
