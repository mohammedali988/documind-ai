import { findOrgIdByUserEmail } from "@/lib/auth0-management";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  try {
    const orgId = await findOrgIdByUserEmail(email);

    if (!orgId) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ orgId });
  } catch (err) {
    console.error("Org lookup failed:", err);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
}
