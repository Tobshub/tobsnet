import { usePrisma } from "../../../../config";
import { LOG } from "../../../../functions";
import { NotOk, Ok } from "../../../../helpers";
import token from "../../../auth/token";

type commentProps = {
  content: string;
};

/** Add comment to post */
export async function addComment(userToken: string, postId: string, commentData: commentProps) {
  try {
    // validate token
    const isValidToken = await token.validate(userToken);

    if (!isValidToken.ok) {
      return NotOk("token validation failed", isValidToken.message);
    }

    const createComment = await usePrisma.post.update({
      where: { id: postId },
      data: {
        commentCount: { increment: 1 },
        comments: { create: { content: commentData.content, userId: isValidToken.data } },
      },
      select: { commentCount: true, slug: true, id: true },
    });

    if (!createComment) {
      return NotOk("post not found");
    }

    return Ok(createComment);
  } catch (error) {
    LOG.error(error);
    return NotOk("an error occured", error instanceof Error ? error.message : undefined);
  }
}
