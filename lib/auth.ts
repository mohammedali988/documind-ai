/* eslint-disable @typescript-eslint/no-explicit-any */
import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "./supabase";

export const auth0 = new Auth0Client({
  async beforeSessionSaved(session) {
    return {
      ...session,
      user: {
        ...session.user,
        [`${NAMESPACE}/org_id`]: (session.user as any)[`${NAMESPACE}/org_id`],
        [`${NAMESPACE}/org_name`]: (session.user as any)[
          `${NAMESPACE}/org_name`
        ],
        [`${NAMESPACE}/role`]: (session.user as any)[`${NAMESPACE}/role`],
        [`${NAMESPACE}/is_super_admin`]: (session.user as any)[
          `${NAMESPACE}/is_super_admin`
        ],
      },
    };
  },
  async onCallback(error, context, session) {
    if (error) {
      return NextResponse.redirect(
        new URL(`/login?error=${error.message}`, process.env.APP_BASE_URL),
      );
    }

    if (session) {
      const orgId = (session.user as any)[`${NAMESPACE}/org_id`];
      const role = (session.user as any)[`${NAMESPACE}/role`];

      if (orgId && role) {
        await supabaseAdmin.from("users").upsert(
          {
            id: session.user.sub,
            email: session.user.email,
            name: session.user.name,
            role,
            tenant_id: orgId,
          },
          { onConflict: "id" },
        );
      }
    }
    return NextResponse.redirect(
      new URL(context.returnTo || "/dashboard", process.env.APP_BASE_URL),
    );
  },
});

const NAMESPACE = "https://documind.ai";

export interface SessionClaims {
  sub: string;
  email: string;
  name: string;
  orgId: string | null;
  orgName: string | null;
  role: "admin" | "manager" | "viewer" | null;
  isSuperAdmin: boolean;
}

export function parseClaims(user: any): SessionClaims {
  return {
    sub: user.sub,
    email: user.email,
    name: user.name,
    orgId: user[`${NAMESPACE}/org_id`] ?? null,
    orgName: user[`${NAMESPACE}/org_name`] ?? null,
    role: user[`${NAMESPACE}/role`] ?? null,
    isSuperAdmin: user[`${NAMESPACE}/is_super_admin`] === true,
  };
}
