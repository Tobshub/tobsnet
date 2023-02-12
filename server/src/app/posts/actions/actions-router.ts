import { z } from "zod";
import { tError, tProcedure, tRouter } from "../../../config";
import { likePost } from "./controllers";
// TODO:
// delete post
// unlike post
// comment on post/comment -> infinity
const postActionRouter = tRouter({
  likePost: tProcedure
    .input(
      z.object({
        slug: z.string(),
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { token } = ctx.auth;
      if (!token) {
        throw new tError({
          code: "UNAUTHORIZED",
          message: "user token is missing",
        });
      }
      const post = await likePost(token, {
        slug: input.slug,
        id: input.postId,
      });
      if (post.ok) {
        return { ok: true, data: post.data };
      } else {
        switch (post.message) {
          case "an error occured": {
            throw new tError({
              code: "INTERNAL_SERVER_ERROR",
              message: post.message,
            });
          }
          case "post not found": {
            throw new tError({ code: "NOT_FOUND", message: post.message });
          }
          case "token validation failed": {
            throw new tError({ code: "UNAUTHORIZED", message: post.message });
          }
        }
      }
    }),
});

export default postActionRouter;
