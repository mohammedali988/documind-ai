"use client";

import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import { PageHeader } from "../../../components/ui/PageHeader";
import { PlanCard } from "../../../components/billing/PlanCard";
import { UsageBar } from "../../../components/billing/UsageBar";
import { BillingHistory } from "../../../components/billing/BillingHistory";
import {
  mockBillingRecords,
  mockTenants,
  mockPlanLimits,
  mockUsageStats,
} from "../../../lib/mockData";
import { Tenant, PlanType, BillingRecord } from "../../../types";

export default function BillingPage(): React.JSX.Element {
  const [tenant, setTenant] = useState<Tenant>(mockTenants[0]); // Smith & Partners (pro)
  const [billingHistory, setBillingHistory] = useState<BillingRecord[]>(
    mockBillingRecords.filter((b) => b.tenantId === tenant.id),
  );

  const stats = mockUsageStats[tenant.id] || {
    documentsCount: 0,
    usersCount: 0,
    questionsThisMonth: 0,
    storageUsedGB: 0,
  };

  const planLimits = mockPlanLimits[tenant.plan];

  const handleUpgradePlan = (plan: PlanType) => {
    if (plan === tenant.plan) return;

    const nextAmount =
      plan === "free" ? "$0" : plan === "pro" ? "$79/mo" : "$499/mo";
    if (
      confirm(
        `Do you want to switch your workspace plan to "${plan.toUpperCase()}" (${nextAmount})? This is a mock billing update.`,
      )
    ) {
      setTenant((prev) => ({ ...prev, plan }));

      // Simulate adding a new mock invoice
      const newInvoice: BillingRecord = {
        id: `bill-simulated-${Date.now()}`,
        tenantId: tenant.id,
        amount: plan === "free" ? 0 : plan === "pro" ? 79.0 : 499.0,
        status: "paid",
        date: new Date(),
        invoiceUrl: "#",
      };

      setBillingHistory((prev) => [newInvoice, ...prev]);
    }
  };

  const getPlanDetails = (p: PlanType) => {
    switch (p) {
      case "free":
        return {
          priceValue: 0,
          desc: "For small startup prototypes or solo practitioners.",
          features: [
            "5 maximum document capacity",
            "Up to 3 team members",
            "50 queries per month limit",
            "0.5 GB file cloud storage space",
          ],
        };
      case "pro":
        return {
          priceValue: 79,
          desc: "For growing professional consulting teams & offices.",
          features: [
            "100 maximum document capacity",
            "Up to 15 team members",
            "1,000 queries per month limit",
            "10 GB file cloud storage space",
            "Priority support queue access",
          ],
        };
      case "enterprise":
        return {
          priceValue: 499,
          desc: "For massive hospital systems, law firms, and conglomerates.",
          features: [
            "10,000 maximum document capacity",
            "Up to 500 team members",
            "50,000 queries per month limit",
            "500 GB file cloud storage space",
            "Dedicated account support specialists",
            "99.9% uptime SLA agreements",
          ],
        };
    }
  };

  return (
    <div id="billing-page" className="space-y-8 animate-fade-in">
      <PageHeader
        title="Billing & Subscription"
        description="Review invoices, track resource consumption, and change organization plans."
      />

      {/* Subscription and Details Grid */}
      <div
        id="billing-summary-grid"
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Plan Upgrade Selector Card */}
        <div id="plan-selection-container" className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Workspace Plans
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Choose the tier that fits your document knowledge size and
                querying speed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(["free", "pro", "enterprise"] as PlanType[]).map(
                (planOption) => {
                  const details = getPlanDetails(planOption);
                  const isCurrent = tenant.plan === planOption;

                  return (
                    <div
                      key={planOption}
                      id={`plan-card-wrapper-${planOption}`}
                      className="flex flex-col"
                    >
                      <PlanCard
                        planName={planOption}
                        price={details.priceValue}
                        features={details.features}
                        isCurrentPlan={isCurrent}
                        onUpgrade={() => handleUpgradePlan(planOption)}
                      />
                    </div>
                  );
                },
              )}
            </div>
          </div>
        </div>

        {/* Right column: Usage & Payment Methods Stack */}
        <div id="usage-and-payment-stack" className="space-y-6">
          {/* Resource Usage Panel */}
          <div
            id="resource-usage-panel"
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6"
          >
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Resource Usage
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Check your workspace consumption against your current plan
                limits.
              </p>
            </div>

            <div className="space-y-5">
              <UsageBar
                label="Documents"
                used={stats.documentsCount}
                limit={planLimits.maxDocuments}
              />
              <UsageBar
                label="Team Members"
                used={stats.usersCount}
                limit={planLimits.maxUsers}
              />
              <UsageBar
                label="Queries"
                used={stats.questionsThisMonth}
                limit={planLimits.maxQuestionsPerMonth}
              />
              <UsageBar
                label="Cloud Storage"
                used={stats.storageUsedGB}
                limit={planLimits.maxStorageGB}
                unit="GB"
              />
            </div>
          </div>

          {/* Saved Cards / Payment Methods Panel */}
          <div
            id="payment-method-panel"
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6"
          >
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Payment Method
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Manage your default credit card and checkout settings.
              </p>
            </div>

            {/* Visa Card Mock */}
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl p-5 shadow-md flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                  Corporate Bill
                </span>
                <span className="text-lg font-black italic">VISA</span>
              </div>

              <div className="space-y-1">
                <p className="font-mono text-base font-semibold tracking-widest text-center">
                  •••• •••• •••• 5498
                </p>
                <div className="flex justify-between text-[10px] font-mono tracking-wider opacity-85 mt-2">
                  <span>SMITH & PARTNERS</span>
                  <span>EXP: 12 / 29</span>
                </div>
              </div>
            </div>

            {/* Upgrade prompt */}
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 flex gap-3 text-xs text-indigo-800">
              <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <p className="font-semibold leading-normal">
                Need custom volume pricing? Contact our dedicated support team
                to negotiate specialized service level agreements and private
                hosting.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice History List */}
      <div id="billing-history-section" className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-gray-900">
            Billing & Invoice History
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            View download records of corporate subscription invoices.
          </p>
        </div>
        <BillingHistory records={billingHistory} />
      </div>
    </div>
  );
}
