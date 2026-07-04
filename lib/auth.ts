/* eslint-disable @typescript-eslint/no-explicit-any */
import { Auth0Client } from "@auth0/nextjs-auth0/server";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
