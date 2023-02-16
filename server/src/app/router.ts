import * as trpcExpress from "@trpc/server/adapters/express";
import { createContext, tRouter } from "../config";
import userRouter from "./users/user-router";
import postRouter from "./posts/post-router";
import commentRouter from "./comments/comment-router";

const appRouter = tRouter({
  users: userRouter,
  posts: postRouter,
  comments: commentRouter,
});

export default trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext: createContext,
});

export type AppRouter = typeof appRouter;
