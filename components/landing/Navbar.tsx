"use client";
import React, { useState } from "react";
import { Brain, Menu, X } from "lucide-react";

export function Navbar(): React.JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Helper to handle smooth scrolls
  const handleScroll = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      id="landing-navbar"
      className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 shadow-sm z-50"
    >
      <div
        id="navbar-container"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between"
      >
        {/* Left Side: Brand Logo */}
        <div
          id="navbar-logo"
          className="flex items-center gap-2 cursor-pointer"
          onClick={(e) => handleScroll("hero", e)}
        >
          <div
            id="navbar-logo-icon"
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-100"
          >
            <Brain className="w-5 h-5" />
          </div>
          <span
            id="navbar-logo-text"
            className="text-lg font-bold text-gray-900 tracking-tight"
          >
            DocuMind AI
          </span>
        </div>

        {/* Middle Section: Desktop Navigation Links */}
        <div
          id="navbar-desktop-links"
          className="hidden md:flex items-center gap-8"
        >
          <a
            id="nav-link-desktop-features"
            href="#features"
            onClick={(e) => handleScroll("features", e)}
            className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Features
          </a>
          <a
            id="nav-link-desktop-pricing"
            href="#pricing"
            onClick={(e) => handleScroll("pricing", e)}
            className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Pricing
          </a>
          <a
            id="nav-link-desktop-about"
            href="#about"
            onClick={(e) => handleScroll("about", e)}
            className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
          >
            About
          </a>
        </div>

        {/* Right Section: Desktop Action Buttons */}
        <div
          id="navbar-desktop-actions"
          className="hidden md:flex items-center gap-4"
        >
          <a
            id="nav-btn-login"
            href="/login"
            className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors"
          >
            Log in
          </a>
          <a
            id="nav-btn-signup"
            href="/signup"
            className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm shadow-indigo-100 transition-colors"
          >
            Get Started Free
          </a>
        </div>

        {/* Mobile Toggle Button */}
        <div id="navbar-mobile-toggle" className="flex items-center md:hidden">
          <button
            id="navbar-hamburger-button"
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMenuOpen && (
        <div
          id="navbar-mobile-menu"
          className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-100 shadow-md py-4 px-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <a
            id="nav-link-mobile-features"
            href="#features"
            onClick={(e) => handleScroll("features", e)}
            className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors py-1.5 border-b border-gray-50"
          >
            Features
          </a>
          <a
            id="nav-link-mobile-pricing"
            href="#pricing"
            onClick={(e) => handleScroll("pricing", e)}
            className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors py-1.5 border-b border-gray-50"
          >
            Pricing
          </a>
          <a
            id="nav-link-mobile-about"
            href="#about"
            onClick={(e) => handleScroll("about", e)}
            className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors py-1.5"
          >
            About
          </a>
          <div
            id="navbar-mobile-actions"
            className="flex flex-col gap-2 pt-2 border-t border-gray-100"
          >
            <a
              id="nav-btn-mobile-login"
              href="/login"
              className="flex items-center justify-center w-full py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              Log in
            </a>
            <a
              id="nav-btn-mobile-signup"
              href="/signup"
              className="flex items-center justify-center w-full py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm transition-colors"
            >
              Get Started Free
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
