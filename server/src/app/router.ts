import { createContext, tRouter } from "../config/trpc";
import * as trpcExpress from "@trpc/server/adapters/express";
import userRouter from "./users/user-router";

const appRouter = tRouter({
  users: userRouter,
});

export default trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext: createContext,
});

export type AppRouter = typeof appRouter;
