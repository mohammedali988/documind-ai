import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { convertToNumber } from "../services/processor";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const conversationsRouter = router({
  aiSearchingProcedure: protectedProcedure
    .input(
      z.object({
        userText: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userText } = input;

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

      const prompt = `You are a helpful assistant. Use ONLY the following context to answer the question. If the answer is not in the context, say "I don't have enough information." Context:${context} Question: ${userText} Answer:`;

      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

        const model = genAI.getGenerativeModel({
          model: "gemini-2.5-flash",
        });

        const result = await model.generateContent(prompt);
        const answer = result.response.text();

        console.log(answer, "here is the answer");
      } catch (error) {
        console.error("Gemini Error:", error);
      }

      return "";
    }),
});
