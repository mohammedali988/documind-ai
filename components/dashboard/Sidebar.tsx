"use client";
import React, { useEffect } from "react";
import {
  Brain,
  LayoutDashboard,
  FileText,
  MessageSquare,
  Users,
  CreditCard,
  Settings,
} from "lucide-react";
import { User, Tenant } from "../../types";
import { getInitials } from "../../lib/utils";
import { PlanBadge } from "../ui/PlanBadge";
import { RoleBadge } from "../ui/RoleBadge";
import { usePathname } from "next/navigation";
import Link from "next/link";

// A lightweight, highly compatible hook that mimics Next.js usePathname
// using the browser's window.location. This ensures standard SPA and preview compatibility.
// function usePathname(): string {
//   // const [pathname, setPathname] = useState<string>(
//   //   typeof window !== "undefined" ? window.location.pathname : "/",
//   // );

//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const handleLocationChange = () => {
//       setPathname(window.location.pathname);
//     };

//     window.addEventListener("popstate", handleLocationChange);
//     // Custom event to handle programmatical history pushes
//     window.addEventListener("pushstate", handleLocationChange);
//     window.addEventListener("replacestate", handleLocationChange);

//     return () => {
//       window.removeEventListener("popstate", handleLocationChange);
//       window.removeEventListener("pushstate", handleLocationChange);
//       window.removeEventListener("replacestate", handleLocationChange);
//     };
//   }, []);

//   return pathname;
// }

export interface SidebarProps {
  currentUser: User;
  currentTenant: Tenant;
}

export function Sidebar({
  currentUser,
  currentTenant,
}: SidebarProps): React.JSX.Element {
  const pathname = usePathname();

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Documents", href: "/documents", icon: FileText },
    { name: "Chat", href: "/chat", icon: MessageSquare },
    { name: "Team", href: "/team", icon: Users },
    { name: "Billing", href: "/billing", icon: CreditCard },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  // Helper function to simulate SPA routing if required
  const handleNavigation = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", href);
      // Dispatch custom event to notify hook of path change
      window.dispatchEvent(new Event("pushstate"));
    }
  };

  return (
    <aside
      id="dashboard-sidebar"
      className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white border-r border-gray-200 h-screen z-20"
    >
      {/* Top section: Brand logo */}
      <div
        id="sidebar-header"
        className="flex items-center h-16 px-6 border-b border-gray-200 gap-2.5"
      >
        <div
          id="sidebar-logo-icon"
          className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-100"
        >
          <Brain className="w-5 h-5" />
        </div>
        <div id="sidebar-logo-text" className="flex flex-col">
          <span className="text-base font-bold text-gray-900 leading-tight">
            DocuMind AI
          </span>
          <span className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">
            SaaS Platform
          </span>
        </div>
      </div>

      {/* Tenant subscription details wrapper */}
      <div
        id="sidebar-tenant"
        className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex flex-col gap-1"
      >
        <div className="flex items-center justify-between">
          <span
            id="tenant-name"
            className="text-xs font-semibold text-gray-700 truncate max-w-[120px]"
          >
            {currentTenant.name}
          </span>
          <PlanBadge plan={currentTenant.plan} />
        </div>
        <span
          id="tenant-industry"
          className="text-[10px] text-gray-400 font-medium"
        >
          {currentTenant.industry}
        </span>
      </div>

      {/* Middle section: Navigation links */}
      <nav
        id="sidebar-nav"
        className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto"
      >
        {navigationItems.map((item) => {
          // Check active state
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              id={`nav-link-${item.name.toLowerCase()}`}
              href={item.href}
              onClick={(e) => handleNavigation(item.href, e)}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-100"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon
                id={`nav-icon-${item.name.toLowerCase()}`}
                className={`w-5 h-5 shrink-0 ${
                  isActive
                    ? "text-white"
                    : "text-gray-400 group-hover:text-gray-500"
                }`}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section: Current user info */}
      <div
        id="sidebar-footer"
        className="p-4 border-t border-gray-200 bg-gray-50/80"
      >
        <div id="sidebar-user-card" className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div
              id="sidebar-user-avatar"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold border-2 border-white shadow-sm"
            >
              {getInitials(currentUser.name)}
            </div>
            <div
              id="sidebar-user-meta"
              className="flex flex-col min-w-0 flex-1"
            >
              <span
                id="sidebar-user-name"
                className="text-xs font-semibold text-gray-900 truncate"
              >
                {currentUser.name}
              </span>
              <span
                id="sidebar-user-email"
                className="text-[10px] text-gray-500 truncate"
              >
                {currentUser.email}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
              Access Tier
            </span>
            <RoleBadge role={currentUser.role} />
          </div>
        </div>
      </div>
    </aside>
  );
}
