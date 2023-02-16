import { tRouter, tProcedure, tError } from "../../config";
import z from "zod";
import { signUp, login } from "./controllers";
import token from "../auth/token";
import { NotOk, Ok } from "../../helpers";

/** endpoints for user-related operations */
const userRouter = tRouter({
  signUp: tProcedure
    .input(
      z.object({
        username: z.string(),
        email: z.string().email(),
        password: z.string().min(8).max(64) /* for opusbopus :) */,
      })
    )
    .mutation(async ({ input }) => {
      const res = await signUp(input);
      if (res.ok) {
        return Ok(res.data);
      } else {
        switch (res.message) {
          case "an error occured":
          case "could not generate token": {
          }
          case "user already exists": {
            throw new tError({ message: "could not create user", code: "FORBIDDEN", cause: res.message });
          }
          default: {
            throw new tError({ message: "unexpected", code: "INTERNAL_SERVER_ERROR" });
          }
        }
      }
    }),
  login: tProcedure
    .input(
      z.object({
        userData: z.object({ email: z.string().email(), password: z.string().min(8).max(64) }),
        options: z.object({ expires: z.union([z.literal("short"), z.literal("long")]).default("short") }),
      })
    )
    .mutation(async ({ input }) => {
      const res = await login(input.userData, input.options);

      if (res.ok) {
        return Ok(res.data);
      } else {
        switch (res.message) {
          case "an error occured":
          case "could not generate token": {
            throw new tError({ message: res.message, code: "INTERNAL_SERVER_ERROR", cause: res.cause });
          }
          case "user not found": {
            throw new tError({ message: "not found", code: "NOT_FOUND", cause: res.cause });
          }
          case "wrong password": {
            throw new tError({ message: "invalid login details", code: "UNAUTHORIZED", cause: res.cause });
          }
          default: {
            throw new tError({ message: "unexpected", code: "INTERNAL_SERVER_ERROR" });
          }
        }
      }
    }),
  validateToken: tProcedure.query(async ({ ctx }) => {
    const { token: userToken } = ctx.auth;
    if (!userToken) return NotOk("token is missing");
    const valid = await token.validate(userToken);
    return valid;
  }),
});

export default userRouter;
