import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from './lib/auth';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let Auth0 handle its own routes first
  const authResponse = await auth0.middleware(request);

  // Get session to check role
  const session = await auth0.getSession(request);

  // Not logged in — Auth0 handles redirect
  if (!session) {
    return authResponse;
  }

  const userRole = session.user?.role || 
                   session.user?.app_metadata?.role || 
                   'viewer';

  const userEmail = session.user?.email;

  // Super admin — replace with your email
  const isSuperAdmin = userEmail === 'mohd.os.1998@gmail.com';

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    if (!isSuperAdmin) {
      return NextResponse.redirect(
        new URL('/unauthorized', request.url)
      );
    }
  }

  // Admin only dashboard routes
  const adminOnlyRoutes = [
    '/dashboard/team',
    '/dashboard/billing',
    '/dashboard/settings',
  ];

  const isAdminOnly = adminOnlyRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (isAdminOnly && userRole !== 'admin' && !isSuperAdmin) {
    return NextResponse.redirect(
      new URL('/unauthorized', request.url)
    );
  }

  return authResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};