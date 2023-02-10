import { usePrisma } from "../../../config/prisma";
import jwt from "jsonwebtoken";
import b from "bcrypt";
import token from "../../auth/token";

type props = {
  email: string;
  password: string;
};

type options = {
  expires: "short" | "long";
};

/** Validate a user and get a token  */
export async function login(userData: props, options: options) {
  try {
    const user = await usePrisma.user.findUnique({
      where: { email: userData.email },
      select: { id: true, password: true },
    });

    if (!user) {
      return { ok: false, message: "user not found" } as const;
    }

    const isValidLogin = await comparePassword(
      userData.password,
      user.password
    );

    if (!isValidLogin) {
      return { ok: false, message: "wrong password" } as const;
    }

    // generate user token
    const userToken = await token.generate(user.id);

    switch (userToken.ok) {
      case false: {
        return {
          ok: userToken.ok,
          message: "could not generate token",
          cause: userToken.message,
        } as const;
      }
      case true: {
        return { ok: userToken.ok, token: userToken.token } as const;
      }
    }
  } catch (error) {
    console.error(error);
    return { ok: false, message: "an error occured" } as const;
  }
}

/** Compare plain password and bcrypt hashed password */
async function comparePassword(plain: string, hashed: string) {
  const valid = await b.compare(plain, hashed);
  return valid;
}
