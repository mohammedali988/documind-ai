import React from "react";
import "./globals.css";

// Export metadata according to Next.js standards
export const metadata = {
  title: "DocuMind AI",
  description: "AI-powered document knowledge platform",
};

export interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps): React.JSX.Element {
  return (
    <html lang="en">
      <body
        id="documind-root"
        className="font-sans min-h-screen bg-gray-50 text-gray-900 antialiased"
      >
        {children}
      </body>
    </html>
  );
}
