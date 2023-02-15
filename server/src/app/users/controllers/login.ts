import { usePrisma } from "../../../config/prisma";
import b from "bcrypt";
import token from "../../auth/token";
import { NotOk, Ok } from "../../../helpers"
import { LOG } from "../../../functions";

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
      return NotOk("user not found");
    }

    const isValidLogin = await comparePassword(userData.password, user.password);

    if (!isValidLogin) {
      return NotOk("wrong password");
    }

    // generate user token
    const userToken = await token.generate(user.id);

    if (userToken.ok) {
      return Ok(userToken.data);
    } else {
      return NotOk("could not generate token", userToken.message)
    }
  } catch (error) {
    LOG.error(error, "failed to login user");
    return NotOk("an error occured", error instanceof Error ? error.message : undefined);
  }
}

/** Compare plain password and bcrypt hashed password */
async function comparePassword(plain: string, hashed: string) {
  const valid = await b.compare(plain, hashed);
  return valid;
}
