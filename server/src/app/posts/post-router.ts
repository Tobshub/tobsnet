import { z } from "zod";
import { tError, tProcedure, tRouter } from "../../config";
import { getPost, loadFeed, newPost } from "./controllers";
import postActionRouter from "./actions/actions-router";
import { Ok } from "../../helpers";

const postRouter = tRouter({
  loadFeed: tProcedure
    .input(z.object({ cursor: z.string().nullish() }).default({ cursor: undefined }))
    .query(async ({ input, ctx }) => {
      const { token } = ctx.auth;
      if (!token) {
        // TODO: load random feed
        throw new tError({ message: "no user token", code: "FORBIDDEN" });
      }
      const feed = await loadFeed({ token, size: 20, cursor: input.cursor });

      if (feed.ok) {
        return feed;
      } else {
        switch (feed.message) {
          case "an error occured":
          case "failed to generate feed": {
            throw new tError({ message: "an error occured", code: "INTERNAL_SERVER_ERROR", cause: feed.message });
          }
          case "user token is missing": {
            throw new tError({ message: "please sign up or login", code: "UNAUTHORIZED", cause: feed.message });
          }
          default: {
            throw new tError({ message: "unexpected", code: "METHOD_NOT_SUPPORTED" });
          }
        }
      }
    }),
  newPost: tProcedure.input(z.object({ content: z.string().max(200) })).mutation(async ({ input, ctx }) => {
    const { token } = ctx.auth;
    if (!token) {
      throw new tError({ code: "FORBIDDEN", message: "user token is missing" });
    }
    const res = await newPost(token, input.content);

    if (res.ok) {
      return res;
    } else {
      switch (res.message) {
        case "an error occurred": {
          throw new tError({ code: "INTERNAL_SERVER_ERROR", ...res });
        }
        case "token validation failed": {
          throw new tError({ code: "UNAUTHORIZED", ...res });
        }
        default: {
          throw new tError({ message: "unexpected", code: "METHOD_NOT_SUPPORTED" });
        }
      }
    }
  }),
  getPost: tProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
    const res = await getPost(input.slug);
    if (res.ok) {
      return res;
    } else {
      switch (res.message) {
        case "post not found": {
          throw new tError({ code: "NOT_FOUND", ...res });
        }
        case "an error occured": {
          throw new tError({ code: "INTERNAL_SERVER_ERROR", ...res });
        }
        default: {
          throw new tError({ message: "unexpected", code: "METHOD_NOT_SUPPORTED" });
        }
      }
    }
  }),
  actions: postActionRouter,
});

export default postRouter;
