import { tRouter, tProcedure, tError } from "../../config";
import z from "zod";
import { signUp, login } from "./controllers/exports";

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
      switch (res.ok) {
        case true: {
          return { ok: true, token: res.token } as const;
        }
        case false: {
          switch (res.message) {
            case "an error occured":
            case "could not generate token": {
              throw new tError({
                message: res.message,
                code: "INTERNAL_SERVER_ERROR",
              });
            }
            case "user already exists": {
              throw new tError({
                message: "could not create user",
                code: "FORBIDDEN",
                cause: res.message,
              });
            }
          }
        }
        default: {
          return { ok: false, message: "something unexpected happened" };
        }
      }
    }),
  login: tProcedure
    .input(
      z.object({
        userData: z.object({
          email: z.string().email(),
          password: z.string().min(8).max(64),
        }),
        options: z.object({
          expires: z
            .union([z.literal("short"), z.literal("long")])
            .default("short"),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const res = await login(input.userData, input.options);

      switch (res.ok) {
        case true: {
          return { ok: res.ok, token: res.token } as const;
        }
        case false: {
          switch (res.message) {
            case "an error occured":
            case "could not generate token": {
              throw new tError({
                message: res.message,
                code: "INTERNAL_SERVER_ERROR",
              });
            }
            case "user not found": {
              throw new tError({ message: "not found", code: "NOT_FOUND" });
            }
            case "wrong password": {
              throw new tError({
                message: "invalid login details",
                code: "UNAUTHORIZED",
              });
            }
          }
        }
      }
    }),
});

export default userRouter;
