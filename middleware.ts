import { clerkMiddleware } from '@clerk/nextjs/server'
 
export default clerkMiddleware({
  // Routes that can be accessed while signed out
  // publicRoutes: [
  //   "/",
  //   "/about",
  //   "/contact",
  //   "/courses",
  //   "/api/webhooks(.*)"
  // ],
});
 
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
