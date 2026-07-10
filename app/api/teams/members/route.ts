import { NextResponse } from "next/server";
import { auth0, parseClaims } from "@/lib/auth";
import { getOrganizationMembers } from "@/lib/auth0-management";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const session = await auth0.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const claims = parseClaims(session.user);
  if (!claims.orgId) {
    return NextResponse.json(
      { error: "No organization found" },
      { status: 400 },
    );
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("tenant_id", claims.orgId);

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch team members" },
        { status: 500 },
      );
    }

    const members = data.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name ?? u.email,
      role: u.role,
      tenantId: u.tenant_id,
      createdAt: new Date(u.created_at),
    }));

    return NextResponse.json({ members });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Failed to fetch team members:", err);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 },
    );
  }
}
