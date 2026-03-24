import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
// Only these routes are accessible without authentication
const isAllowedRoute = createRouteMatcher([
  '/',
  '/api(.*)',
  '/api/public(.*)',
  '/community(.*)',
  '/dashboard/tutorial(.*)',
  '/dashboard/tutorial/(.*)/chapter/(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isAllowedRoute(request)) {
    return NextResponse.rewrite(new URL('/community', request.url))
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};