import { NextRequest, NextResponse } from 'next/server';

// Simple middleware that checks for the auth session cookie
// The actual auth verification happens in the route handlers/pages
export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('better-auth.session_token');
  
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/register');
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') || 
                           request.nextUrl.pathname.startsWith('/notes');

  // Redirect authenticated users away from auth pages
  if (sessionCookie && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users to login
  if (!sessionCookie && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/notes/:path*', '/login', '/register'],
};
