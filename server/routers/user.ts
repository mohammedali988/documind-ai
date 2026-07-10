import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../trpc";

export const userRouter = router({
  me: protectedProcedure.query(({ ctx }) => {
    return ctx.claims;
  }),

  listTeamMembers: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from("users")
      .select("*")
      .eq("tenant_id", ctx.claims.orgId);

    if (error) throw new Error(error.message);
    return data;
  }),

  updateRole: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(["admin", "manager", "viewer"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Tenant-scoped update — only affects a row if it belongs to the
      // admin's own org, even if someone tampers with userId client-side.
      const { error } = await ctx.supabase
        .from("users")
        .update({ role: input.role })
        .eq("id", input.userId)
        .eq("tenant_id", ctx.claims.orgId);

      if (error) throw new Error(error.message);
      return { success: true };
    }),

  removeMember: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase
        .from("users")
        .delete()
        .eq("id", input.userId)
        .eq("tenant_id", ctx.claims.orgId);

      if (error) throw new Error(error.message);
      return { success: true };
    }),
});
