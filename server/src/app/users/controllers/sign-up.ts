import { usePrisma } from "../../../config/prisma";
import token from "../../auth/token";
import b from "bcrypt";

type props = {
  username: string;
  password: string;
  email: string;
};

/** Creates a user */
export async function signUp(userData: props) {
  try {
    // check if there is an existing user
    const userCheck = await usePrisma.user.findUnique({
      where: { email: userData.email },
      select: { email: true },
    });

    if (userCheck) {
      return { ok: false, message: "user already exists" } as const;
    }
    // hash the password
    const hashedPassword = await b.hash(userData.password, 10);
    // create the new user
    const user = await usePrisma.user.create({
      data: {
        ...userData,
        bio: "Nothing here yet...",
        password: hashedPassword,
      },
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
