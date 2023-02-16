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
        return Ok(feed.data);
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
    const createPost = await newPost(token, input.content);

    if (createPost.ok) {
      return Ok(createPost.data);
    } else {
      switch (createPost.message) {
        case "an error occurred": {
          throw new tError({ code: "INTERNAL_SERVER_ERROR", message: createPost.message, cause: createPost.cause });
        }
        case "token validation failed": {
          throw new tError({ code: "UNAUTHORIZED", message: createPost.message, cause: createPost.cause });
        }
        default: {
          throw new tError({ message: "unexpected", code: "METHOD_NOT_SUPPORTED" });
        }
      }
    }
  }),
  getPost: tProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
    const post = await getPost(input.slug);
    if (post.ok) {
      return Ok(post.data);
    } else {
      switch (post.message) {
        case "post not found": {
          throw new tError({ message: "no post was found", code: "NOT_FOUND", cause: post.message });
        }
        case "an error occured": {
          throw new tError({ message: post.message, code: "INTERNAL_SERVER_ERROR" });
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
