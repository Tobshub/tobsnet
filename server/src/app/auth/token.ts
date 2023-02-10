import jwt from "jsonwebtoken";
import { env } from "../..";

type Payload = {
  iat: number;
  data: string;
};

const token = {
  /** Generate new jwt token */
  async generate(
    payloadInput: string,
    options?: { expires: "short" | "long" }
  ) {
    try {
      if (!env.jwtSecret) {
        console.error("jwt secret missing");
        return { ok: false, message: "jwt secret is missing" } as const;
      }
      const payload = { iat: Date.now(), data: payloadInput };
      /* short logins expire after 1 day */
      const expiresIn = options?.expires === "long" ? "30d" : "1d";

      /** generated token from @param payloadInput and `jwt secret` */
      const token = jwt.sign(payload, env.jwtSecret, { expiresIn });
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
      const isValidToken = jwt.verify(token, env.jwtSecret) as Payload;
      return { ok: true, token: isValidToken.data } as const;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return { ok: false, message: "token expired" } as const;
      }
      console.error(error);
      return { ok: false, message: "could not validate token" } as const;
    }
  },

  /** Decode jwt token */
  async decode(token: string) {
    try {
      /** Data stored in the jwt token */
      const payload = jwt.decode(token) as Payload;
      const { data } = payload;
      return { ok: true, data } as const;
    } catch (error) {
      console.error(error);
      return { ok: false, message: "an error occured" } as const;
    }
  },
};

export default token;
