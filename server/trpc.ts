import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { auth0, parseClaims } from "../lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function createTRPCContext() {
  const session = await auth0.getSession();
  const claims = session?.user ? parseClaims(session.user) : null;

  return {
    claims,
    supabase: supabaseAdmin,
  };
}

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

// Requires any logged-in user with a valid role + org
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.claims || !ctx.claims.role || !ctx.claims.orgId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      claims: ctx.claims, // now narrowed to non-null for downstream procedures
    },
  });
});

// Requires the logged-in user to be an admin within their org
export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.claims.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }
  return next({ ctx });
});

// Requires the tenant-independent super admin flag
export const superAdminProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.claims?.isSuperAdmin) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Super admin access required",
    });
  }
  return next({ ctx });
});
