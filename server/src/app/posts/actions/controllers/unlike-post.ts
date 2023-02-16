import { usePrisma } from "../../../../config";
import { LOG } from "../../../../functions";
import { NotOk, Ok } from "../../../../helpers";
import token from "../../../auth/token";

/** Unlike post */
export async function unlikePost(userToken: string, id: string) {
  try {
    // validate token
    const isValidToken = await token.validate(userToken);

    if (!isValidToken.ok) {
      return NotOk("token validation failed", isValidToken.message);
    }

    const postData = await usePrisma.post.findUnique({
      where: { id },
      select: {
        likesUsersIds: true,
        likesUsers: { where: { id: isValidToken.data }, select: { likedPostsIds: true } },
      },
    });

    // filter out this user
    const likesUsersIds = postData?.likesUsersIds.filter((userId) => userId !== isValidToken.data);
    // filter out this post
    const likedPostsIds = postData?.likesUsers[0]?.likedPostsIds.filter((postId) => postId !== id);

    // update record
    const post = await usePrisma.post.update({
      where: { id },
      data: {
        likes: { decrement: 1 },
        likesUsersIds,
        // update the user record
        likesUsers: { update: { where: { id: isValidToken.data }, data: { likedPostsIds } } },
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
