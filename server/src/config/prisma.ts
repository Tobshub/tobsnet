import { PrismaClient, Prisma } from "@prisma/client";

/** Instance of the prisma client */
export const usePrisma = new PrismaClient();

/** Extract types from prisma queries */
export type PrismaType<T extends (...args: any) => Promise<any>> =
  Prisma.PromiseReturnType<T>;

/**
 * Connect to the mongo cluster at the uri in `.env` with prisma
 */
export async function PrismaConnect() {
  try {
    await usePrisma.$connect().then(() => {
      console.log("connected to db");
    });
  } catch (error) {
    console.error(error);
  }
}
