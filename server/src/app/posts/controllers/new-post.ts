import { usePrisma } from "../../../config";
import token from "../../auth/token";

/** Create a new post */
export async function newPost(userToken: string | undefined, content: string) {
  try {
    if (!userToken) {
      return { ok: false, message: "user token is missing" } as const;
    }
    // validate the user token
    const validateToken = await token.validate(userToken);
    if (!validateToken.ok) {
      throw new Error(validateToken.message);
    }

    const slug = await genSlug(validateToken.data);

    const createPost = await usePrisma.post.create({
      data: {
        userId: validateToken.data,
        content,
        slug,
      },
      select: {
        slug: true,
      },
    });
    return { ok: true, data: createPost } as const;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return {
        ok: false,
        message: "an error occurred",
        cause: error.message,
      } as const;
    }
    return { ok: false, message: "an error occurred" } as const;
  }
}

/** Generate a unique post slug  */
async function genSlug(userId: string) {
  const slugStart = userId.substring(3, 8);
  const slugEnd = (Date.now() + 10 * Math.random()).toString(34).slice(1, 8);

  const slug = slugStart.concat(slugEnd);
  return slug;
}
