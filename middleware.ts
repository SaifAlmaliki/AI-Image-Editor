/**
 * Authentication Middleware Configuration
 *
 * This middleware handles authentication for the application using Clerk.
 * It defines which routes are public (accessible without authentication)
 * and which routes require authentication.
 *
 * Features:
 * - Protects all routes by default
 * - Configures specific public routes for unauthenticated access
 * - Sets up route matching patterns for Next.js
 */

import { authMiddleware } from "@clerk/nextjs";

// Configure Clerk authentication middleware
export default authMiddleware({
  // Define routes that don't require authentication
  publicRoutes: [
    '/',                    // Home page
    '/api/webhooks/clerk',  // Clerk webhook endpoint
    '/api/webhooks/stripe'  // Stripe webhook endpoint
  ]
});

// Configure route matching for the middleware
export const config = {
  // Matcher configuration:
  // - Matches all routes except static files and _next
  // - Explicitly matches the root path
  // - Matches all API and tRPC routes
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)", // Match all except static files/_next
    "/",                            // Match root path
    "/(api|trpc)(.*)"              // Match API and tRPC routes
  ],
};