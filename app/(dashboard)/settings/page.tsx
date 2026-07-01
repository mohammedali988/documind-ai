"use client";

import React, { useState } from "react";
import { Building, Sliders, Shield, Check, Brain, Globe } from "lucide-react";
import { PageHeader } from "../../../components/ui/PageHeader";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { mockTenants } from "../../../lib/mockData";
import { Tenant } from "../../../types";

export default function SettingsPage(): React.JSX.Element {
  const [tenant, setTenant] = useState<Tenant>(mockTenants[0]); // Smith & Partners

  // Local states for inputs
  const [orgName, setOrgName] = useState<string>(tenant.name);
  const [orgIndustry, setOrgIndustry] = useState<string>(tenant.industry);
  const [orgDomain, setOrgDomain] = useState<string>("smithpartners.com");

  // Feature toggle states
  const [groundingEnabled, setGroundingEnabled] = useState<boolean>(true);
  const [strictAccess, setStrictAccess] = useState<boolean>(true);
  const [autoIndex, setAutoIndex] = useState<boolean>(true);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    // Simulate saving settings with API delay
    setTimeout(() => {
      setTenant((prev) => ({
        ...prev,
        name: orgName,
        industry: orgIndustry,
      }));
      setIsSaving(false);
      setSaveSuccess(true);

      // Reset success status after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div id="settings-page" className="space-y-8 animate-fade-in">
      <PageHeader
        title="Workspace Settings"
        description="Configure tenant attributes, compliance flags, and integration variables."
      />

      <div
        id="settings-layout-grid"
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Left Columns (2/3): General Organization & Parameters */}
        <div id="settings-fields-column" className="lg:col-span-2 space-y-6">
          <form
            onSubmit={handleSaveSettings}
            className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Building className="w-5 h-5 text-indigo-600" />
                <span>Organization Identity</span>
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Update organization details linked with your DocuMind
                multi-tenant workspace.
              </p>
            </div>

            <div className="p-6 space-y-4">
              {/* Org Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 block">
                  Organization Name
                </label>
                <Input
                  id="settings-org-name"
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  required
                />
              </div>

              {/* Grid of details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Org Industry */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 block">
                    Primary Industry
                  </label>
                  <Input
                    id="settings-org-industry"
                    type="text"
                    value={orgIndustry}
                    onChange={(e) => setOrgIndustry(e.target.value)}
                    required
                  />
                </div>

                {/* Primary Domain */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 block">
                    Workspace Domain
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="settings-org-domain"
                      type="text"
                      value={orgDomain}
                      onChange={(e) => setOrgDomain(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer with save actions */}
            <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
              <div>
                {saveSuccess && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-green-700 font-bold bg-green-50 border border-green-100 px-3 py-1 rounded-full">
                    <Check className="w-4 h-4" />
                    <span>Settings successfully saved!</span>
                  </span>
                )}
              </div>

              <Button
                id="btn-save-settings"
                type="submit"
                disabled={isSaving}
                className="font-bold px-6"
              >
                {isSaving ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </form>

          {/* Integration variables */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-600" />
                <span>AI Grounding Controls</span>
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Toggle configuration settings for the Retrieval-Augmented
                Generation (RAG) assistant.
              </p>
            </div>

            <div className="space-y-4">
              {/* Toggle 1: Grounding Enabled */}
              <div className="flex items-start justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-xl hover:bg-gray-50/80 transition-colors">
                <div className="flex flex-col gap-1 pr-6">
                  <span className="text-sm font-bold text-gray-800">
                    Grounding Strictness
                  </span>
                  <span className="text-xs text-gray-500 leading-normal font-medium">
                    Forces the AI chatbot to only use uploaded files. It will
                    not make speculative claims outside your workspace
                    documents.
                  </span>
                </div>
                <button
                  id="toggle-grounding"
                  type="button"
                  onClick={() => setGroundingEnabled(!groundingEnabled)}
                  className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative shrink-0 focus:outline-none ${
                    groundingEnabled ? "bg-indigo-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      groundingEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 2: Strict Access Control */}
              <div className="flex items-start justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-xl hover:bg-gray-50/80 transition-colors">
                <div className="flex flex-col gap-1 pr-6">
                  <span className="text-sm font-bold text-gray-800">
                    Role-Based Access Guard
                  </span>
                  <span className="text-xs text-gray-500 leading-normal font-medium">
                    Strictly prevents &apos;viewer&apos; role profiles from
                    performing administrative mutations (e.g. deletion of
                    documents or member evictions).
                  </span>
                </div>
                <button
                  id="toggle-strict-access"
                  type="button"
                  onClick={() => setStrictAccess(!strictAccess)}
                  className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative shrink-0 focus:outline-none ${
                    strictAccess ? "bg-indigo-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      strictAccess ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 3: Auto Index */}
              <div className="flex items-start justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-xl hover:bg-gray-50/80 transition-colors">
                <div className="flex flex-col gap-1 pr-6">
                  <span className="text-sm font-bold text-gray-800">
                    Automated Vector Indexing
                  </span>
                  <span className="text-xs text-gray-500 leading-normal font-medium">
                    Triggers automatic indexing and vector chunking as soon as
                    files are dropped or uploaded to the platform.
                  </span>
                </div>
                <button
                  id="toggle-auto-index"
                  type="button"
                  onClick={() => setAutoIndex(!autoIndex)}
                  className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative shrink-0 focus:outline-none ${
                    autoIndex ? "bg-indigo-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      autoIndex ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1/3): Compliance and Metadata Security */}
        <div id="settings-meta-column" className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-600" />
              <span>Workspace Security</span>
            </h3>

            <div className="space-y-3.5 text-xs text-gray-500 leading-relaxed font-semibold">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-400">Data Isolation</span>
                <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                  Active (Strict)
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-400">Encryption Standard</span>
                <span className="text-gray-700 font-bold">AES-256</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-400">SOC 2 Alignment</span>
                <span className="text-gray-700 font-bold">Certified</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-400">Tenant Identifier</span>
                <span className="font-mono text-[10px] text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded">
                  {tenant.id}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-900 to-indigo-950 text-white rounded-xl p-6 shadow-md space-y-4">
            <div className="flex items-center gap-2.5">
              <Brain className="w-5 h-5 text-indigo-400" />
              <h4 className="text-sm font-bold tracking-tight">
                Need Dedicated LLMs?
              </h4>
            </div>
            <p className="text-xs text-indigo-200 leading-relaxed font-medium">
              We can deploy isolated fine-tuned model weights inside your
              virtual private cloud (VPC) for ultra-low latency and total
              security compliance.
            </p>
            <button
              id="btn-settings-enterprise-contact"
              type="button"
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Request Enterprise Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
