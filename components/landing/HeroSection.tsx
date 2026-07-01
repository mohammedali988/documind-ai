import React from "react";
import { Sparkles, ArrowRight, Play } from "lucide-react";

export function HeroSection(): React.JSX.Element {
  return (
    <section
      id="hero"
      className="relative flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-b from-white via-indigo-50/20 to-indigo-50/40 overflow-hidden"
    >
      {/* Decorative Grid Background Pattern */}
      <div
        id="hero-bg-grid"
        className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#f0f3ff_1px,transparent_1px),linear-gradient(to_bottom,#f0f3ff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60"
        aria-hidden="true"
      />

      {/* Decorative Blur Orbs */}
      <div
        id="hero-orb-1"
        className="absolute top-1/4 left-1/10 w-72 h-72 rounded-full bg-indigo-300/20 blur-3xl z-0"
        aria-hidden="true"
      />
      <div
        id="hero-orb-2"
        className="absolute bottom-1/4 right-1/10 w-96 h-96 rounded-full bg-purple-300/10 blur-3xl z-0"
        aria-hidden="true"
      />

      {/* Main Content Container */}
      <div
        id="hero-content"
        className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center"
      >
        {/* Sparkles Pill Badge */}
        <div
          id="hero-badge"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 mb-8 animate-fade-in"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>AI-Powered Document Intelligence</span>
        </div>

        {/* Headline */}
        <h1
          id="hero-headline"
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.1] mb-6"
        >
          Your Company Knowledge,{" "}
          <span className="text-indigo-600 bg-clip-text">
            Instantly Searchable
          </span>
        </h1>

        {/* Subheadline */}
        <p
          id="hero-subheadline"
          className="text-lg sm:text-xl text-gray-600 font-medium max-w-2xl mb-10 leading-relaxed"
        >
          Upload your documents and let AI answer your team&apos;s questions
          instantly. Secure, multi-tenant, and enterprise-ready.
        </p>

        {/* CTA Buttons */}
        <div
          id="hero-ctas"
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16"
        >
          <a
            id="hero-btn-primary"
            href="/signup"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all duration-200 cursor-pointer"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5" />
          </a>
          <a
            id="hero-btn-secondary"
            href="#"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 text-base font-bold text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 shadow-sm transition-all duration-200 cursor-pointer"
          >
            <Play className="w-4 h-4 text-gray-500 fill-current" />
            <span>Watch Demo</span>
          </a>
        </div>

        {/* Stats Row */}
        <div
          id="hero-stats"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 pt-10 border-t border-gray-200/60 w-full"
        >
          <div id="stat-companies" className="flex flex-col items-center">
            <span className="text-3xl font-extrabold text-gray-900">500+</span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">
              Companies
            </span>
          </div>
          <div id="stat-documents" className="flex flex-col items-center">
            <span className="text-3xl font-extrabold text-gray-900">1M+</span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">
              Documents Processed
            </span>
          </div>
          <div id="stat-uptime" className="flex flex-col items-center">
            <span className="text-3xl font-extrabold text-gray-900">99.9%</span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">
              Uptime Guarantee
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
