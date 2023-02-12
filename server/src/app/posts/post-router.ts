import { z } from "zod";
import { tError, tProcedure, tRouter } from "../../config";
import { getPost, loadFeed, newPost } from "./controllers";

const postRouter = tRouter({
  loadFeed: tProcedure
    .input(z.object({ cursor: z.string().nullish() }))
    .query(async ({ input, ctx }) => {
      const { token } = ctx.auth;
      if (!token) {
        // TODO: load random feed
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
  newPost: tProcedure
    .input(
      z.object({
        content: z.string().max(200),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { token } = ctx.auth;
      const createPost = await newPost(token, input.content);

      switch (createPost.ok) {
        case true: {
          return { ok: true, data: createPost.data };
        }
        case false: {
          throw new tError({
            message: createPost.message,
            code:
              createPost.message === "user token is missing"
                ? "UNAUTHORIZED"
                : "INTERNAL_SERVER_ERROR",
            cause: createPost.cause,
          });
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
});

export default postRouter;
