import { usePrisma } from "../../../config";
import { LOG } from "../../../functions";
import { NotOk, Ok } from "../../../helpers";
import token from "../../auth/token";

/** Like a comment or reply */
export async function likeComment(userToken: string, commentData: { id: string }) {
  try {
    const isValidToken = await token.validate(userToken);

    if (!isValidToken.ok) {
      return NotOk("failed to validate token", isValidToken.cause);
    }

    const comment = await usePrisma.comment.update({
      where: { id: commentData.id },
      data: {
        likes: { increment: 1 },
        likesUsersIds: { push: isValidToken.data },
        likesUsers: {
          update: { where: { id: isValidToken.data }, data: { likedCommentsId: { push: commentData.id } } },
        },
      },
      select: { likes: true, id: true },
    });

    if (!comment) {
      return NotOk("comment not found");
    }

    return Ok(comment);
  } catch (error) {
    LOG.error(error);
    return NotOk("an error occured", error instanceof Error ? error.message : undefined);
  }
}
