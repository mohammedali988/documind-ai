import React from "react";
import { UserRole } from "../../types";
import { getRoleColor } from "../../lib/utils";

export interface RoleBadgeProps {
  role: UserRole;
}

export function RoleBadge({ role }: RoleBadgeProps): React.JSX.Element {
  const colorClasses = getRoleColor(role);

  // Capitalize the first letter of the role
  const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <span
      id={`role-badge-${role}`}
      className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${colorClasses}`}
    >
      {formattedRole}
    </span>
  );
}
