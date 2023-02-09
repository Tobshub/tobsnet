import jwt from "jsonwebtoken";
import { env } from "../..";

const token = {
  /** Generate new jwt token */
  async generate(payload: string, options?: { expires: "short" | "long" }) {
    try {
      if (!env.jwtSecret) {
        console.error("jwt secret missing");
        return { ok: false, message: "jwt secret is missing" } as const;
      }
      /** generated token from @param payload and `jwt secret` */
      const token = jwt.sign(
        { iat: Date.now(), payload },
        env.jwtSecret,
        /* short logins expire after 1 day */
        { expiresIn: options?.expires === "long" ? "30d" : "1d" }
      );
      return { ok: true, token } as const;
    } catch (error) {
      console.error(error);
      return { ok: false, message: "could not generate token" } as const;
    }
  },

  /** Validate jwt token */
  async validate(token: string) {
    try {
      if (!env.jwtSecret) {
        console.error("jwt secret missing");
        return { ok: false, message: "jwt secret is missing" } as const;
      }
      // verify the token and return the payload
      const isValidToken = jwt.verify(token, env.jwtSecret) as {
        iat: number;
        payload: string;
      };
      return { ok: true, token: isValidToken.payload } as const;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return { ok: false, message: "token expired" } as const;
      }
      console.error(error);
      return { ok: false, message: "could not validate token" } as const;
    }
  },
};

export default token;
