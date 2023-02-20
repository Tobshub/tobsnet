import jwt from "jsonwebtoken";
import { env } from "../..";
import { NotOk, Ok } from "../../helpers";
import { LOG } from "../../functions";

type Payload = {
  iat: number;
  data: string;
};

const token = {
  /** Generate new jwt token */
  async generate(payloadInput: string, options?: { expires: "short" | "long" }) {
    try {
      if (!env.jwtSecret) {
        LOG.error("jwt secret is missing");
        return NotOk("jwt secret is missing", undefined);
      }
      const payload: Payload = { data: payloadInput, iat: Math.round(Date.now() / 1000) + 60 };
      /* short logins expire after 1 day */
      const expiresIn = options?.expires === "long" ? 60 * 60 * 24 * 30 : 60 * 60 * 24;

      /** generated token from @param payloadInput and `jwt secret` */
      const token = jwt.sign(payload, env.jwtSecret, { expiresIn });
      return Ok(token);
    } catch (error) {
      LOG.error(error, "error generating token");
      return NotOk("could not generate token", error instanceof Error ? error.message : undefined);
    }
  },

  /** Validate jwt token */
  async validate(token: string) {
    try {
      if (!env.jwtSecret) {
        LOG.error("jwt secret is missing");
        return NotOk("jwt secret is missing", undefined);
      }
      // verify the token and return the payload
      const isValidToken = jwt.verify(token, env.jwtSecret) as Payload;

      return Ok(isValidToken.data);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return NotOk("token expired", error.message);
      }
      LOG.error(error, "could not validate token");
      return NotOk("could not validate token", error instanceof Error ? error.message : undefined);
    }
  },

  /** Decode jwt token */
  async decode(token: string) {
    try {
      const payload = jwt.decode(token) as Payload;
      const { data } = payload;
      return Ok(data);
    } catch (error) {
      LOG.error(error, "error decoding token");
      return NotOk("an error occured", error instanceof Error ? error.message : undefined);
    }
  },
};

export default token;
