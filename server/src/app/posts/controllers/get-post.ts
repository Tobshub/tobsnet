import { usePrisma } from "../../../config";

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
        user: {
          select: {
            username: true,
            id: true,
          },
        },
      },
    });
    if (!post) {
      return { ok: false, message: "post not found" } as const;
    }
    return { ok: true, data: post } as const;
  } catch (error) {
    console.error(error);
    return { ok: false, message: "an error occured" } as const;
  }
}
