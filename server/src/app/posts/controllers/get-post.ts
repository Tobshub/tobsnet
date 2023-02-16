import { usePrisma } from "../../../config";
import { LOG } from "../../../functions";
import { NotOk, Ok } from "../../../helpers";

export async function getPost(slug: string) {
  try {
    const post = await usePrisma.post.findUnique({
      where: { slug },
      select: {
        createdAt: true,
        content: true,
        commentCount: true,
        likes: true,
        comments: true,
        user: { select: { username: true, id: true, profileImage: true } },
      },
    });
    if (!post) {
      return NotOk("post not found");
    }
    return Ok(post);
  } catch (error) {
    LOG.error(error);
    return NotOk("an error occured");
  }
}
