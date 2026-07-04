"use client";

import React from "react";
import { FileText, Users, MessageSquare, HardDrive, Plus } from "lucide-react";
import { PageHeader } from "../../../components/ui/PageHeader";
import { StatsCard } from "../../../components/dashboard/StatsCard";
import { RecentActivity } from "../../../components/dashboard/RecentActivity";
import { Button } from "../../../components/ui/Button";
import {
  mockUsers,
  mockTenants,
  mockUsageStats,
  mockDocuments,
  mockConversations,
  mockPlanLimits,
} from "../../../lib/mockData";
import { useRouter } from "next/navigation";

export default function DashboardOverviewPage(): React.JSX.Element {
  const currentUser = mockUsers[0];
  const currentTenant = mockTenants[0];
  const usageStats = mockUsageStats[currentTenant.id];
  const planLimits = mockPlanLimits[currentTenant.plan];
  const router = useRouter();

  const filteredDocuments = mockDocuments.filter(
    (doc) => doc.tenantId === currentTenant.id,
  );
  const filteredConversations = mockConversations.filter(
    (conv) => conv.tenantId === currentTenant.id,
  );

  const userFirstName = currentUser.name.split(" ")[0];

  const handleUploadClick = () => {
    router.push("/documents");
  };

  const handleNewChatClick = () => {
    router.push("/chat");
  };

  return (
    <div id="dashboard-overview-page" className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <PageHeader
        title={`Welcome back, ${userFirstName}`}
        description="Here's what's happening in your workspace today."
      />

      {/* Grid of Stats Cards */}
      <div
        id="stats-cards-grid"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
      >
        <StatsCard
          title="Total Documents"
          value={usageStats.documentsCount}
          icon={FileText}
          description={`of ${planLimits.maxDocuments} allowed`}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Team Members"
          value={usageStats.usersCount}
          icon={Users}
          description={`of ${planLimits.maxUsers} allowed`}
        />
        <StatsCard
          title="Questions This Month"
          value={usageStats.questionsThisMonth}
          icon={MessageSquare}
          description={`of ${planLimits.maxQuestionsPerMonth} allowed`}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Storage Used"
          value={`${usageStats.storageUsedGB} GB`}
          icon={HardDrive}
          description={`of ${planLimits.maxStorageGB}GB allowed`}
        />
      </div>

      {/* Recent Activity component */}
      <RecentActivity
        documents={filteredDocuments}
        conversations={filteredConversations}
      />

      {/* Quick Actions section */}
      <div
        id="quick-actions-section"
        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
      >
        <h3
          id="quick-actions-title"
          className="text-sm font-bold text-gray-900 mb-4"
        >
          Quick Actions
        </h3>
        <div
          id="quick-actions-buttons"
          className="flex flex-col sm:flex-row gap-3"
        >
          <Button
            id="btn-quick-upload"
            onClick={handleUploadClick}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Document</span>
          </Button>
          <Button
            id="btn-quick-chat"
            variant="outline"
            onClick={handleNewChatClick}
            className="flex items-center gap-2 border-gray-300 hover:bg-gray-50 text-gray-700"
          >
            <MessageSquare className="w-4 h-4" />
            <span>New Conversation</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
