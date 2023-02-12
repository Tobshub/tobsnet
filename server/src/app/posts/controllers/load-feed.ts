import { PrismaType, usePrisma } from "../../../config";
import token from "../../auth/token";

type props = {
  size: number;
  token?: string;
  cursor?: string | null;
};

/** Generate and load the a feed */
export async function loadFeed(props: props) {
  try {
    // decode token because we don't care if it's expired
    if (props.token) {
      const decoded = await token.decode(props.token);
      if (!decoded.ok) {
        return { ok: false, message: "an error occured" } as const;
      }

      const id = decoded.data;

      const genFeed = await generateFeed(id, props.cursor);

      switch (genFeed.ok) {
        case true: {
          return { ok: genFeed.ok, data: genFeed.data } as const;
        }
        case false: {
          return {
            ok: genFeed.ok,
            message: "failed to generate feed",
            cause: genFeed.message,
          } as const;
        }
        default: {
          throw new Error("something unexpected happened");
        }
      }
    }
    return { ok: false, message: "user token is missing" } as const;
  } catch (error) {
    console.error(error);
    return { ok: false, message: "an error occured" } as const;
  }
}

async function generateFeed(userId: string, cursor?: props["cursor"]) {
  // TODO: generate custom feed based on who the user follows
  // const following = await usePrisma.user.findUnique({
  //   where: { id: userId },
  //   select: { following: true },
  // });
  try {
    const buzzfeed = await usePrisma.post.findMany({
      take: 20,
      orderBy: { likes: "asc" },
      cursor: {
        // cursor based pagination
        slug: cursor ?? undefined,
      },
      select: {
        commentCount: true,
        likes: true,
        slug: true,
        user: { select: { username: true } },
        createdAt: true,
        content: true,
      },
    });

    return {
      ok: true,
      data: {
        feed: buzzfeed,
        cursor: buzzfeed[19]?.slug /* use the last post slug as the cursor */,
      },
    } as const;
  } catch (error) {
    console.error(error);
    return { ok: false, message: "an error occured" } as const;
  }
}
