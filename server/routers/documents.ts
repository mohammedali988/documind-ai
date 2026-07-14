import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../trpc";
import { supabaseAdmin } from "@/lib/supabase";

export const documentsRouter = router({
  me: protectedProcedure.query(({ ctx }) => {
    return ctx.claims;
  }),

  addDocumentsProcedure: adminProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileType: z.string(),
        fileUrl: z.string().url(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { fileName, fileType, fileUrl } = input;

      const { data: documentRow, error: dbError } = await supabaseAdmin
        .from("documents")
        .insert({
          tenant_id: ctx.claims.orgId,
          uploaded_by: ctx.claims.sub,
          name: fileName,
          file_type: fileType,
          file_url: fileUrl,
          status: "Ready",
        })
        .select()
        .single();

      if (dbError) {
        throw new Error(dbError.message);
      }

      return documentRow;
    }),

  deleteDocumentsProcedure: adminProcedure
    .input(
      z.object({
        filePath: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { filePath } = input;
      const { error } = await supabaseAdmin.storage
        .from("documents")
        .remove([filePath]);

      if (error) throw new Error(error.message);
    }),
});
