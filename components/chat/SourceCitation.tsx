"use client";

import React from "react";
import { BookOpen, FileText } from "lucide-react";
import { truncateText } from "../../lib/utils";

export interface SourceCitationProps {
  sources: string[];
}

export function SourceCitation({
  sources,
}: SourceCitationProps): React.JSX.Element | null {
  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <div
      id="source-citations-container"
      className="flex flex-col gap-1.5 mt-2 pt-2 border-t border-gray-100"
    >
      <div
        id="sources-label-container"
        className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider"
      >
        <BookOpen className="w-3 h-3 text-gray-400" />
        <span>Sources</span>
      </div>
      <div
        id="sources-scroll-row"
        className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
      >
        {sources.map((src, idx) => (
          <div
            key={`source-pill-${idx}`}
            className="flex-shrink-0 inline-flex items-center gap-1 bg-gray-50 border border-gray-200 text-gray-600 px-2.5 py-1 rounded-md text-[10px] font-semibold max-w-[200px]"
            title={src}
          >
            <FileText className="w-3 h-3 text-gray-400 flex-shrink-0" />
            <span className="truncate">{truncateText(src, 50)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
