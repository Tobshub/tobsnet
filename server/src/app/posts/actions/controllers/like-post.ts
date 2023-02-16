import { usePrisma } from "../../../../config";
import { LOG } from "../../../../functions";
import { NotOk, Ok } from "../../../../helpers";
import token from "../../../auth/token";

/** Like a post */
export async function likePost(userToken: string, id: string) {
  try {
    // validate token
    const isValidToken = await token.validate(userToken);

    if (!isValidToken.ok) {
      return NotOk("token validation failed", isValidToken.message);
    }
    // FIXIT: check that the user has not liked this post before
    // update record
    const post = await usePrisma.post.update({
      where: { id },
      data: {
        likes: { increment: 1 },
        likesUsersIds: { push: isValidToken.data },
        // update the user record
        likesUsers: { update: { where: { id: isValidToken.data }, data: { likedPostsIds: { push: id } } } },
      },
      select: { likes: true, slug: true, id: true },
    });

    if (!post) {
      return NotOk("post not found");
    }

    return Ok(post);
  } catch (error) {
    LOG.error(error);
    return NotOk("an error occured", error instanceof Error ? error.message : undefined);
  }
}
