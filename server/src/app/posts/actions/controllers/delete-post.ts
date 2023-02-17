import { usePrisma } from "../../../../config";
import { LOG } from "../../../../functions";
import { NotOk, Ok } from "../../../../helpers";
import token from "../../../auth/token";

export async function deletePost(userToken: string, postId: string) {
  try {
    // validate token
    const isValidToken = await token.validate(userToken);

    if (!isValidToken.ok) {
      return NotOk("an error occured", isValidToken.message);
    }

    // find the post in the user's posts
    const user = await usePrisma.user.findUnique({
      where: { id: isValidToken.data },
      select: { posts: { where: { id: postId } } },
    });

    if (!user || !user.posts.length) {
      return NotOk("post does not belong to this user");
    }
    // delete the post
    await usePrisma.user.update({
      where: { id: isValidToken.data },
      data: { posts: { delete: { id: postId } } },
      select: {},
    });

    return Ok(postId);
  } catch (error) {
    LOG.error(error);
    return NotOk("an error occured", error instanceof Error ? error.message : undefined);
  }
}
