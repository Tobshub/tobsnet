import { usePrisma } from "../../../config";
import token from "../../auth/token";
import { Ok, NotOk } from "../../../helpers";
import { LOG } from "../../../functions";

/** Create a new post */
export async function newPost(userToken: string, content: string) {
  try {
    // validate the user token
    const validateToken = await token.validate(userToken);
    if (!validateToken.ok) {
      return NotOk("token validation failed", validateToken.message);
    }

    const slug = await genSlug(validateToken.data);

    const createPost = await usePrisma.post.create({
      data: { userId: validateToken.data, content, slug },
      select: { slug: true, id: true },
    });
    return Ok(createPost);
  } catch (error) {
    LOG.error(error);
    return NotOk("an error occurred", error instanceof Error ? error.message : undefined);
  }
}

/** Generate a unique post slug  */
async function genSlug(userId: string) {
  const slugStart = userId.substring(3, 8);
  const slugEnd = (Date.now() + 10 * Math.random()).toString(34).slice(1, 8);

  const slug = slugStart.concat(slugEnd);
  return slug;
}
