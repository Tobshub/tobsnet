import { tRouter, tProcedure } from "../../config/trpc";
import z from "zod";

/** endpoints for user-related operations */
const userRouter = tRouter({
  signUp: tProcedure
    .input(
      z.object({
        username: z.string(),
        email: z.string().email(),
        password: z.string().min(8).max(64) /* for opusbopus */,
      })
    )
    .query(async ({ input }) => {}),
});

export default userRouter;
