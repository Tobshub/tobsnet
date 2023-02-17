import { usePrisma } from "../../../config";
import { LOG } from "../../../functions";
import { NotOk, Ok } from "../../../helpers";
import token from "../../auth/token";

export async function deleteComment(userToken: string, commentData: { id: string; postId: string; parentId?: string }) {
  try {
    const isValidToken = await token.validate(userToken);

    if (!isValidToken.ok) {
      return NotOk("token validation failed", isValidToken.message);
    }

    const isUserComment = await usePrisma.user.findUnique({
      where: { id: isValidToken.data },
      select: { comments: true },
    });

    // update user
    const comment = await usePrisma.user.update({
      where: { id: isValidToken.data },
      data: { comments: { delete: { id: commentData.id } } },
      select: { comments: { where: { id: commentData.id } } },
    });
    // update post/parent comment
    if (commentData.parentId) {
      await usePrisma.comment.update({
        where: { id: commentData.parentId },
        data: { replyCount: { decrement: 1 }, replies: { delete: { id: commentData.id } } },
      });
    } else {
      await usePrisma.post.update({
        where: { id: commentData.postId },
        data: { commentCount: { decrement: 1 }, comments: { delete: { id: commentData.id } } },
      });
    }

    if (!comment) {
      return NotOk("comment not found");
    }

    return Ok(comment);
  } catch (error) {
    LOG.error(error);
    return NotOk("an error occured", error instanceof Error ? error.message : undefined);
  }
}
