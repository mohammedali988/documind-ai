"use client";

import React from "react";
import { Check } from "lucide-react";
import { PlanType } from "../../types";
import { PlanBadge } from "../ui/PlanBadge";
import { Button } from "../ui/Button";

export interface PlanCardProps {
  planName: PlanType;
  price: number;
  features: string[];
  isCurrentPlan: boolean;
  onUpgrade?: () => void;
}

export function PlanCard({
  planName,
  price,
  features,
  isCurrentPlan,
  onUpgrade,
}: PlanCardProps): React.JSX.Element {
  const isPro = planName === "pro";

  return (
    <div
      id={`plan-card-${planName}`}
      className={`relative flex flex-col p-6 bg-white border rounded-2xl shadow-sm transition-all duration-250 ${
        isPro
          ? "border-indigo-600 ring-1 ring-indigo-600 scale-100"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      {/* Popular indicator badge for Pro plan */}
      {isPro && (
        <span
          id="pro-popular-badge"
          className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 text-[10px] font-bold text-white bg-indigo-600 uppercase tracking-widest rounded-full shadow-sm"
        >
          Most Popular
        </span>
      )}

      {/* Plan Identification Row */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <h3 className="text-xl font-bold text-gray-900 capitalize">
          {planName}
        </h3>
        <PlanBadge plan={planName} />
      </div>

      {/* Pricing Information */}
      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-4xl font-extrabold text-gray-950">${price}</span>
        <span className="text-sm font-semibold text-gray-500">/month</span>
      </div>

      {/* Features Listing */}
      <div className="flex-1 space-y-4 mb-8">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Features Included:
        </p>
        <ul className="space-y-3" id={`features-list-${planName}`}>
          {features.map((feature, idx) => (
            <li
              key={idx}
              id={`feature-${planName}-${idx}`}
              className="flex items-start gap-2.5 text-sm text-gray-600"
            >
              <div className="p-0.5 rounded-full bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span className="leading-tight font-medium">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Card Action Area */}
      <div className="mt-auto pt-4 border-t border-gray-100">
        {isCurrentPlan ? (
          <div
            id={`current-plan-badge-wrapper-${planName}`}
            className="flex items-center justify-center gap-1.5 w-full py-2.5 text-sm font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl"
          >
            <Check className="w-4 h-4" />
            <span>Current Plan</span>
          </div>
        ) : (
          <Button
            id={`btn-upgrade-plan-${planName}`}
            type="button"
            variant={isPro ? "default" : "outline"}
            onClick={onUpgrade}
            className={`w-full py-2.5 text-xs font-bold rounded-xl transition-all ${
              isPro
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {planName === "enterprise" ? "Contact Sales" : "Upgrade Plan"}
          </Button>
        )}
      </div>
    </div>
  );
}
