import React from "react";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
}: StatsCardProps): React.JSX.Element {
  return (
    <div
      id={`stats-card-${title.toLowerCase().replace(/\s+/g, "-")}`}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-gray-300 transition-all duration-200"
    >
      <div id="stats-card-top" className="flex items-start justify-between">
        <div id="stats-card-info" className="flex flex-col gap-1">
          <span
            id="stats-card-title"
            className="text-xs font-semibold uppercase tracking-wider text-gray-500"
          >
            {title}
          </span>
          <span
            id="stats-card-value"
            className="text-2xl font-bold text-gray-900 tracking-tight mt-1"
          >
            {value}
          </span>
        </div>
        <div
          id="stats-card-icon-wrapper"
          className="flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100/50"
        >
          <Icon id="stats-card-icon" className="w-5 h-5" aria-hidden="true" />
        </div>
      </div>

      {(description || trend) && (
        <div
          id="stats-card-bottom"
          className="flex items-center gap-2 mt-4 text-xs"
        >
          {trend && (
            <span
              id="stats-card-trend"
              className={`flex items-center gap-0.5 font-semibold px-2 py-0.5 rounded-full ${
                trend.isPositive
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {trend.isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              {trend.value}%
            </span>
          )}
          {description && (
            <span
              id="stats-card-description"
              className="text-gray-500 font-medium truncate"
            >
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
