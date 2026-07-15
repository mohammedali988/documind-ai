import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../trpc";
import { supabaseAdmin } from "@/lib/supabase";

export const documentsRouter = router({
  me: protectedProcedure.query(({ ctx }) => {
    return ctx.claims;
  }),

  listDocuments: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from("documents")
      .select("*, uploaded_by_user:users!uploaded_by(name, email)")
      .eq("tenant_id", ctx.claims.orgId);

    if (error) {
      throw new Error(error.message);
    }

    return data;
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
      const { fileName, fileUrl } = input;

      const getSimpleFileType = (fileName: string): string => {
        const ext = fileName.split(".").pop()?.toLowerCase() || "";

        const typeMap: Record<string, string> = {
          pdf: "pdf",
          doc: "doc",
          docx: "docx",
          txt: "text",
        };

        return typeMap[ext] || ext || "unknown";
      };

      const { data: documentRow, error: dbError } = await supabaseAdmin
        .from("documents")
        .insert({
          tenant_id: ctx.claims.orgId,
          uploaded_by: ctx.claims.sub,
          name: fileName,
          file_type: getSimpleFileType(fileName),
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
