import { NextResponse } from "next/server";
import { auth0, parseClaims } from "@/lib/auth";

export async function GET() {
  const session = await auth0.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const claims = parseClaims(session.user);
  return NextResponse.json(claims);
}
