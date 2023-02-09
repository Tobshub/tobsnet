import { inferAsyncReturnType, initTRPC, TRPCError } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";

/** create context on each request */
export function createContext(ctx: trpcExpress.CreateExpressContextOptions) {
  const token = ctx.req.headers.authorization;
  return { auth: { token } };
}

type Context = inferAsyncReturnType<typeof createContext>;

const trpc = initTRPC.context<Context>().create();

/** define a trpc router */
export const tRouter = trpc.router;
/** define a trpc endpoint */
export const tProcedure = trpc.procedure;
/** throw an error in trpc  */
export const tError = TRPCError;
