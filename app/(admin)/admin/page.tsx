"use client";

import React, { useState } from "react";
import { Building2, Users, FileText, DollarSign } from "lucide-react";
import { PageHeader } from "../../../components/ui/PageHeader";
import { TenantStatsCard } from "../../../components/admin/TenantStatsCard";
import { TenantTable } from "../../../components/admin/TenantTable";
import { mockTenants, mockUsers, mockDocuments } from "../../../lib/mockData";

export default function AdminOverviewPage(): React.JSX.Element {
  const [suspendedTenants, setSuspendedTenants] = useState<string[]>([]);

  // Handle suspending a tenant
  const handleSuspend = (tenantId: string) => {
    setSuspendedTenants((prev) => {
      if (!prev.includes(tenantId)) {
        console.log(`Suspended tenant: ${tenantId}`);
        return [...prev, tenantId];
      }
      return prev;
    });
  };

  // Handle activating a tenant
  const handleActivate = (tenantId: string) => {
    setSuspendedTenants((prev) => {
      console.log(`Activated tenant: ${tenantId}`);
      return prev.filter((id) => id !== tenantId);
    });
  };

  return (
    <div
      id="admin-overview-workspace"
      className="space-y-8 animate-fade-in pb-12"
    >
      {/* Page Header with Admin Badge */}
      <PageHeader
        title="Admin Panel"
        description="Platform-wide overview and tenant management"
        action={
          <span
            id="super-admin-badge"
            className="inline-flex items-center px-3 py-1 bg-red-50 border border-red-100 text-red-700 font-extrabold text-xs rounded-full uppercase tracking-wider shadow-sm"
          >
            Super Admin
          </span>
        }
      />

      {/* Stats Cards Row */}
      <div
        id="admin-stats-grid"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <TenantStatsCard
          label="Total Tenants"
          value={mockTenants.length}
          icon={Building2}
          colorClass="bg-indigo-50 text-indigo-600"
        />
        <TenantStatsCard
          label="Total Users"
          value={mockUsers.length}
          icon={Users}
          colorClass="bg-blue-50 text-blue-600"
        />
        <TenantStatsCard
          label="Total Documents"
          value={mockDocuments.length}
          icon={FileText}
          colorClass="bg-amber-50 text-amber-600"
        />
        <TenantStatsCard
          label="Monthly Revenue"
          value="$628"
          icon={DollarSign}
          colorClass="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Tenant Management Table */}
      <div id="admin-tenant-section" className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-950">
            Registered Workspaces
          </h3>
          <span className="text-xs text-gray-500 font-semibold">
            Total of {mockTenants.length} tenants
          </span>
        </div>
        <TenantTable
          tenants={mockTenants}
          users={mockUsers}
          documents={mockDocuments}
          onSuspend={handleSuspend}
          onActivate={handleActivate}
          suspendedTenants={suspendedTenants}
        />
      </div>
    </div>
  );
}
