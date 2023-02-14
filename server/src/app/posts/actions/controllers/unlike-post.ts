import { usePrisma } from "../../../../config";
import token from "../../../auth/token";

/** Unlike post */
export async function unlikePost(userToken: string, id: string) {
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

    const postData = await usePrisma.post.findUnique({
      where: { id },
      select: {
        likesUsersIds: true,
        likesUsers: {
          where: { id: isValidToken.data },
          select: { likedPostsIds: true },
        },
      },
    });

    // filter out this user
    const likesUsersIds = postData?.likesUsersIds.filter(
      (userId) => userId !== isValidToken.data
    );
    // filter out this post
    const likedPostsIds = postData?.likesUsers[0]?.likedPostsIds.filter(
      (postId) => postId !== id
    );

    // update record
    const post = await usePrisma.post.update({
      where: { id },
      data: {
        likes: { decrement: 1 },
        likesUsersIds,
        likesUsers: {
          // update the user record
          update: {
            where: { id: isValidToken.data },
            data: { likedPostsIds },
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
