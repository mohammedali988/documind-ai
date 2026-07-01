"use client";

import React from "react";
import { Trash2, Users } from "lucide-react";
import { User, UserRole } from "../../types";
import { formatDate, getInitials } from "../../lib/utils";
import { RoleBadge } from "../ui/RoleBadge";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";

export interface TeamTableProps {
  users: User[];
  currentUserId: string;
  onChangeRole: (userId: string, newRole: UserRole) => void;
  onRemoveUser: (userId: string) => void;
}

export function TeamTable({
  users,
  currentUserId,
  onChangeRole,
  onRemoveUser,
}: TeamTableProps): React.JSX.Element {
  if (!users || users.length === 0) {
    return (
      <div id="team-table-empty-container" className="py-12">
        <EmptyState
          icon={Users}
          title="No team members found"
          description="There are no team members in this workspace yet. Invite members to collaborate."
        />
      </div>
    );
  }

  return (
    <div
      id="team-table-card"
      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
    >
      <div id="team-table-wrapper" className="overflow-x-auto">
        <table
          id="team-members-table"
          className="w-full min-w-[700px] border-collapse text-left"
        >
          <thead>
            <tr
              id="team-table-header-row"
              className="bg-gray-50 border-b border-gray-100"
            >
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-[40%]">
                Member
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-[20%]">
                Role
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-[20%]">
                Joined
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right w-[20%]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody id="team-table-body" className="divide-y divide-gray-100">
            {users.map((user) => {
              const isSelf = user.id === currentUserId;
              const initials = getInitials(user.name);

              return (
                <tr
                  key={user.id}
                  id={`user-row-${user.id}`}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  {/* Member column (avatar + name + email) */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div
                        id={`user-avatar-${user.id}`}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-semibold text-sm shrink-0 shadow-sm"
                        aria-hidden="true"
                      >
                        {initials}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span
                          id={`user-name-${user.id}`}
                          className="text-sm font-semibold text-gray-900 truncate"
                        >
                          {user.name}
                        </span>
                        <span
                          id={`user-email-${user.id}`}
                          className="text-xs text-gray-500 truncate"
                        >
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Role column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <RoleBadge role={user.role} />
                  </td>

                  {/* Joined column */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                    {formatDate(new Date(user.createdAt))}
                  </td>

                  {/* Actions column */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {isSelf ? (
                      <span
                        id={`user-self-label-${user.id}`}
                        className="inline-flex items-center px-2 py-1 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-md"
                      >
                        You (Owner)
                      </span>
                    ) : (
                      <div className="inline-flex items-center gap-3">
                        <select
                          id={`select-role-${user.id}`}
                          value={user.role}
                          onChange={(e) =>
                            onChangeRole(user.id, e.target.value as UserRole)
                          }
                          className="block w-32 px-2 py-1.5 text-xs font-semibold bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 cursor-pointer transition-colors"
                        >
                          <option value="viewer">Viewer</option>
                          <option value="manager">Manager</option>
                          <option value="admin">Admin</option>
                        </select>
                        <Button
                          id={`btn-remove-member-${user.id}`}
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => onRemoveUser(user.id)}
                          className="flex items-center justify-center gap-1.5 h-8 px-2.5 text-xs font-bold transition-all"
                          title="Remove user from team"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
