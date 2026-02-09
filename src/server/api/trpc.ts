/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { db } from "@/server/db";
import { auth, currentUser } from "@clerk/nextjs/server";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    db,
    ...opts,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Middleware that:
 * 1. Checks if user is authenticated with Clerk
 * 2. Syncs user to database if they don't exist
 * 3. Adds user to context
 */
const enforceClerkUserIsAuthed = t.middleware(async ({ ctx, next }) => {
  const { userId } = await auth();
  console.log("Auth userId:", userId);

  if (!userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  // Check if user exists in database
  let dbUser = await ctx.db.user.findUnique({
    where: { id: userId },
  });

  // If user doesn't exist, sync from Clerk
  if (!dbUser) {
    console.log("User not in DB, syncing from Clerk...");
    
    const clerkUser = await currentUser();

    if (!clerkUser) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not found in Clerk",
      });
    }

    const email = clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId
    )?.emailAddress;

    dbUser = await ctx.db.user.create({
      data: {
        id: clerkUser.id,
        email: email || "",
        firstName: clerkUser.firstName || "",
        lastName: clerkUser.lastName || "",
        image: clerkUser.imageUrl,
      },
    });

    console.log("User synced to database:", dbUser.id);
  }

  return next({
    ctx: {
      ...ctx,
      userId: userId,
      user: dbUser, // 👈 Now ctx.user is available!
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceClerkUserIsAuthed);

// 👆 Changed to lowercase "protectedProcedure" for consistency

/**
 * Middleware for timing procedure execution and adding an artificial delay in development.
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

export const publicProcedure = t.procedure.use(timingMiddleware);