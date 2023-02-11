import { z } from "zod";
import { tError, tProcedure, tRouter } from "../../config";
import { loadFeed } from "./controllers";

const postRouter = tRouter({
  loadFeed: tProcedure
    .input(z.object({ cursor: z.string().nullish() }))
    .query(async ({ input, ctx }) => {
      const { token } = ctx.auth;
      if (!token) {
        // load random feed
        throw new tError({ message: "no user token", code: "UNAUTHORIZED" });
      }
      const res = await loadFeed({ token, size: 20, cursor: input.cursor });

      switch (res.ok) {
        case true: {
          return { ok: res.ok, data: res.data };
        }
        case false: {
          switch (res.message) {
            case "an error occured":
            case "failed to generate feed": {
              throw new tError({
                message: "an error occured",
                code: "INTERNAL_SERVER_ERROR",
                cause: res.message,
              });
            }
            case "user token is missing": {
              throw new tError({
                message: "please sign up or login",
                code: "UNAUTHORIZED",
                cause: res.message,
              });
            }
          }
        }
        default: {
          console.error("something unexpected happened");
          throw new tError({
            message: "something unexpected happened",
            code: "BAD_REQUEST",
            cause: "unknown",
          });
        }
      }
    }),
});

export default postRouter;
