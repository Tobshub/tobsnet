import { tProcedure, tRouter } from "../../config/trpc";

const postRouter = tRouter({
  loadFeed: tProcedure.query(async ({ ctx }) => {
    if (ctx.auth) {
      // load custom feed
    } else {
      // load random feed
    }
  }),
});

export default postRouter;
