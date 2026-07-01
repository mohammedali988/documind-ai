"use client";

import React from "react";
import { Building2 } from "lucide-react";
import { Tenant, User, Document } from "../../types";
import { PlanBadge } from "../ui/PlanBadge";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { formatDate } from "../../lib/utils";

export interface TenantTableProps {
  tenants: Tenant[];
  users: User[];
  documents: Document[];
  onSuspend: (tenantId: string) => void;
  onActivate: (tenantId: string) => void;
  suspendedTenants: string[];
}

export function TenantTable({
  tenants,
  users,
  documents,
  onSuspend,
  onActivate,
  suspendedTenants,
}: TenantTableProps): React.JSX.Element {
  if (!tenants || tenants.length === 0) {
    return (
      <div
        id="tenant-table-empty"
        className="py-8 bg-white border border-gray-200 rounded-xl shadow-sm"
      >
        <EmptyState
          icon={Building2}
          title="No tenants found"
          description="There are no workspace tenants registered on the platform."
        />
      </div>
    );
  }

  return (
    <div
      id="tenant-table-card"
      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
    >
      <div id="tenant-table-scrollable" className="overflow-x-auto">
        <table
          id="tenant-table"
          className="w-full min-w-[800px] border-collapse text-left"
        >
          <thead>
            <tr
              id="tenant-table-header-row"
              className="bg-gray-50 border-b border-gray-100"
            >
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Plan
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Users
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Documents
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody id="tenant-table-body" className="divide-y divide-gray-100">
            {tenants.map((tenant) => {
              const isSuspended = suspendedTenants.includes(tenant.id);
              const tenantUsersCount = users.filter(
                (u) => u.tenantId === tenant.id,
              ).length;
              const tenantDocsCount = documents.filter(
                (d) => d.tenantId === tenant.id,
              ).length;

              return (
                <tr
                  key={tenant.id}
                  id={`tenant-row-${tenant.id}`}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  {/* Company Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-950">
                        {tenant.name}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        {tenant.industry}
                      </span>
                    </div>
                  </td>

                  {/* PlanBadge */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <PlanBadge plan={tenant.plan} />
                  </td>

                  {/* Users count */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium font-mono">
                    {tenantUsersCount}
                  </td>

                  {/* Documents count */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium font-mono">
                    {tenantDocsCount}
                  </td>

                  {/* Joined Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {formatDate(new Date(tenant.createdAt))}
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isSuspended ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-100">
                        Suspended
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        Active
                      </span>
                    )}
                  </td>

                  {/* Actions Column */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {isSuspended ? (
                      <Button
                        id={`btn-activate-tenant-${tenant.id}`}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onActivate(tenant.id)}
                        className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-bold text-xs"
                      >
                        Activate
                      </Button>
                    ) : (
                      <Button
                        id={`btn-suspend-tenant-${tenant.id}`}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onSuspend(tenant.id)}
                        className="border-red-200 text-red-700 hover:bg-red-50 font-bold text-xs"
                      >
                        Suspend
                      </Button>
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
