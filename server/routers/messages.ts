import { z } from "zod";
import { router, adminProcedure } from "../trpc";

export const messagesRouter = router({
  getAllMessagesForConversation: adminProcedure
    .input(
      z.object({
        conversationId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from("messages")
        .select("*")
        .eq("tenant_id", ctx.claims.orgId)
        .eq("conversation_id", input.conversationId);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    }),
});
