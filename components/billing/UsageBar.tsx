"use client";

import React, { useEffect, useState } from "react";
import { calculateUsagePercentage } from "../../lib/utils";

export interface UsageBarProps {
  label: string;
  used: number;
  limit: number;
  unit?: string;
  colorClass?: string;
}

export function UsageBar({
  label,
  used,
  limit,
  unit = "",
  colorClass,
}: UsageBarProps): React.JSX.Element {
  const percentage = calculateUsagePercentage(used, limit);
  const [fillWidth, setFillWidth] = useState(0);

  // Trigger animation after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setFillWidth(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  // Determine bar color if not explicitly provided
  let barColor = colorClass || "bg-indigo-600";
  if (!colorClass) {
    if (percentage >= 90) {
      barColor = "bg-red-500";
    } else if (percentage >= 70) {
      barColor = "bg-amber-500";
    }
  }

  // Display text for limit representation
  const formatLimit =
    limit === Infinity || limit >= 999999 ? "∞" : limit.toLocaleString("en-US");
  const formatUsed = used.toLocaleString("en-US");

  return (
    <div
      id={`usage-bar-container-${label.toLowerCase().replace(/\s+/g, "-")}`}
      className="space-y-2"
    >
      {/* Label and detailed textual usage on top */}
      <div className="flex justify-between items-center text-sm">
        <span className="font-semibold text-gray-700">{label}</span>
        <span className="text-xs text-gray-500 font-medium font-mono">
          {formatUsed} / {formatLimit} {unit}
        </span>
      </div>

      {/* Progress Track */}
      <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-100">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`}
          style={{ width: `${Math.min(fillWidth, 100)}%` }}
        />
      </div>

      {/* Percentage text below progress track */}
      <div className="text-right">
        <span className="text-xs font-semibold text-gray-500 font-mono">
          {percentage}%
        </span>
      </div>
    </div>
  );
}
