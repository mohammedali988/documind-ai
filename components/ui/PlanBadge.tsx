import React from "react";
import { PlanType } from "../../types";
import { getPlanColor } from "../../lib/utils";

export interface PlanBadgeProps {
  plan: PlanType;
}

export function PlanBadge({ plan }: PlanBadgeProps): React.JSX.Element {
  const colorClasses = getPlanColor(plan);

  // Capitalize the first letter of the plan name
  const formattedPlan = plan.charAt(0).toUpperCase() + plan.slice(1);

  return (
    <span
      id={`plan-badge-${plan}`}
      className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border tracking-wide uppercase ${colorClasses}`}
    >
      {formattedPlan}
    </span>
  );
}
