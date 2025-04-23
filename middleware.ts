import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define which routes are public (accessible without authentication)
// const isPublicRoute = createRouteMatcher([
//   "/",
//   "/about",
//   "/contact",
//   "/courses", // The courses listing page is public
//   "/sign-in",
//   "/sign-up",
//   "/api/webhooks(.*)"
// ]);

// Define which routes require authentication
const isProtectedRoute = createRouteMatcher([
  "/courses/(.*)" // This matches /courses/{slug} pattern for course detail pages
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();
  
  // If the user is not authenticated and trying to access a protected route
  if (!userId && isProtectedRoute(req)) {
    // Get the current URL to redirect back after sign-in
    const currentUrl = req.url;
    
    // Redirect to sign-in page with the redirect URL
    return redirectToSignIn({ returnBackUrl: currentUrl });
  }
});
 
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
