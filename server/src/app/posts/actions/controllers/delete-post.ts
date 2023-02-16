import { usePrisma } from "../../../../config";
import { LOG } from "../../../../functions";
import { NotOk, Ok } from "../../../../helpers";
import token from "../../../auth/token";

export async function deletePost(userToken: string, id: string) {
  try {
    // validate token
    const isValidToken = await token.validate(userToken);

    if (!isValidToken.ok) {
      return NotOk("an error occured", isValidToken.message);
    }

    // find the post in the user's posts
    const isUserPost = await usePrisma.user.findUnique({
      where: { id: isValidToken.data },
      select: { posts: { where: { id }, select: { id: true } } },
    });

    if (!isUserPost) {
      return NotOk("post does not belong to this user");
    }

    const finish = await deletePostAndComments(id);

    if (!finish.ok) {
      throw new Error(finish.message);
    }
    return Ok({ id });
  } catch (error) {
    LOG.error(error);
    return NotOk("an error occured", error instanceof Error ? error.message : undefined);
  }
}

async function deletePostAndComments(id: string) {
  try {
    const deleteRelatedComments = usePrisma.comment.deleteMany({ where: { postId: id } });
    const deletePost = usePrisma.post.delete({ where: { id } });

    const finalize = await usePrisma.$transaction([deleteRelatedComments, deletePost]);
    return Ok(null);
  } catch (error) {
    return NotOk("an error occured");
  }
}
