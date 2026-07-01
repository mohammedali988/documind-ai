"use client";

import React from "react";
import { ShieldAlert, ArrowLeft, LayoutDashboard } from "lucide-react";
import { mockUsers } from "../../../lib/mockData";
import { RoleBadge } from "../../../components/ui/RoleBadge";
import { Button } from "../../../components/ui/Button";

// Lightweight hook that mimics next/navigation useRouter in standard SPA environments
function useRouter() {
  return {
    back: () => {
      if (typeof window !== "undefined") {
        window.history.back();
      }
    },
    push: (href: string) => {
      if (typeof window !== "undefined") {
        window.history.pushState({}, "", href);
        window.dispatchEvent(new Event("pushstate"));
      }
    },
  };
}

export default function UnauthorizedPage(): React.JSX.Element {
  const router = useRouter();

  // Get the role of the mock user
  const currentUserRole = mockUsers[0]?.role || "viewer";

  const handleGoBack = () => {
    router.back();
  };

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div
      id="unauthorized-page-container"
      className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-12"
    >
      <div
        id="unauthorized-card"
        className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center"
      >
        {/* ShieldAlert Icon in Red Circle */}
        <div
          id="unauthorized-icon-wrapper"
          className="flex items-center justify-center mx-auto w-16 h-16 rounded-full bg-rose-50 text-rose-600 mb-6"
        >
          <ShieldAlert
            id="unauthorized-icon"
            className="w-8 h-8"
            aria-hidden="true"
          />
        </div>

        {/* Title & Description */}
        <h1
          id="unauthorized-title"
          className="text-2xl font-bold text-gray-900 tracking-tight mb-3"
        >
          Access Denied
        </h1>
        <p
          id="unauthorized-description"
          className="text-sm text-gray-600 font-medium leading-relaxed mb-6"
        >
          You don&apos;t have permission to access this page. Contact your workspace
          admin if you think this is a mistake.
        </p>

        {/* Display Current Role */}
        <div
          id="unauthorized-role-display"
          className="bg-gray-50 border border-gray-100 rounded-lg p-4 mb-8 flex items-center justify-between"
        >
          <span
            id="role-label"
            className="text-xs font-bold text-gray-500 uppercase tracking-wider"
          >
            Your Current Role:
          </span>
          <RoleBadge role={currentUserRole} />
        </div>

        {/* Actions Buttons */}
        <div
          id="unauthorized-actions"
          className="flex flex-col sm:flex-row gap-3"
        >
          <Button
            id="unauthorized-btn-back"
            type="button"
            variant="outline"
            onClick={handleGoBack}
            className="flex-1 gap-2 h-10 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </Button>
          <Button
            id="unauthorized-btn-dashboard"
            type="button"
            onClick={handleGoToDashboard}
            className="flex-1 gap-2 h-10 font-bold"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Go to Dashboard</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
