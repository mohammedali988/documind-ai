// import { z } from "zod";
// import { router, protectedProcedure, adminProcedure } from "../trpc";
// import { supabaseAdmin } from "@/lib/supabase";

// export const documentsRouter = router({
//   me: protectedProcedure.query(({ ctx }) => {
//     return ctx.claims;
//   }),

//   addDocumentsProcedure: adminProcedure.query(async ({ ctx }) => {
//     const { data, error } = await supabaseAdmin.from("documents").upsert(
//        {
//          id: session.user.sub,
//          email: session.user.email,
//          name: session.user.name,
//          role,
//          tenant_id: orgId,
//        },
//        { onConflict: "id" },
//      );

// });
