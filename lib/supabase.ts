import { createClient } from "@supabase/supabase-js";

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
  industry: string;
  plan: "free" | "pro" | "enterprise";
  stripe_customer_id: string | null;
  created_at: string;
}

export interface DbUser {
  id: string;
  email: string;
  name: string | null;
  role: "admin" | "manager" | "viewer";
  tenant_id: string;
  created_at: string;
}
