"use client";

import React from "react";
import { Download, Receipt } from "lucide-react";
import { BillingRecord } from "../../types";
import { formatDate } from "../../lib/utils";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";

export interface BillingHistoryProps {
  records: BillingRecord[];
}

export function BillingHistory({
  records,
}: BillingHistoryProps): React.JSX.Element {
  if (!records || records.length === 0) {
    return (
      <div id="billing-history-empty" className="py-8">
        <EmptyState
          icon={Receipt}
          title="No billing history available"
          description="You don't have any billing records or past invoice entries yet."
        />
      </div>
    );
  }

  // Helper to resolve status styling
  const getStatusBadge = (status: BillingRecord["status"]) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-md">
            Paid
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 rounded-md">
            Pending
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-bold text-red-700 bg-red-50 border border-red-100 rounded-md">
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-bold text-gray-700 bg-gray-50 border border-gray-100 rounded-md">
            {status}
          </span>
        );
    }
  };

  return (
    <div
      id="billing-history-card"
      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
    >
      <div id="billing-history-scrollable" className="overflow-x-auto">
        <table
          id="billing-history-table"
          className="w-full min-w-[600px] border-collapse text-left"
        >
          <thead>
            <tr
              id="billing-history-header-row"
              className="bg-gray-50 border-b border-gray-100"
            >
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Invoice Date
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                Invoice
              </th>
            </tr>
          </thead>
          <tbody id="billing-history-body" className="divide-y divide-gray-100">
            {records.map((record) => (
              <tr
                key={record.id}
                id={`billing-row-${record.id}`}
                className="hover:bg-gray-50/50 transition-colors"
              >
                {/* Date column */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {formatDate(new Date(record.date))}
                </td>

                {/* Amount column */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium font-mono">
                  ${record.amount.toFixed(2)}
                </td>

                {/* Status column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(record.status)}
                </td>

                {/* Invoice actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <a
                    id={`invoice-link-${record.id}`}
                    href={record.invoiceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex"
                    onClick={(e) => {
                      // Prevent broken URL links from reloading preview frame
                      if (
                        !record.invoiceUrl ||
                        record.invoiceUrl.startsWith("#")
                      ) {
                        e.preventDefault();
                        console.log(`Mock downloading invoice: ${record.id}`);
                      }
                    }}
                  >
                    <Button
                      id={`btn-download-invoice-${record.id}`}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </Button>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
