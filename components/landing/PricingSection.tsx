import React from "react";
import { Check } from "lucide-react";

export function PricingSection(): React.JSX.Element {
  const plans = [
    {
      id: "plan-free",
      name: "Free",
      price: "$0",
      description: "Perfect for individuals and small trials.",
      features: [
        "10 documents",
        "2 team members",
        "50 AI questions/month",
        "0.5GB storage",
        "Email support",
      ],
      buttonText: "Get Started Free",
      buttonHref: "/signup",
      isPopular: false,
    },
    {
      id: "plan-pro",
      name: "Pro",
      price: "$49",
      description: "Built for growing teams and power users.",
      features: [
        "100 documents",
        "15 team members",
        "1,000 AI questions/month",
        "10GB storage",
        "Priority support",
        "API access",
      ],
      buttonText: "Start Pro Trial",
      buttonHref: "/signup",
      isPopular: true,
    },
    {
      id: "plan-enterprise",
      name: "Enterprise",
      price: "$199",
      description: "Enterprise grade scaling, speed and support.",
      features: [
        "Unlimited documents",
        "Unlimited team members",
        "50,000 AI questions/month",
        "500GB storage",
        "Dedicated support",
        "Custom integrations",
        "SSO & Advanced security",
      ],
      buttonText: "Contact Sales",
      buttonHref: "#",
      isPopular: false,
    },
  ];

  return (
    <section
      id="pricing"
      className="py-24 bg-gray-50/50 border-b border-gray-100"
    >
      <div
        id="pricing-container"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Header Section */}
        <div
          id="pricing-header"
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2
            id="pricing-badge"
            className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3"
          >
            Plans & Billing
          </h2>
          <h3
            id="pricing-title"
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4"
          >
            Simple, transparent pricing
          </h3>
          <p
            id="pricing-subtitle"
            className="text-lg text-gray-500 font-medium leading-relaxed"
          >
            Start free, scale as you grow
          </p>
        </div>

        {/* Pricing Cards */}
        <div
          id="pricing-grid"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto"
        >
          {plans.map((plan) => (
            <div
              key={plan.id}
              id={plan.id}
              className={`relative flex flex-col justify-between p-8 bg-white rounded-2xl border transition-all duration-300 ${
                plan.isPopular
                  ? "border-indigo-600 ring-2 ring-indigo-600/10 shadow-lg lg:scale-[1.03] z-10"
                  : "border-gray-200 shadow-sm hover:border-gray-300"
              }`}
            >
              {plan.isPopular && (
                <div
                  id={`${plan.id}-popular-tag`}
                  className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full bg-indigo-600 text-white text-[11px] font-bold tracking-wider uppercase shadow-md shadow-indigo-100"
                >
                  Most Popular
                </div>
              )}

              {/* Top Details */}
              <div id={`${plan.id}-details`}>
                <h4
                  id={`${plan.id}-name`}
                  className="text-xl font-bold text-gray-900 mb-2"
                >
                  {plan.name}
                </h4>
                <p
                  id={`${plan.id}-desc`}
                  className="text-sm text-gray-500 font-medium mb-6 min-h-[40px]"
                >
                  {plan.description}
                </p>
                <div
                  id={`${plan.id}-pricing-row`}
                  className="flex items-baseline mb-8"
                >
                  <span
                    id={`${plan.id}-price`}
                    className="text-4xl font-extrabold text-gray-900"
                  >
                    {plan.price}
                  </span>
                  <span
                    id={`${plan.id}-period`}
                    className="text-sm font-semibold text-gray-400 ml-2"
                  >
                    /month
                  </span>
                </div>

                {/* Features List */}
                <ul id={`${plan.id}-features-list`} className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      id={`${plan.id}-feature-${idx}`}
                      className="flex items-start gap-3 text-sm text-gray-600 font-medium"
                    >
                      <Check
                        id={`${plan.id}-feature-check-${idx}`}
                        className="w-4 h-4 text-green-500 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div id={`${plan.id}-btn-wrapper`} className="mt-auto">
                <a
                  id={`${plan.id}-action-button`}
                  href={plan.buttonHref}
                  className={`flex items-center justify-center w-full py-3 px-4 text-sm font-bold rounded-lg transition-colors cursor-pointer ${
                    plan.isPopular
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-100"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {plan.buttonText}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
