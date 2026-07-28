export type UserRole = "admin" | "manager" | "viewer";
export type PlanType = "free" | "pro" | "enterprise";
export type FileType = "pdf" | "docx";
export type DocumentStatus = "processing" | "ready" | "failed";
export type MessageRole = "user" | "assistant";
export type BillingStatus = "paid" | "pending" | "failed";
export type InviteStatus = "pending" | "accepted" | "expired";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId: string;
  createdAt: Date;
}

export interface Tenant {
  id: string;
  name: string;
  industry: string;
  plan: PlanType;
  stripeCustomerId: string;
  createdAt: Date;
}

export interface Document {
  id: string;
  tenantId: string;
  uploadedBy: string; // User ID
  name: string;
  fileType: FileType;
  fileUrl: string;
  status: DocumentStatus;
  created_at: Date;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  tenantId: string;
  content: string;
  chunkIndex: number;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  tenantId: string;
  userId: string;
  title: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  sources: string[]; // Source citations or document chunks
  created_at: Date;
}

export interface PlanLimits {
  maxDocuments: number;
  maxUsers: number;
  maxQuestionsPerMonth: number;
  maxStorageGB: number;
}

export interface UsageStats {
  documentsCount: number;
  usersCount: number;
  questionsThisMonth: number;
  storageUsedGB: number;
}

export interface BillingRecord {
  id: string;
  tenantId: string;
  amount: number;
  status: BillingStatus;
  date: Date;
  invoiceUrl: string;
}

export interface TeamInvite {
  id: string;
  tenantId: string;
  email: string;
  role: UserRole;
  status: InviteStatus;
  createdAt: Date;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}
