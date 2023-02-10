import * as trpcExpress from "@trpc/server/adapters/express";
import { createContext, tRouter } from "../config";
import userRouter from "./users/user-router";
import postRouter from "./posts/post-router";

const appRouter = tRouter({
  users: userRouter,
  posts: postRouter,
});

export default trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext: createContext,
});

export type AppRouter = typeof appRouter;
