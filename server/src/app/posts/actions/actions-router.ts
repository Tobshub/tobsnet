import { z } from "zod";
import { tError, tProcedure, tRouter } from "../../../config";
import { deletePost, likePost } from "./controllers";
// TODO:
// unlike post
// comment on post/comment -> infinity
const postActionRouter = tRouter({
  likePost: tProcedure
    .input(
      z.object({
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
      const post = await likePost(token, input.postId);
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
  unlikePost: tProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {}),
  deletePost: tProcedure
    .input(
      z.object({
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

      const deletedPost = await deletePost(token, input.postId);

      if (deletedPost.ok) {
        return { ok: true, data: deletedPost.data } as const;
      } else {
        switch (deletedPost.message) {
          case "an error occured": {
            throw new tError({
              message: deletedPost.message,
              code: "INTERNAL_SERVER_ERROR",
            });
          }
          case "post does not belong to this user": {
            throw new tError({
              code: "UNAUTHORIZED",
              message: "can not delete that post",
              cause: deletedPost.message,
            });
          }
        }
      }
    }),
});

export default postActionRouter;
