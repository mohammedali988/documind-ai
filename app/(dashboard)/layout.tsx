import React from "react";
import { Sidebar } from "../../components/dashboard/Sidebar";
import { Header } from "../../components/dashboard/Header";
import { auth0 } from "../../lib/auth";
import { redirect } from "next/navigation";
import { parseClaims } from "../../lib/auth";
import type { User, Tenant } from "../../types";
import { supabaseAdmin } from "@/lib/supabase";

export interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps): Promise<React.JSX.Element> {
  const session = await auth0.getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const claims = parseClaims(session.user);

  if (!claims.role || !claims.orgId) {
    redirect("/unauthorized");
  }

  const currentUser: User = {
    id: claims.sub,
    email: claims.email,
    name: claims.name,
    role: claims.role,
    tenantId: claims.orgId,
    createdAt: new Date(),
  };

  const { data: tenantRow } = await supabaseAdmin
    .from("tenants")
    .select("*")
    .eq("id", claims.orgId)
    .single();

  const currentTenant: Tenant = {
    id: claims.orgId,
    name: tenantRow?.name ?? claims.orgName ?? "Workspace",
    industry: tenantRow?.industry ?? "unspecified",
    plan: tenantRow?.plan ?? "free",
    stripeCustomerId: tenantRow?.stripe_customer_id ?? "",
    createdAt: tenantRow?.created_at
      ? new Date(tenantRow.created_at)
      : new Date(),
  };

  return (
    <div id="dashboard-layout" className="flex min-h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <Sidebar
        currentUser={currentUser}
        currentTenant={currentTenant}
        isSuperAdmin={claims.isSuperAdmin}
      />

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
