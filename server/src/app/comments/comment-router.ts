import { z } from "zod";
import { tError, tProcedure, tRouter } from "../../config";
import { deleteComment, likeComment, newReply, unlikeComment } from "./controllers";

/* TODO: 
  unlike comment
*/
const commentRouter = tRouter({
  newReply: tProcedure
    .input(z.object({ content: z.string(), parentId: z.string(), postId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { token } = ctx.auth;
      if (!token) {
        throw new tError({ code: "FORBIDDEN", message: "user token is missing" });
      }

      const res = await newReply(token, input);

      if (res.ok) {
        return res;
      } else {
        switch (res.message) {
          case "an error occured": {
            throw new tError({ code: "INTERNAL_SERVER_ERROR", ...res });
          }
          case "token validation failed": {
            throw new tError({ code: "UNAUTHORIZED", ...res });
          }
          case "parent comment not found": {
            throw new tError({ code: "NOT_FOUND", ...res });
          }
          default: {
            throw new tError({ code: "METHOD_NOT_SUPPORTED", message: "unexpected" });
          }
        }
      }
    }),
  likeComment: tProcedure.input(z.object({ id: z.string() })).mutation(async ({ input, ctx }) => {
    const { token } = ctx.auth;
    if (!token) {
      throw new tError({ code: "FORBIDDEN", message: "user token is missing" });
    }
    const res = await likeComment(token, input);

    if (res.ok) {
      return res;
    } else {
      switch (res.message) {
        case "an error occured": {
          throw new tError({ code: "INTERNAL_SERVER_ERROR", ...res });
        }
        case "comment not found": {
          throw new tError({ code: "NOT_FOUND", ...res });
        }
        case "token validation failed": {
          throw new tError({ code: "UNAUTHORIZED", ...res });
        }
        default: {
          throw new tError({ code: "METHOD_NOT_SUPPORTED" });
        }
      }
    }
  }),
  unlikeComment: tProcedure.input(z.object({ id: z.string() })).mutation(async ({ input, ctx }) => {
    const { token } = ctx.auth;
    if (!token) {
      throw new tError({ code: "FORBIDDEN", message: "user token is missing" });
    }

    const res = await unlikeComment(token, input);

    if (res.ok) {
      return res;
    } else {
      switch (res.message) {
        case "an error occured": {
          throw new tError({ code: "INTERNAL_SERVER_ERROR", ...res });
        }
        case "comment not found": {
          throw new tError({ code: "NOT_FOUND", ...res });
        }
        case "token validation failed": {
          throw new tError({ code: "UNAUTHORIZED", ...res });
        }
        default: {
          throw new tError({ code: "METHOD_NOT_SUPPORTED" });
        }
      }
    }
  }),
  deleteComment: tProcedure
    .input(z.object({ id: z.string(), postId: z.string(), parentId: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      const { token } = ctx.auth;
      if (!token) {
        throw new tError({ code: "FORBIDDEN", message: "user token is missing" });
      }

      const res = await deleteComment(token, input);

      if (res.ok) {
        return res;
      } else {
        switch (res.message) {
          case "an error occured": {
            throw new tError({ code: "INTERNAL_SERVER_ERROR", ...res });
          }
          case "comment not found": {
            throw new tError({ code: "NOT_FOUND", ...res });
          }
          case "token validation failed": {
            throw new tError({ code: "UNAUTHORIZED", ...res });
          }
          default: {
            throw new tError({ code: "METHOD_NOT_SUPPORTED", message: "unexpected" });
          }
        }
      }
    }),
});

export default commentRouter;
