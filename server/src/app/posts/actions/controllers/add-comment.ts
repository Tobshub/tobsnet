import { usePrisma } from "../../../../config";
import token from "../../../auth/token";

type commentProps = {
  content: string;
};

/** Add comment to post */
export async function addComment(
  userToken: string,
  postId: string,
  commentData: commentProps
) {
  try {
    // validate token
    const isValidToken = await token.validate(userToken);

    if (!isValidToken.ok) {
      return {
        ok: false,
        message: "token validation failed",
        cause: isValidToken.message,
      } as const;
    }

    const createComment = await usePrisma.post.update({
      where: { id: postId },
      data: {
        commentCount: { increment: 1 },
        comments: {
          create: { content: commentData.content, userId: isValidToken.data },
        },
      },
      select: { commentCount: true, slug: true, id: true },
    });

    if (!createComment) {
      return { ok: false, message: "post not found" } as const;
    }

    return { ok: true, data: createComment } as const;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return {
        ok: false,
        message: "an error occured",
        cause: error.message,
      } as const;
    }
    return { ok: false, message: "an error occured" } as const;
  }
}
