import { z } from "zod";
import { tProcedure, tRouter } from "../../config";
import { loadFeed } from "./controllers";

const postRouter = tRouter({
  loadFeed: tProcedure
    .input(z.object({ cursor: z.string().nullish() }))
    .query(async ({ input, ctx }) => {
      const { token } = ctx.auth;
      if (!token) {
        // load random feed
        return;
      }
      const feed = await loadFeed({ token, size: 20, cursor: input.cursor });
    }),
});

export default postRouter;
