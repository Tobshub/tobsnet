import { usePrisma } from "../../../config/prisma";
import token from "../../auth/token";
import b from "bcrypt";
import { NotOk, Ok } from "../../../helpers";
import { LOG } from "../../../functions";

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
      return NotOk("user already exists")
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

    if (genToken.ok) {
      return Ok(genToken.data);
    } else {
      return NotOk("could not generate token", genToken.message);
    }
  } catch (error) {
    LOG.error(error, "user sign up failed");
    return NotOk("an error occured", error instanceof Error ? error.message : undefined)
  }
}
