"use client";
import React from "react";
import { Brain, Heart } from "lucide-react";

export function Footer(): React.JSX.Element {
  const handleScrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer
      id="landing-footer"
      className="bg-gray-900 text-gray-300 border-t border-gray-800"
    >
      {/* Top Footer Section */}
      <div
        id="footer-top-container"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div
          id="footer-grid"
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
        >
          {/* Column 1: Brand Info */}
          <div
            id="footer-col-brand"
            className="col-span-2 md:col-span-1 flex flex-col gap-4"
          >
            <div
              id="footer-logo"
              className="flex items-center gap-2 cursor-pointer text-white"
              onClick={handleScrollToTop}
            >
              <div
                id="footer-logo-icon"
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
              >
                <Brain className="w-5 h-5" />
              </div>
              <span
                id="footer-logo-text"
                className="text-lg font-bold tracking-tight"
              >
                DocuMind AI
              </span>
            </div>
            <p
              id="footer-tagline"
              className="text-sm text-gray-400 font-medium leading-relaxed"
            >
              AI-powered document knowledge platform secure, multi-tenant, and
              enterprise-ready.
            </p>
            {/* Social Icons */}
            <div id="footer-socials" className="flex items-center gap-4 mt-2">
              <a
                id="footer-social-twitter"
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-md hover:bg-gray-800 hover:text-white text-gray-400 transition-colors"
                aria-label="Twitter"
              ></a>
              <a
                id="footer-social-linkedin"
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-md hover:bg-gray-800 hover:text-white text-gray-400 transition-colors"
                aria-label="LinkedIn"
              >
                {/* <Linkedin className="w-5 h-5" /> */}
              </a>
              <a
                id="footer-social-github"
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-md hover:bg-gray-800 hover:text-white text-gray-400 transition-colors"
                aria-label="GitHub"
              >
                {/* <Github className="w-5 h-5" /> */}
              </a>
            </div>
          </div>

          {/* Column 2: Product */}
          <div id="footer-col-product" className="flex flex-col gap-4">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">
              Product
            </h5>
            <ul id="footer-product-links" className="space-y-2.5 text-sm">
              <li>
                <a
                  id="footer-link-features"
                  href="#features"
                  className="hover:text-white transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  id="footer-link-pricing"
                  href="#pricing"
                  className="hover:text-white transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  id="footer-link-security"
                  href="#"
                  className="hover:text-white transition-colors"
                >
                  Security
                </a>
              </li>
              <li>
                <a
                  id="footer-link-changelog"
                  href="#"
                  className="hover:text-white transition-colors"
                >
                  Changelog
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div id="footer-col-company" className="flex flex-col gap-4">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">
              Company
            </h5>
            <ul id="footer-company-links" className="space-y-2.5 text-sm">
              <li>
                <a
                  id="footer-link-about"
                  href="#"
                  className="hover:text-white transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  id="footer-link-blog"
                  href="#"
                  className="hover:text-white transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  id="footer-link-careers"
                  href="#"
                  className="hover:text-white transition-colors"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  id="footer-link-press"
                  href="#"
                  className="hover:text-white transition-colors"
                >
                  Press Kit
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div id="footer-col-legal" className="flex flex-col gap-4">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">
              Legal
            </h5>
            <ul id="footer-legal-links" className="space-y-2.5 text-sm">
              <li>
                <a
                  id="footer-link-privacy"
                  href="#"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  id="footer-link-terms"
                  href="#"
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  id="footer-link-cookies"
                  href="#"
                  className="hover:text-white transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  id="footer-link-gdpr"
                  href="#"
                  className="hover:text-white transition-colors"
                >
                  GDPR Compliance
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div
        id="footer-bottom"
        className="border-t border-gray-800 bg-gray-950/40 py-8"
      >
        <div
          id="footer-bottom-container"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium"
        >
          <span id="footer-copyright">
            &copy; 2024 DocuMind AI. All rights reserved.
          </span>
          <span id="footer-made-by" className="flex items-center gap-1">
            Made with{" "}
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> for
            enterprise teams
          </span>
        </div>
      </div>
    </footer>
  );
}
