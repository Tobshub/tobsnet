import { usePrisma } from "../../../config";
import { LOG } from "../../../functions";
import { NotOk, Ok } from "../../../helpers";
import token from "../../auth/token";

type replyProps = { content: string; parentId: string; postId: string };

/** Reply to a comment or reply */
export async function newReply(userToken: string, replyData: replyProps) {
  try {
    const isValidToken = await token.validate(userToken);

    if (!isValidToken.ok) {
      return NotOk("token validation failed", isValidToken.message);
    }

    const comment = await usePrisma.comment.update({
      where: { id: replyData.parentId },
      data: {
        replies: { create: { content: replyData.content, userId: isValidToken.data, postId: replyData.postId } },
      },
      select: { replyCount: true, replies: true },
    });

    if (!comment) {
      return NotOk("parent comment not found");
    }

    return Ok(comment);
  } catch (error) {
    LOG.error(error);
    return NotOk("an error occured", error instanceof Error ? error.message : undefined);
  }
}
