import { z } from "zod";
import { tError, tProcedure, tRouter } from "../../../config";
import { addComment, deletePost, likePost, unlikePost } from "./controllers";
import { Ok } from "../../../helpers";
// TODO:
// unlike post
// comment on comment
const postActionRouter = tRouter({
  likePost: tProcedure.input(z.object({ postId: z.string() })).mutation(async ({ ctx, input }) => {
    const { token } = ctx.auth;
    if (!token) {
      throw new tError({ code: "FORBIDDEN", message: "user token is missing" });
    }
    const post = await likePost(token, input.postId);
    if (post.ok) {
      return Ok(post.data);
    } else {
      switch (post.message) {
        case "an error occured": {
          throw new tError({ code: "INTERNAL_SERVER_ERROR", message: post.message, cause: post.cause });
        }
        case "post not found": {
          throw new tError({ code: "NOT_FOUND", message: post.message });
        }
        case "token validation failed": {
          throw new tError({ code: "UNAUTHORIZED", message: post.message, cause: post.cause });
        }
        default: {
          throw new tError({ message: "unexpected", code: "METHOD_NOT_SUPPORTED" });
        }
      }
    }
  }),
  unlikePost: tProcedure.input(z.object({ postId: z.string() })).mutation(async ({ ctx, input }) => {
    const { token } = ctx.auth;
    if (!token) {
      throw new tError({ code: "FORBIDDEN", message: "user token is missing" });
    }
    const post = await unlikePost(token, input.postId);

    if (post.ok) {
      return Ok(post.data);
    } else {
      switch (post.message) {
        case "an error occured": {
          throw new tError({ code: "INTERNAL_SERVER_ERROR", message: post.message, cause: post.cause });
        }
        case "post not found": {
          throw new tError({ code: "NOT_FOUND", message: post.message });
        }
        case "token validation failed": {
          throw new tError({ code: "UNAUTHORIZED", message: post.message, cause: post.cause });
        }
        default: {
          throw new tError({ message: "unexpected", code: "METHOD_NOT_SUPPORTED" });
        }
      }
    }
  }),
  deletePost: tProcedure.input(z.object({ postId: z.string() })).mutation(async ({ ctx, input }) => {
    const { token } = ctx.auth;
    if (!token) {
      throw new tError({ code: "FORBIDDEN", message: "user token is missing" });
    }

    const deletedPost = await deletePost(token, input.postId);

    if (deletedPost.ok) {
      return Ok(deletedPost.data);
    } else {
      switch (deletedPost.message) {
        case "an error occured": {
          throw new tError({ message: deletedPost.message, code: "INTERNAL_SERVER_ERROR" });
        }
        case "post does not belong to this user": {
          throw new tError({ code: "UNAUTHORIZED", message: "can not delete that post", cause: deletedPost.message });
        }
        default: {
          throw new tError({ message: "unexpected", code: "METHOD_NOT_SUPPORTED" });
        }
      }
    }
  }),
  addComment: tProcedure
    .input(z.object({ postId: z.string(), content: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { token } = ctx.auth;
      if (!token) {
        throw new tError({ code: "FORBIDDEN", message: "user token is missing" });
      }
      const comment = await addComment(token, input.postId, { content: input.content });

      if (comment.ok) {
        return Ok(comment.data);
      } else {
        switch (comment.message) {
          case "an error occured": {
            throw new tError({ message: comment.message, code: "INTERNAL_SERVER_ERROR", cause: comment.cause });
          }
          case "post not found": {
            throw new tError({ code: "NOT_FOUND", message: comment.message, cause: comment.cause });
          }
          case "token validation failed": {
            throw new tError({ code: "UNAUTHORIZED", message: comment.message, cause: comment.cause });
          }
          default: {
            throw new tError({ message: "unexpected", code: "METHOD_NOT_SUPPORTED" });
          }
        }
      }
    }),
});

export default postActionRouter;
