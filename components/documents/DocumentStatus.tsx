import React from "react";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { DocumentStatus as DocStatusType } from "../../types";
import { getStatusColor } from "../../lib/utils";

export interface DocumentStatusProps {
  status: DocStatusType;
}

export function DocumentStatus({
  status,
}: DocumentStatusProps): React.JSX.Element {
  const badgeColors = getStatusColor(status);

  let Icon = Clock;
  let label = "Processing";

  switch (status) {
    case "ready":
      Icon = CheckCircle;
      label = "Ready";
      break;
    case "failed":
      Icon = XCircle;
      label = "Failed";
      break;
    case "processing":
    default:
      Icon = Clock;
      label = "Processing";
      break;
  }

  return (
    <span
      id={`document-status-pill-${status}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeColors}`}
    >
      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
      <span>{label}</span>
    </span>
  );
}
