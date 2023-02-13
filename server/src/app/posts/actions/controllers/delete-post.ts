import { usePrisma } from "../../../../config";
import token from "../../../auth/token";

type postProps = {
  slug: string;
  id: string;
};

export async function deletePost(userToken: string, postData: postProps) {
  try {
    // validate token
    const isValidToken = await token.validate(userToken);

    if (!isValidToken.ok) {
      return {
        ok: false,
        message: "an error occured",
        cause: isValidToken.message,
      } as const;
    }

    // find the post in the user's posts
    const isUserPost = await usePrisma.user.findUnique({
      where: { id: isValidToken.data },
      select: {
        posts: { where: { ...postData }, select: { id: true, slug: true } },
      },
    });

    if (!isUserPost) {
      return {
        ok: false,
        message: "post does not belong to this user",
      } as const;
    }

    const finish = await deletePostAndComments({ ...postData });

    if (!finish.ok) {
      throw new Error(finish.message);
    }
    return { ok: true, data: postData } as const;
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

async function deletePostAndComments({ id, slug }: postProps) {
  try {
    const deleteRelatedComments = usePrisma.comment.deleteMany({
      where: { postId: id },
    });
    const deletePost = usePrisma.post.delete({ where: { id, slug } });

    const finalize = await usePrisma.$transaction([
      deleteRelatedComments,
      deletePost,
    ]);
    return { ok: true } as const;
  } catch (error) {
    return { ok: false, message: "an error occured" } as const;
  }
}
