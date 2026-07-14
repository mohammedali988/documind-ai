import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { persistSession: false },
  },
);

export interface DbTenant {
  id: string;
  name: string;
  industry: string | null;
  plan: "free" | "pro" | "enterprise";
  stripe_customer_id: string | null;
  created_at: string;
}

export interface DbUser {
  id: string;
  tenant_id: string;
  email: string;
  name: string | null;
  role: "admin" | "manager" | "viewer";
  created_at: string;
}

export interface DbDocument {
  id: string;
  tenant_id: string;
  uploaded_by: string | null;
  name: string;
  file_type: string;
  file_url: string | null;
  status: string;
  created_at: string;
}

export interface DbDocumentChunk {
  id: string;
  document_id: string;
  tenant_id: string;
  content: string;
  embedding: number[];
  chunk_index: number;
  created_at: string | null;
}

export interface DbConversation {
  id: string;
  tenant_id: string;
  user_id: string | null;
  title: string;
  created_at: string | null;
}

export interface DbMessage {
  id: string;
  conversation_id: string;
  tenant_id: string;
  role: string;
  content: string;
  sources: string | null;
  created_at: string | null;
}
