"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

export interface TenantStatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  colorClass?: string;
}

export function TenantStatsCard({
  label,
  value,
  icon: Icon,
  colorClass = "bg-indigo-50 text-indigo-600",
}: TenantStatsCardProps): React.JSX.Element {
  return (
    <div
      id={`tenant-stats-card-${label.toLowerCase().replace(/\s+/g, "-")}`}
      className="flex items-center gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div
        id="stats-icon-container"
        className={`flex items-center justify-center w-12 h-12 rounded-full shrink-0 ${colorClass}`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div id="stats-info-container" className="flex flex-col">
        <span
          id="stats-value"
          className="text-2xl font-bold text-gray-900 leading-none"
        >
          {value}
        </span>
        <span
          id="stats-label"
          className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1"
        >
          {label}
        </span>
      </div>
    </div>
  );
}
