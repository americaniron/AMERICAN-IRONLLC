import { clerkMiddleware, getAuth, requireAuth as clerkRequireAuth } from "@clerk/express";
import { createClerkClient } from "@clerk/express";
import type { Express, RequestHandler } from "express";
import { authStorage } from "./auth-storage";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

/**
 * Sets up Clerk middleware on the Express app.
 * Replaces Replit Auth's setupAuth().
 */
export async function setupAuth(app: Express): Promise<void> {
  app.use(clerkMiddleware());
}

/**
 * Auth middleware that:
 * 1. Verifies the Clerk session
 * 2. Fetches the full user from Clerk
 * 3. Upserts into local users table (preserving existing shape)
 * 4. Sets req.user.claims to match Replit Auth's shape so routes don't need changes
 */
export const isAuthenticated: RequestHandler = async (req: any, res, next) => {
  try {
    const auth = getAuth(req);
    if (!auth.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Fetch full user from Clerk
    const clerkUser = await clerkClient.users.getUser(auth.userId);
    const email = clerkUser.primaryEmailAddress?.emailAddress ?? null;

    // Upsert into local users table
    await authStorage.upsertUser({
      id: auth.userId,
      email,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      profileImageUrl: clerkUser.imageUrl,
    });

    // Match Replit Auth shape so existing routes work unchanged
    req.user = {
      claims: {
        sub: auth.userId,
        email,
        first_name: clerkUser.firstName,
        last_name: clerkUser.lastName,
        profile_image_url: clerkUser.imageUrl,
      },
    };

    next();
  } catch (err) {
    console.error("[auth] isAuthenticated error:", err);
    res.status(401).json({ message: "Unauthorized" });
  }
};

/**
 * Registers /api/auth/user route.
 * Login/logout are handled client-side by Clerk's <SignIn> / <SignOut> components.
 */
export function registerAuthRoutes(app: Express): void {
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await authStorage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
}
