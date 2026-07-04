import { NextResponse } from 'next/server';
import { auth0, parseClaims } from '@/lib/auth';
import { getOrganizationMembers } from '@/lib/auth0-management';

export async function GET() {
  const session = await auth0.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const claims = parseClaims(session.user);
  if (!claims.orgId) {
    return NextResponse.json({ error: 'No organization found' }, { status: 400 });
  }

  try {
    const members = await getOrganizationMembers(claims.orgId);
    return NextResponse.json({ members });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Failed to fetch team members:', err);
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 });
  }
}