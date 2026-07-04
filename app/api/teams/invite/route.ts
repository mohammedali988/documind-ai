import { NextRequest, NextResponse } from 'next/server';
import { inviteUserToOrganization, getRoleIdByName } from '@/lib/auth0-management';
import { auth0 } from '@/lib/auth';

const NAMESPACE = 'https://documind.ai';

export async function POST(req: NextRequest) {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const role = user[`${NAMESPACE}/role`];
  const orgId = user[`${NAMESPACE}/org_id`];

  if (role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!orgId) {
    return NextResponse.json({ error: 'No organization found for user' }, { status: 400 });
  }

  const { email, role: inviteeRole } = await req.json();
  if (!['manager', 'viewer'].includes(inviteeRole)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  const roleId = await getRoleIdByName(inviteeRole);
  await inviteUserToOrganization(orgId, email, roleId, user.name ?? user.email ?? 'DocuMind AI Admin');

  return NextResponse.json({ success: true });
}