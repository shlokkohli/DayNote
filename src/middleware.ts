export { default } from "next-auth/middleware"
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from 'next/server';

export const config = { matcher: ["/log", "/settings", "/summary", "/sign-up", '/'] }

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  if (token && (url.pathname === '/' || url.pathname === '/sign-up')) {
    return NextResponse.redirect(new URL('/log', request.url));
  }
  
  if (!token && ['/log', '/calendar', '/summary'].includes(url.pathname)) {
    return NextResponse.redirect(new URL('/sign-up', request.url));
  }

  return NextResponse.next();
}