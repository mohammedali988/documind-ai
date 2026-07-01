import React from "react";

export interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  action,
}: PageHeaderProps): React.JSX.Element {
  return (
    <div
      id="page-header-container"
      className="pb-5 border-b border-gray-200 mb-6"
    >
      <div
        id="page-header-wrapper"
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div id="page-header-text">
          <h1
            id="page-header-title"
            className="text-2xl font-bold tracking-tight text-gray-900"
          >
            {title}
          </h1>
          {description && (
            <p
              id="page-header-description"
              className="mt-1 text-sm text-gray-500"
            >
              {description}
            </p>
          )}
        </div>
        {action && (
          <div
            id="page-header-action"
            className="flex items-center gap-3 shrink-0"
          >
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
