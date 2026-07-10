import { supabaseAdmin } from "./supabase";

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getManagementToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const res = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.AUTH0_M2M_CLIENT_ID,
      client_secret: process.env.AUTH0_M2M_CLIENT_SECRET,
      audience: process.env.AUTH0_MGMT_AUDIENCE,
      grant_type: "client_credentials",
    }),
  });

  if (!res.ok) throw new Error("Failed to get Auth0 Management token");
  const data = await res.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return cachedToken.token;
}

async function mgmtFetch(path: string, options: RequestInit = {}) {
  const token = await getManagementToken();
  const res = await fetch(`https://${process.env.AUTH0_DOMAIN}/api/v2${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Auth0 Management API error (${res.status}): ${err}`);
  }
  return res.status === 204 ? null : res.json();
}

export async function createAuth0User(
  email: string,
  password: string,
  name: string,
) {
  return mgmtFetch("/users", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      name,
      connection: "Username-Password-Authentication",
    }),
  });
}

export async function createAuth0Organization(companyName: string) {
  const name = companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 50);
  return mgmtFetch("/organizations", {
    method: "POST",
    body: JSON.stringify({
      name: `${name}-${Date.now().toString(36)}`, // must be unique
      display_name: companyName,
    }),
  });
}

export async function addUserToOrganization(orgId: string, userId: string) {
  return mgmtFetch(`/organizations/${orgId}/members`, {
    method: "POST",
    body: JSON.stringify({ members: [userId] }),
  });
}

export async function getRoleIdByName(roleName: string): Promise<string> {
  const roles = await mgmtFetch(`/roles?name_filter=${roleName}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const match = roles.find((r: any) => r.name === roleName);
  if (!match) throw new Error(`Role "${roleName}" not found in Auth0`);
  return match.id;
}

export async function assignOrgRole(
  orgId: string,
  userId: string,
  roleId: string,
) {
  return mgmtFetch(`/organizations/${orgId}/members/${userId}/roles`, {
    method: "POST",
    body: JSON.stringify({ roles: [roleId] }),
  });
}

export async function inviteUserToOrganization(
  orgId: string,
  inviteeEmail: string,
  roleId: string,
  inviterName: string,
) {
  return mgmtFetch(`/organizations/${orgId}/invitations`, {
    method: "POST",
    body: JSON.stringify({
      inviter: { name: inviterName },
      invitee: { email: inviteeEmail },
      client_id: process.env.AUTH0_CLIENT_ID,
      roles: [roleId],
      send_invitation_email: true,
    }),
  });
}

export async function findOrgIdByUserEmail(
  email: string,
): Promise<string | null> {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("tenant_id")
    .eq("email", email)
    .single();

  if (error || !data) {
    return null;
  }

  return data.tenant_id;
}

export async function enableConnectionForOrg(
  orgId: string,
  connectionName = "Username-Password-Authentication",
) {
  const connections = await mgmtFetch(`/connections?name=${connectionName}`);
  const connectionId = connections[0]?.id;
  if (!connectionId)
    throw new Error(`Connection "${connectionName}" not found`);

  return mgmtFetch(`/organizations/${orgId}/enabled_connections`, {
    method: "POST",
    body: JSON.stringify({
      connection_id: connectionId,
      assign_membership_on_login: false,
    }),
  });
}

export async function getOrganizationMembers(orgId: string) {
  const members = await mgmtFetch(`/organizations/${orgId}/members`);

  const membersWithRoles = await Promise.all(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    members.map(async (member: any) => {
      const roles = await mgmtFetch(
        `/organizations/${orgId}/members/${member.user_id}/roles`,
      );
      return {
        id: member.user_id,
        email: member.email,
        name: member.name ?? member.email,
        role: roles[0]?.name ?? "viewer",
        tenantId: orgId,
        createdAt: new Date(),
      };
    }),
  );

  return membersWithRoles;
}

export async function deleteAuth0User(userId: string) {
  return mgmtFetch(`/users/${encodeURIComponent(userId)}`, {
    method: "DELETE",
  });
}

export async function deleteAuth0Organization(orgId: string) {
  return mgmtFetch(`/organizations/${orgId}`, {
    method: "DELETE",
  });
}
