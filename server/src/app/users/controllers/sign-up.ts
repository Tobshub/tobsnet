import { usePrisma } from "../../../config/prisma";
import token from "../../auth/token";

type props = {
  username: string;
  password: string;
  email: string;
};

/** Creates a user */
export async function signUp(userData: props) {
  try {
    // create the new user
    const user = await usePrisma.user.create({
      data: { ...userData, bio: "Nothing here yet..." },
    });

    const genToken = await token.generate(user.id);

    switch (genToken.ok) {
      case false: {
        return {
          ok: genToken.ok,
          message: "could not generate token",
          cause: genToken.message,
        } as const;
      }
      case true: {
        return { ok: genToken.ok, token: genToken.token } as const;
      }
    }
  } catch (error) {
    console.error(error);
    return { ok: false, message: "an error occured", cause: "unkown" } as const;
  }
}
