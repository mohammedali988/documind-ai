import { router } from "../trpc";
import { conversationsRouter } from "./conversations";
import { documentsRouter } from "./documents";
import { userRouter } from "./user";

export const appRouter = router({
  user: userRouter,
  documents: documentsRouter,
  conversations:conversationsRouter,
});

export type AppRouter = typeof appRouter;
