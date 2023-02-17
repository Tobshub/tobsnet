import { usePrisma } from "../../../config";
import { LOG } from "../../../functions";
import { NotOk, Ok } from "../../../helpers";
import token from "../../auth/token";

export async function unlikeComment(userToken: string, commentData: { id: string }) {
  try {
    const isValidToken = await token.validate(userToken);

    if (!isValidToken.ok) {
      return NotOk("token validation failed", isValidToken.message);
    }

    // get the previous data
    const likedCommentsIds = await usePrisma.user
      .findUnique({ where: { id: isValidToken.data }, select: { likedCommentsIds: true } })
      .then((val) => val?.likedCommentsIds.filter((commentId) => commentId !== commentData.id));
    const likesUsersIds = await usePrisma.comment
      .findUnique({ where: { id: commentData.id }, select: { likesUsersIds: true } })
      .then((val) => val?.likesUsersIds.filter((userId) => userId !== isValidToken.data));

    const comment = await usePrisma.comment.update({
      where: { id: commentData.id },
      data: {
        likes: { decrement: 1 },
        likesUsersIds,
        likesUsers: { update: { where: { id: isValidToken.data }, data: { likedCommentsIds } } },
      },
      select: { likes: true },
    });

    if (!comment) {
      return NotOk("comment not found");
    }

    return Ok(comment);
  } catch (error) {
    LOG.error(error, "failed to unlike comment");
    return NotOk("an error occured", error instanceof Error ? error.message : undefined);
  }
}
