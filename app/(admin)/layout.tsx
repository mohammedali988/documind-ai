import React from "react";
import { redirect } from "next/navigation";
import { auth0, parseClaims } from "@/lib/auth";

export interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps): Promise<React.JSX.Element> {
  const session = await auth0.getSession();
  if (!session?.user) redirect("/api/auth/login");

  const claims = parseClaims(session.user);
  if (!claims.isSuperAdmin) redirect("/unauthorized");

  return (
    <div id="dashboard-layout" className="flex min-h-screen bg-gray-50">
      {/* Page Content */}
      <main
        id="dashboard-page-container"
        className="flex-1 p-6 md:p-8 overflow-y-auto"
      >
        {children}
      </main>
    </div>
  );
}
