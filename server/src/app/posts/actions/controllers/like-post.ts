import { usePrisma } from "../../../../config";
import token from "../../../auth/token";

type postProps = { slug: string; id: string };

/** Like a post */
export async function likePost(userToken: string, postData: postProps) {
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

    // update record
    const post = await usePrisma.post.update({
      where: {
        slug: postData.slug,
      },
      data: {
        likes: { increment: 1 },
        likesUsersIds: { push: isValidToken.data },
        likesUsers: {
          // update the user record
          update: {
            where: { id: isValidToken.data },
            data: { likedPostsIds: { push: postData.id } },
          },
        },
      },
      select: {
        likes: true,
        slug: true,
        id: true,
      },
    });

    if (!post) {
      return { ok: false, message: "post not found" } as const;
    }

    return { ok: true, data: post } as const;
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
