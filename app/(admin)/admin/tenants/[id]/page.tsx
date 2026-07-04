"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Users, AlertTriangle, Activity } from "lucide-react";
import { PageHeader } from "../../../../../components/ui/PageHeader";
import { RoleBadge } from "../../../../../components/ui/RoleBadge";
import { PlanBadge } from "../../../../../components/ui/PlanBadge";
import { UsageBar } from "../../../../../components/billing/UsageBar";
import { Button } from "../../../../../components/ui/Button";
import { ErrorState } from "../../../../../components/ui/ErrorState";
import {
  mockTenants,
  mockUsers,
  mockDocuments,
  mockUsageStats,
  mockPlanLimits,
} from "../../../../../lib/mockData";
import {
  formatDate,
  truncateText,
  getStatusColor,
} from "../../../../../lib/utils";
import { useParams } from "next/navigation";

export default function TenantDetailPage(): React.JSX.Element {
  // Manage the suspended state of the tenant
  const [isSuspended, setIsSuspended] = useState(false);
  const router = useRouter();
  const params = useParams();

  const tenantId = params.id as string;

  // Find the tenant matching the parameter ID
  const tenant = mockTenants.find((t) => t.id === tenantId);

  // If tenant is not found, render the ErrorState component
  if (!tenant) {
    return (
      <div
        id="tenant-not-found-container"
        className="py-12 animate-fade-in pb-12"
      >
        <div className="mb-6 max-w-lg mx-auto">
          <Button
            id="btn-back-from-error"
            type="button"
            variant="ghost"
            onClick={() => router.push("/admin")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Admin Panel</span>
          </Button>
        </div>
        <ErrorState message={`Tenant with ID "${tenantId}" was not found.`} />
      </div>
    );
  }

  // Filter users belonging to this tenant
  const tenantUsers = mockUsers.filter((u) => u.tenantId === tenant.id);

  // Filter documents belonging to this tenant
  const tenantDocs = mockDocuments.filter((d) => d.tenantId === tenant.id);

  // Fetch or fallback usage stats
  const usage = mockUsageStats[tenant.id] || {
    documentsCount: tenantDocs.length,
    usersCount: tenantUsers.length,
    questionsThisMonth: 0,
    storageUsedGB: 0,
  };

  // Get current plan limits
  const planLimits = mockPlanLimits[tenant.plan];

  const handleToggleSuspension = () => {
    const nextSuspended = !isSuspended;
    setIsSuspended(nextSuspended);
    console.log(
      `[Tenant Admin Action] ID: ${tenant.id}, Name: ${tenant.name}, Suspended: ${nextSuspended}`,
    );
  };

  return (
    <div id="tenant-detail-page" className="space-y-8 animate-fade-in pb-16 p-12">
      {/* Back Button to list overview */}
      <div id="tenant-back-button-container">
        <Button
          id="btn-back-to-admin-panel"
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold px-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin Panel</span>
        </Button>
      </div>

      {/* Header section with Dynamic Status */}
      <PageHeader
        title={tenant.name}
        description={`Detailed operational overview and workspace parameters for ${tenant.name}.`}
        action={
          <div className="flex items-center gap-2">
            <PlanBadge plan={tenant.plan} />
            {isSuspended ? (
              <span
                id="tenant-suspended-badge"
                className="inline-flex items-center px-3 py-1 bg-red-50 border border-red-100 text-red-700 font-extrabold text-xs rounded-full uppercase tracking-wider shadow-sm"
              >
                Suspended
              </span>
            ) : (
              <span
                id="tenant-active-badge"
                className="inline-flex items-center px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 font-extrabold text-xs rounded-full uppercase tracking-wider shadow-sm"
              >
                Active
              </span>
            )}
          </div>
        }
      />

      {/* Grid of details: Tenant Profile and Resource Limits */}
      <div
        id="tenant-profile-grid"
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Left Column: Profile specifications card */}
        <div
          id="tenant-profile-card-wrapper"
          className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6"
        >
          <div>
            <h3 className="text-sm font-bold text-gray-950 uppercase tracking-wider">
              Tenant Profile
            </h3>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Corporate configuration parameters.
            </p>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium">
                Industry Vertical
              </span>
              <span className="font-bold text-gray-900">{tenant.industry}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium">
                Stripe Customer ID
              </span>
              <span className="font-mono font-bold text-gray-900 text-xs">
                {truncateText(tenant.stripeCustomerId || "N/A", 14)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Workspace ID</span>
              <span className="font-mono text-gray-600 text-xs">
                {tenant.id}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500 font-medium">Created On</span>
              <span className="font-semibold text-gray-900">
                {formatDate(new Date(tenant.createdAt))}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Limits and detailed stats */}
        <div
          id="tenant-limits-card-wrapper"
          className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6"
        >
          <div>
            <h3 className="text-sm font-bold text-gray-950 uppercase tracking-wider">
              Subscription Limits
            </h3>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Track real-time tenant resource consumption.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Visual Progress Trackers */}
            <div className="space-y-6">
              <UsageBar
                label="Documents Capacity"
                used={tenantDocs.length}
                limit={planLimits.maxDocuments}
              />
              <UsageBar
                label="Storage Quota"
                used={usage.storageUsedGB}
                limit={planLimits.maxStorageGB}
                unit="GB"
              />
            </div>

            {/* Static Numeric Indicators */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col justify-between">
                <div className="text-gray-400 p-1 bg-white border border-gray-200 rounded-lg w-fit">
                  <Users className="w-4 h-4" />
                </div>
                <div className="mt-4">
                  <span className="block text-2xl font-black text-gray-950 font-mono">
                    {tenantUsers.length}
                  </span>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                    Active Users
                  </span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col justify-between">
                <div className="text-gray-400 p-1 bg-white border border-gray-200 rounded-lg w-fit">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="mt-4">
                  <span className="block text-2xl font-black text-gray-950 font-mono">
                    {usage.questionsThisMonth}
                  </span>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                    Monthly Queries
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users Section */}
      <div id="tenant-users-table-section" className="space-y-4">
        <h3 className="text-base font-bold text-gray-950">Workspace Users</h3>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tenantUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-950">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {formatDate(new Date(user.createdAt))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div id="tenant-documents-table-section" className="space-y-4">
        <h3 className="text-base font-bold text-gray-950">
          Workspace Documents
        </h3>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Uploaded
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tenantDocs.map((doc) => {
                  const statusColor = getStatusColor(doc.status);
                  const formattedStatus =
                    doc.status.charAt(0).toUpperCase() + doc.status.slice(1);

                  return (
                    <tr
                      key={doc.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-950">
                        {doc.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-bold uppercase text-gray-500 font-mono">
                        {doc.fileType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusColor}`}
                        >
                          {formattedStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatDate(new Date(doc.createdAt))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Danger Zone Controls */}
      <div
        id="tenant-danger-zone-card"
        className="border border-red-200 rounded-xl p-6 bg-red-50/20 space-y-4"
      >
        <div className="flex items-start gap-3">
          <div className="p-1.5 bg-red-100 rounded-lg text-red-600 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-red-950">Danger Zone</h4>
            <p className="text-xs text-red-700/80 mt-0.5 leading-normal font-semibold">
              {isSuspended
                ? "Tenant is currently suspended. Activating will restore workspace access."
                : "This will prevent all users from accessing their workspace."}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-red-100/50 flex justify-end">
          {isSuspended ? (
            <Button
              id="btn-danger-activate"
              type="button"
              onClick={handleToggleSuspension}
              className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs py-2 px-4 rounded-xl"
            >
              Activate Tenant
            </Button>
          ) : (
            <Button
              id="btn-danger-suspend"
              type="button"
              variant="destructive"
              onClick={handleToggleSuspension}
              className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs py-2 px-4 rounded-xl"
            >
              Suspend Tenant
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
