import { z } from "zod";
import { tError, tProcedure, tRouter } from "../../config";
import { newReply } from "./controllers";

/* TODO: 
  like comment
  unlike comment
  delete comment
  reply to comment/reply
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
});

export default commentRouter;
