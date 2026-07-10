"use client";
import React, { useState } from "react";
import { Brain, Eye, EyeOff } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";

export default function SignupPage(): React.JSX.Element {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    setIsLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
          companyName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message || "Signup failed. Please try again.");
        setIsLoading(false);
        return;
      }

      window.location.href = `/auth/login?organization=${data.orgId}&returnTo=/dashboard`;
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    console.log("Signing up with Google");
    if (typeof window !== "undefined") {
      window.location.href = "/dashboard";
    }
  };

  return (
    <div
      id="signup-page-container"
      className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-12"
    >
      <div
        id="signup-card"
        className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm p-8"
      >
        {/* Brand logo at top */}
        <div
          id="signup-brand"
          className="flex flex-col items-center gap-3 mb-8"
        >
          <div
            id="signup-logo-icon"
            className="flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-100"
          >
            <Brain className="w-6 h-6" />
          </div>
          <div id="signup-logo-text" className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              DocuMind AI
            </h1>
            <p className="text-sm text-gray-500 font-medium mt-1">
              Create your account
            </p>
            <p className="text-xs text-indigo-600 font-semibold mt-1">
              Start your free 14-day trial
            </p>
          </div>
        </div>

        {/* Continue with Google button */}
        <div id="signup-social-section" className="space-y-4">
          <Button
            id="signup-btn-google"
            type="button"
            variant="outline"
            className="w-full h-10 gap-2.5 font-semibold text-gray-700 hover:text-gray-900"
            onClick={handleGoogleSignup}
          >
            <svg
              id="google-icon"
              className="w-4 h-4"
              aria-hidden="true"
              viewBox="0 0 24 24"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            <span>Continue with Google</span>
          </Button>

          {/* Divider */}
          <div id="signup-divider" className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-[10px] font-bold text-gray-400 tracking-wider uppercase">
              OR
            </span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>
        </div>

        {/* Signup Form */}
        <form
          id="signup-form"
          onSubmit={handleSubmit}
          className="space-y-4 mt-2"
        >
          {/* Full Name field */}
          <div id="signup-form-name-group" className="space-y-1.5">
            <label
              htmlFor="name-input"
              className="text-xs font-bold text-gray-700 tracking-tight"
            >
              Full Name
            </label>
            <Input
              id="name-input"
              type="text"
              placeholder="John Doe"
              required
              disabled={isLoading}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-10"
            />
          </div>

          {/* Email input field */}
          <div id="signup-form-email-group" className="space-y-1.5">
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

          {/* Password input field */}
          <div id="signup-form-password-group" className="space-y-1.5">
            <label
              htmlFor="password-input"
              className="text-xs font-bold text-gray-700 tracking-tight"
            >
              Password
            </label>
            <div className="relative">
              <Input
                id="password-input"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 pr-10"
              />
              <button
                id="signup-btn-toggle-password"
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Company Name field */}
          <div id="signup-form-company-group" className="space-y-1.5">
            <label
              htmlFor="company-input"
              className="text-xs font-bold text-gray-700 tracking-tight"
            >
              Company Name
            </label>
            <Input
              id="company-input"
              type="text"
              placeholder="Acme Corp"
              required
              disabled={isLoading}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="h-10"
            />
          </div>

          {/* Terms checkbox */}
          <div
            id="signup-form-terms-group"
            className="flex items-start gap-2.5 pt-1"
          >
            <input
              id="terms-checkbox"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              required
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mt-0.5"
            />
            <label
              htmlFor="terms-checkbox"
              className="text-xs text-gray-500 font-medium leading-relaxed cursor-pointer select-none"
            >
              I agree to the{" "}
              <a
                href="#"
                className="font-semibold text-indigo-600 hover:underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="font-semibold text-indigo-600 hover:underline"
              >
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Submit button */}
          <Button
            id="signup-btn-submit"
            type="submit"
            disabled={isLoading}
            className="w-full h-10 font-bold mt-2"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        {/* Footer info: Sign in redirect */}
        <div
          id="signup-card-footer"
          className="text-center text-xs font-medium text-gray-500 mt-8 pt-6 border-t border-gray-100"
        >
          Already have an account?{" "}
          <a
            id="signup-link-login"
            href="/login"
            className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            Sign in
          </a>
        </div>
      </div>
      {error && (
        <div className="mt-4 w-full max-w-md">
          <ErrorState message={error} onRetry={() => setError("")} />
        </div>
      )}
    </div>
  );
}
