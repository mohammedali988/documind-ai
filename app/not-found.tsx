"use client";

import React from "react";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound(): React.JSX.Element {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push("/");
  };

  return (
    <div
      id="not-found-page"
      className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 animate-fade-in"
    >
      <div className="max-w-md w-full text-center space-y-8 bg-white p-8 sm:p-10 rounded-2xl border border-gray-200 shadow-xl">
        <div className="flex flex-col items-center">
          {/* Animated/pulse icon wrapper */}
          <div className="relative flex items-center justify-center w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full mb-6 ring-8 ring-indigo-50/50 animate-pulse">
            <FileQuestion className="w-10 h-10" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500"></span>
            </span>
          </div>

          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            404
          </h1>
          <h2 className="text-xl font-bold text-gray-800 mt-2">
            Page Not Found
          </h2>
          <p className="text-sm text-gray-500 mt-4 leading-relaxed font-medium">
            The workspace document or configuration page you are trying to
            access does not exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            id="btn-not-found-back"
            type="button"
            onClick={handleGoBack}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>

          <Link
            id="link-not-found-home"
            href="/"
            onClick={handleGoHome}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-transparent text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
        </div>

        <div className="text-[11px] text-gray-400 font-bold pt-2 border-t border-gray-100 flex items-center justify-center gap-1">
          <span>Security Identifier:</span>
          <span className="font-mono bg-gray-50 px-1 py-0.5 rounded">
            ERR_NOT_FOUND
          </span>
        </div>
      </div>
    </div>
  );
}
