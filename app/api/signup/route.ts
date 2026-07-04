import { NextRequest, NextResponse } from "next/server";
import {
  createAuth0User,
  createAuth0Organization,
  addUserToOrganization,
  getRoleIdByName,
  assignOrgRole,
  enableConnectionForOrg,
} from "@/lib/auth0-management";

export async function POST(req: NextRequest) {
  const { name, email, password, companyName } = await req.json();

  if (!name || !email || !password || !companyName) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  try {
    const auth0User = await createAuth0User(email, password, name);
    const org = await createAuth0Organization(companyName);
    await enableConnectionForOrg(org.id);
    await addUserToOrganization(org.id, auth0User.user_id);

    const adminRoleId = await getRoleIdByName("admin");
    await assignOrgRole(org.id, auth0User.user_id, adminRoleId);

    // TODO: once Supabase is set up, insert tenant + user rows here.
    // For now, all tenant/user data lives only in Auth0.

    return NextResponse.json({ success: true, orgId: org.id });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Signup failed:", err);
    return NextResponse.json(
      { error: "Signup failed. Try again." },
      { status: 500 },
    );
  }
}
