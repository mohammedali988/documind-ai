"use client";

import React, { useEffect } from "react";
import { LoadingSpinner } from "../../../../components/ui/LoadingSpinner";

export default function AuthCallbackPage(): React.JSX.Element {
  useEffect(() => {
    // Simulate setup and then redirect to dashboard
    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        window.location.href = "/dashboard";
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      id="auth-callback-container"
      className="flex min-h-screen w-full items-center justify-center bg-white"
    >
      <LoadingSpinner
        size="lg"
        message="Setting up your workspace..."
        fullPage={true}
      />
    </div>
  );
}
