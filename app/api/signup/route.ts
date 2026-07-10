import { NextRequest, NextResponse } from "next/server";
import {
  createAuth0User,
  createAuth0Organization,
  addUserToOrganization,
  getRoleIdByName,
  assignOrgRole,
  enableConnectionForOrg,
  deleteAuth0Organization,
  deleteAuth0User,
} from "@/lib/auth0-management";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { name, email, password, companyName } = await req.json();

  if (!name || !email || !password || !companyName) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  let auth0UserId: string | null = null;
  let auth0OrgId: string | null = null;

  try {
    const auth0User = await createAuth0User(email, password, name);
    auth0UserId = auth0User.user_id;

    const org = await createAuth0Organization(companyName);
    auth0OrgId = org.id;

    await enableConnectionForOrg(org.id);
    await addUserToOrganization(org.id, auth0User.user_id);

    const adminRoleId = await getRoleIdByName("admin");
    await assignOrgRole(org.id, auth0User.user_id, adminRoleId);

    const { error: tenantError } = await supabaseAdmin.from("tenants").insert({
      id: org.id,
      name: companyName,
    });
    if (tenantError)
      throw new Error(`Supabase tenant insert failed: ${tenantError.message}`);

    const { error: userError } = await supabaseAdmin.from("users").insert({
      id: auth0User.user_id,
      email,
      name,
      role: "admin",
      tenant_id: org.id,
    });
    if (userError)
      throw new Error(`Supabase user insert failed: ${userError.message}`);

    return NextResponse.json({ success: true, orgId: org.id });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const cleanupErrors: string[] = [];

    if (auth0OrgId) {
      try {
        await deleteAuth0Organization(auth0OrgId);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (cleanupErr: any) {
        cleanupErrors.push(
          `Failed to delete org ${auth0OrgId}: ${cleanupErr.message}`,
        );
      }
    }

    if (auth0UserId) {
      try {
        await deleteAuth0User(auth0UserId);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (cleanupErr: any) {
        cleanupErrors.push(
          `Failed to delete user ${auth0UserId}: ${cleanupErr.message}`,
        );
      }
    }

    if (cleanupErrors.length > 0) {
      console.error(
        "SIGNUP ROLLBACK INCOMPLETE — manual cleanup required in Auth0 dashboard:",
        { auth0UserId, auth0OrgId, cleanupErrors },
      );
    }

    // const message = err.message?.includes("PasswordStrengthError")
    //   ? "Password is too weak. Use at least 8 characters with uppercase, lowercase, and a number."
    //   : "Signup failed. Try again.";

    return NextResponse.json(
      {
        success: false,
        error: {
          message: err.message || "Signup failed. Please try again.",
          code: err.code || "UNKNOWN_ERROR",
          cleanupErrors,
        },
      },
      { status: 500 },
    );
  }
}
