import { z } from "zod";
import { tError, tProcedure, tRouter } from "../../config";
import { getPost, loadFeed, newPost } from "./controllers";
import postActionRouter from "./actions/actions-router";

const postRouter = tRouter({
  loadFeed: tProcedure
    .input(
      z.object({ cursor: z.string().nullish() }).default({ cursor: undefined })
    )
    .query(async ({ input, ctx }) => {
      const { token } = ctx.auth;
      if (!token) {
        // TODO: load random feed
        throw new tError({ message: "no user token", code: "FORBIDDEN" });
      }
      const feed = await loadFeed({ token, size: 20, cursor: input.cursor });

      switch (feed.ok) {
        case true: {
          return { ok: feed.ok, data: feed.data };
        }
        case false: {
          switch (feed.message) {
            case "an error occured":
            case "failed to generate feed": {
              throw new tError({
                message: "an error occured",
                code: "INTERNAL_SERVER_ERROR",
                cause: feed.message,
              });
            }
            case "user token is missing": {
              throw new tError({
                message: "please sign up or login",
                code: "UNAUTHORIZED",
                cause: feed.message,
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
  newPost: tProcedure
    .input(
      z.object({
        content: z.string().max(200),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { token } = ctx.auth;
      if (!token) {
        throw new tError({
          code: "FORBIDDEN",
          message: "user token is missing",
        });
      }
      const createPost = await newPost(token, input.content);

      if (createPost.ok) {
        return { ok: true, data: createPost.data } as const;
      } else {
        switch (createPost.message) {
          case "an error occurred": {
            throw new tError({
              code: "INTERNAL_SERVER_ERROR",
              message: createPost.message,
              cause: createPost.cause,
            });
          }
          case "token validation failed": {
            throw new tError({
              code: "UNAUTHORIZED",
              message: createPost.message,
              cause: createPost.cause,
            });
          }
        }
      }
    }),
  getPost: tProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const post = await getPost(input.slug);
      switch (post.ok) {
        case true: {
          return { ok: post.ok, data: post.data };
        }
        case false: {
          switch (post.message) {
            case "post not found": {
              throw new tError({
                message: "no post was found",
                code: "NOT_FOUND",
                cause: post.message,
              });
            }
            case "an error occured": {
              throw new tError({
                message: post.message,
                code: "INTERNAL_SERVER_ERROR",
              });
            }
          }
        }
      }
    }),
  actions: postActionRouter,
});

export default postRouter;
