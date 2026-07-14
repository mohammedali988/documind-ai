import { router } from "../trpc";
import { documentsRouter } from "./documents";
import { userRouter } from "./user";

export const appRouter = router({
  user: userRouter,
  documents: documentsRouter,
});

export type AppRouter = typeof appRouter;
