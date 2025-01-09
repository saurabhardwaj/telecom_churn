import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const path = request.nextUrl.pathname;
  const isPublicPath = ['/', '/login', '/signup'].includes(path);

  if(['/login', '/signup'].includes(path) && session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if(!isPublicPath && !session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next();
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/property-overview',
    '/investment-details',
  ],
}