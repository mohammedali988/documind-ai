import { Tenant, Document, User } from "../types";

/**
 * Formats a Date object into "Jan 15, 2024" format.
 */
export function formatDate(date: Date): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "Invalid Date";
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Formats file size in bytes to a human-readable string (e.g., "2.4 MB").
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 0) {
    return "0 Bytes";
  }
  if (bytes === 0) {
    return "0 Bytes";
  }

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // Limit standard precision to 1 decimal place or 0 depending on fractional part
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(1));
  return `${size} ${sizes[i]}`;
}

/**
 * Extracts initials from a user's full name (e.g. "Mohammed Johnson" -> "MJ").
 */
export function getInitials(name: string): string {
  if (!name || typeof name !== "string") {
    return "";
  }

  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return "";
  }

  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  const firstInitial = parts[0].charAt(0).toUpperCase();
  const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
  return `${firstInitial}${lastInitial}`;
}

/**
 * Returns Tailwind color utility classes matching the given tenant subscription plan.
 */
export function getPlanColor(plan: Tenant["plan"]): string {
  switch (plan) {
    case "free":
      return "bg-gray-100 text-gray-700 border-gray-200";
    case "pro":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "enterprise":
      return "bg-purple-50 text-purple-700 border-purple-200";
    default:
      return "bg-gray-50 text-gray-600 border-gray-100";
  }
}

/**
 * Returns Tailwind color utility classes matching the document processing status.
 */
export function getStatusColor(status: Document["status"]): string {
  switch (status) {
    case "ready":
      return "bg-green-50 text-green-700 border-green-200";
    case "processing":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "failed":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-600 border-gray-100";
  }
}

/**
 * Returns Tailwind color utility classes matching the user role.
 */
export function getRoleColor(role: User["role"]): string {
  switch (role) {
    case "admin":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "manager":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "viewer":
      return "bg-teal-50 text-teal-700 border-teal-200";
    default:
      return "bg-gray-50 text-gray-600 border-gray-100";
  }
}

/**
 * Truncates text with "..." if the length exceeds the specified maxLength.
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) {
    return "";
  }
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Calculates percentage of used resources against limits, capped at 100%.
 */
export function calculateUsagePercentage(used: number, limit: number): number {
  if (limit <= 0) {
    return 0;
  }
  const percentage = (used / limit) * 100;
  const clamped = Math.min(100, Math.max(0, percentage));
  return parseFloat(clamped.toFixed(1));
}
