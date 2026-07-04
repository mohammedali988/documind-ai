"use client";
import React, { useState } from "react";
import { Brain } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import Link from "next/link";

export default function LoginPage(): React.JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/lookup-org", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "No account found with that email.");
        setIsLoading(false);
        return;
      }

      const { orgId } = await res.json();
      window.location.href = `/auth/login?organization=${orgId}&returnTo=/dashboard`;
    } catch (err) {
      setError("Something went wrong. Try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    window.location.href = "/login?connection=google-oauth2";
  };

  return (
    <div
      id="login-page-container"
      className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-12"
    >
      <div
        id="login-card"
        className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm p-8"
      >
        {/* Brand logo at top */}
        <div id="login-brand" className="flex flex-col items-center gap-3 mb-8">
          <div
            id="login-logo-icon"
            className="flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-100"
          >
            <Brain className="w-6 h-6" />
          </div>

          <div id="login-logo-text" className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              DocuMind AI
            </h1>
            <p className="text-sm text-gray-500 font-medium mt-1">
              Sign in to your workspace
            </p>
          </div>
        </div>

        {/* Continue with Google button */}
        <div id="login-social-section" className="space-y-4">
          <Button
            id="login-btn-google"
            type="button"
            variant="outline"
            className="w-full h-10 gap-2.5 font-semibold text-gray-700 hover:text-gray-900"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            Continue with Google
          </Button>

          {/* Divider */}
          <div id="login-divider" className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-[10px] font-bold text-gray-400 tracking-wider uppercase">
              OR CONTINUE WITH
            </span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <p
            id="login-error-message"
            className="text-sm text-red-600 text-center -mb-2"
          >
            {error}
          </p>
        )}

        {/* Credentials Form */}
        <form
          id="login-form"
          onSubmit={handleSubmit}
          className="space-y-4 mt-2"
        >
          {/* Email input field */}
          <div id="login-form-email-group" className="space-y-1.5">
            <label
              htmlFor="email-input"
              className="text-xs font-bold text-gray-700 tracking-tight"
            >
              Email Address
            </label>

            <Input
              id="email-input"
              type="email"
              placeholder="name@company.com"
              required
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10"
            />
          </div>

          {/* Submit button */}
          <Button
            id="login-btn-submit"
            type="submit"
            disabled={isLoading}
            className="w-full h-10 font-bold mt-2"
          >
            {isLoading ? "Redirecting..." : "Continue"}
          </Button>
        </form>

        {/* Footer info */}
        <div
          id="login-card-footer"
          className="text-center text-xs font-medium text-gray-500 mt-8 pt-6 border-t border-gray-100"
        >
          Don&apos;t have an account?{" "}
          <Link
            id="login-link-signup"
            href="/signup"
            className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
