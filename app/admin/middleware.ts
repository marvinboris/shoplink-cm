import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const adminCookie = req.cookies.get('shoplink_admin');
  const isLoginPage = req.nextUrl.pathname === '/admin/login';

  // If not authenticated and not on login page, redirect to login
  if ((!adminCookie || adminCookie.value !== 'true') && !isLoginPage) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  // If authenticated and on login page, redirect to dashboard
  if (adminCookie && adminCookie.value === 'true' && isLoginPage) {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
