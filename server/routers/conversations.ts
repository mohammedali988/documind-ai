import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { convertToNumber } from "../services/processor";
import { aiProcess } from "../services/ai";

export const conversationsRouter = router({
  createConversation: protectedProcedure
    .input(
      z.object({
        title: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from("conversations")
        .insert({
          tenant_id: ctx.claims.orgId,
          user_id: ctx.claims.sub,
          title: input.title,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    }),

  aiSearchingProcedure: protectedProcedure
    .input(
      z.object({
        userText: z.string(),
        conversationId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userText, conversationId } = input;

      const { data, error: userMessageError } = await ctx.supabase
        .from("messages")
        .insert({
          tenant_id: ctx.claims.orgId,
          conversation_id: conversationId,
          role: "user",
          content: userText,
        });

      if (userMessageError)
        throw new Error(
          "there is something wrong while saving message in the conversation table",
        );

      const vectors = await convertToNumber(userText);

      const { data: matches, error } = await ctx.supabase.rpc(
        "match_document_chunks",
        {
          query_embedding: `[${vectors.join(",")}]`,
          match_tenant_id: ctx.claims.orgId,
          match_count: 5,
        },
      );

      if (error) throw new Error(error.message);

      // Combine chunks into context string
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const context = matches.map((m: any) => m.content).join("\n\n---\n\n");
      const result = await aiProcess(context, userText);

      if (result) {
        const { data, error: aiMessageError } = await ctx.supabase
          .from("messages")
          .insert({
            tenant_id: ctx.claims.orgId,
            conversation_id: conversationId,
            role: "assistant",
            content: result,
          });

        if (aiMessageError)
          throw new Error(
            "something Wrong while saving in conversations from AI response",
          );
      }

      return result;
    }),

  listAllConversations: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from("conversations")
      .select("*")
      .eq("tenant_id", ctx.claims.orgId) // same company
      .eq("user_id", ctx.claims.sub) // same user
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }),
});
