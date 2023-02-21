import { PrismaType, usePrisma } from "../../../config";
import { LOG } from "../../../functions";
import { NotOk, Ok } from "../../../helpers";
import token from "../../auth/token";

type props = { size: number; token?: string; cursor?: string | null };

/** Generate and load the a feed */
export async function loadFeed(props: props) {
  try {
    // decode token because we don't care if it's expired
    if (props.token) {
      const decoded = await token.decode(props.token);
      if (!decoded.ok) {
        return NotOk("failed to decode token", decoded.message);
      }

      const id = decoded.data;

      const genFeed = await generateFeed(id, props.cursor);

      if (genFeed.ok) {
        return Ok(genFeed.data);
      } else {
        return NotOk("failed to generate feed", genFeed.message);
      }
    }
    return NotOk("user token is missing");
  } catch (error) {
    LOG.error(error);
    return NotOk("an error occured", error instanceof Error ? error.message : undefined);
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
      orderBy: { likes: "desc" },
      skip: cursor ? 1 : 0,
      cursor: cursor ? { slug: cursor } : undefined,
      select: {
        commentCount: true,
        likes: true,
        slug: true,
        id: true,
        user: { select: { username: true } },
        createdAt: true,
        content: true,
      },
    });

    return Ok({ feed: buzzfeed, cursor: buzzfeed[buzzfeed.length - 1]?.slug });
  } catch (error) {
    LOG.error(error);
    return NotOk("an error occured", error instanceof Error ? error.message : undefined);
  }
}
