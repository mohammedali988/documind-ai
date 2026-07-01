import React from "react";
import { Search, Shield, FileText, Users, Zap, Building2 } from "lucide-react";

export function FeaturesSection(): React.JSX.Element {
  const features = [
    {
      id: "feature-search",
      title: "AI-Powered Search",
      description:
        "Find answers across all your documents instantly using natural language queries.",
      icon: Search,
    },
    {
      id: "feature-security",
      title: "Multi-Tenant Security",
      description:
        "Enterprise-grade data isolation ensures your data is never mixed with other organizations.",
      icon: Shield,
    },
    {
      id: "feature-processing",
      title: "Document Processing",
      description:
        "Upload PDFs and Word documents. Our AI processes and indexes them automatically.",
      icon: FileText,
    },
    {
      id: "feature-access",
      title: "Role-Based Access",
      description:
        "Control who can upload, search, or manage documents with granular permissions.",
      icon: Users,
    },
    {
      id: "feature-answers",
      title: "Real-Time Answers",
      description:
        "Get instant AI-powered answers with source citations from your own documents.",
      icon: Zap,
    },
    {
      id: "feature-enterprise",
      title: "Enterprise Ready",
      description:
        "SOC 2 compliant, GDPR ready, and built to scale with your organization.",
      icon: Building2,
    },
  ];

  return (
    <section id="features" className="py-24 bg-white border-y border-gray-100">
      <div
        id="features-container"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Header Section */}
        <div
          id="features-header"
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2
            id="features-badge"
            className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3"
          >
            Platform Capabilities
          </h2>
          <h3
            id="features-title"
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4"
          >
            Everything your team needs
          </h3>
          <p
            id="features-subtitle"
            className="text-lg text-gray-500 font-medium leading-relaxed"
          >
            Powerful AI features built for enterprise teams
          </p>
        </div>

        {/* Features 3x2 Grid */}
        <div
          id="features-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                id={feature.id}
                className="group relative bg-white p-8 border border-gray-200 rounded-2xl hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50/50 transition-all duration-300"
              >
                {/* Icon wrapper */}
                <div
                  id={`${feature.id}-icon-wrapper`}
                  className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300"
                >
                  <Icon
                    id={`${feature.id}-icon`}
                    className="w-5 h-5"
                    aria-hidden="true"
                  />
                </div>

                {/* Text contents */}
                <h4
                  id={`${feature.id}-title`}
                  className="text-lg font-bold text-gray-900 mb-2"
                >
                  {feature.title}
                </h4>
                <p
                  id={`${feature.id}-desc`}
                  className="text-sm text-gray-500 leading-relaxed font-medium"
                >
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
