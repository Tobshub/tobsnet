import { z } from "zod";
import { tError, tProcedure, tRouter } from "../../../config";
import { addComment, deletePost, likePost, unlikePost } from "./controllers";
import { NotOk } from "../../../helpers";

// TODO:
// unlike post
// comment on comment
const postActionRouter = tRouter({
  likePost: tProcedure.input(z.object({ postId: z.string() })).mutation(async ({ ctx, input }) => {
    const { token } = ctx.auth;
    if (!token) {
      throw new tError({ code: "FORBIDDEN", message: "user token is missing" });
    }
    const res = await likePost(token, input.postId);
    if (res.ok) {
      return res;
    } else {
      switch (res.message) {
        case "an error occured": {
          throw new tError({ code: "INTERNAL_SERVER_ERROR", ...res });
        }
        case "post not found": {
          throw new tError({ code: "NOT_FOUND", ...res });
        }
        case "token validation failed": {
          throw new tError({ code: "UNAUTHORIZED", ...res });
        }
        case "user has already liked this post": {
          return res;
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
    const res = await unlikePost(token, input.postId);

    if (res.ok) {
      return res;
    } else {
      switch (res.message) {
        case "an error occured": {
          throw new tError({ code: "INTERNAL_SERVER_ERROR", ...res });
        }
        case "post not found": {
          throw new tError({ code: "NOT_FOUND", ...res });
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
  deletePost: tProcedure.input(z.object({ postId: z.string() })).mutation(async ({ ctx, input }) => {
    const { token } = ctx.auth;
    if (!token) {
      throw new tError({ code: "FORBIDDEN", message: "user token is missing" });
    }

    const res = await deletePost(token, input.postId);

    if (res.ok) {
      return res;
    } else {
      switch (res.message) {
        case "an error occured": {
          throw new tError({ code: "INTERNAL_SERVER_ERROR", ...res });
        }
        case "post does not belong to this user": {
          throw new tError({ code: "UNAUTHORIZED", message: "cannot delete that post", cause: res.message });
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
      const res = await addComment(token, input.postId, { content: input.content });

      if (res.ok) {
        return res;
      } else {
        switch (res.message) {
          case "an error occured": {
            throw new tError({ code: "INTERNAL_SERVER_ERROR", ...res });
          }
          case "post not found": {
            throw new tError({ code: "NOT_FOUND", ...res });
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
});

export default postActionRouter;
