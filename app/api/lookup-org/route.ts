import { NextRequest, NextResponse } from 'next/server';

async function getManagementToken(): Promise<string> {
  const res = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.AUTH0_M2M_CLIENT_ID,
      client_secret: process.env.AUTH0_M2M_CLIENT_SECRET,
      audience: process.env.AUTH0_MGMT_AUDIENCE,
      grant_type: 'client_credentials',
    }),
  });
  const data = await res.json();
  return data.access_token;
}

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }

  try {
    const token = await getManagementToken();

    const userRes = await fetch(
      `https://${process.env.AUTH0_DOMAIN}/api/v2/users-by-email?email=${encodeURIComponent(email)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const users = await userRes.json();

    if (!users.length) {
      return NextResponse.json({ error: 'No account found' }, { status: 404 });
    }

    const userId = users[0].user_id;

    const orgsRes = await fetch(
      `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}/organizations`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const orgs = await orgsRes.json();

    if (!orgs.length) {
      return NextResponse.json({ error: 'User has no organization' }, { status: 404 });
    }

    return NextResponse.json({ orgId: orgs[0].id });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Org lookup failed:', err);
    return NextResponse.json({ error: 'Lookup failed' }, { status: 500 });
  }
}