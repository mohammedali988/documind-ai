import React from "react";
import { Sidebar } from "../../components/dashboard/Sidebar";
import { Header } from "../../components/dashboard/Header";
import { mockUsers, mockTenants } from "../../lib/mockData";

export interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps): React.JSX.Element {
  // Use the first user and tenant from mock data as instructed
  const currentUser = mockUsers[0];
  const currentTenant = mockTenants[0];

  return (
    <div id="dashboard-layout" className="flex min-h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <Sidebar currentUser={currentUser} currentTenant={currentTenant} />

      {/* Main Content Area */}
      <div
        id="dashboard-main-content"
        className="flex flex-col flex-1 pl-64 min-h-screen"
      >
        {/* Header */}
        <Header title="Dashboard" currentUser={currentUser} />

        {/* Page Content */}
        <main
          id="dashboard-page-container"
          className="flex-1 p-6 md:p-8 overflow-y-auto"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
