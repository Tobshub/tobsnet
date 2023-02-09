import { PrismaClient } from "@prisma/client";

/** Instance of the prisma client */
export const usePrisma = new PrismaClient();

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
