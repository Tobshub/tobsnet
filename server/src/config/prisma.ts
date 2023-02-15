import { PrismaClient, Prisma } from "@prisma/client";
import { LOG } from "../functions";

/** Instance of the prisma client */
export const usePrisma = new PrismaClient();

/** Extract types from prisma queries */
export type PrismaType<T extends (...args: any) => Promise<any>> = Prisma.PromiseReturnType<T>;

/** Connect to the mongo cluster at the uri in `.env` with prisma */
export async function PrismaConnect() {
  try {
    await usePrisma.$connect().then(() => {
      LOG.info("Prisma: connected to db");
    });
  } catch (error) {
    LOG.error(error, "could not connect to prisma");
  }
}
