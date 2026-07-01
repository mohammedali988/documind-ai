import React from "react";
import { LucideIcon } from "lucide-react";

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps): React.JSX.Element {
  return (
    <div
      id="empty-state-container"
      className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-gray-200 rounded-xl bg-white max-w-lg mx-auto"
    >
      <div
        id="empty-state-icon-wrapper"
        className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 mb-4"
      >
        <Icon id="empty-state-icon" className="w-6 h-6" aria-hidden="true" />
      </div>
      <h3
        id="empty-state-title"
        className="text-lg font-semibold text-gray-900 mb-1"
      >
        {title}
      </h3>
      <p
        id="empty-state-description"
        className="text-sm text-gray-500 mb-6 max-w-sm"
      >
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          id="empty-state-action-button"
          type="button"
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md transition-colors cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
