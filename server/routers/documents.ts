import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../trpc";
import { createChunk, extractText } from "../services/processor";
import { after } from "next/server";

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
        filePath: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { fileName, fileUrl, filePath } = input;

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

      const { data: documentRow, error: dbError } = await ctx.supabase
        .from("documents")
        .insert({
          tenant_id: ctx.claims.orgId,
          uploaded_by: ctx.claims.sub,
          name: fileName,
          file_type: getSimpleFileType(fileName),
          file_url: fileUrl,
          status: "processing",
        })
        .select()
        .single();

      if (dbError) {
        throw new Error(dbError.message);
      }

      after(async () => {
        try {
          const { data: fileData } = await ctx.supabase.storage
            .from("documents")
            .download(filePath);

          if (!fileData) {
            throw new Error("File not found in storage");
          }

          const arrayBuffer = await fileData.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const rawText = await extractText(buffer, documentRow.file_type);

          const { vectors, chunks } = await createChunk(rawText);

          const chunkRows = chunks.map((chunk, i) => ({
            document_id: documentRow.id,
            tenant_id: ctx.claims.orgId,
            content: chunk.pageContent,
            embedding: `[${vectors[i].join(",")}]`,
            chunk_index: i,
          }));

          const { error: chunkError } = await ctx.supabase
            .from("document_chunks")
            .insert(chunkRows);

          if (chunkError) throw new Error(chunkError.message);

          await ctx.supabase
            .from("documents")
            .update({ status: "ready" })
            .eq("id", documentRow.id);
        } catch (err) {
          console.log("Error processing document:", err);
          await ctx.supabase
            .from("documents")
            .update({ status: "failed" })
            .eq("id", documentRow.id);
        }
      });

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
      const { error } = await ctx.supabase.storage
        .from("documents")
        .remove([filePath]);

      if (error) throw new Error(error.message);
    }),
});
