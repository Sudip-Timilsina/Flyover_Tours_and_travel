export { default as PrismaClient } from "@prisma/client";

import { PrismaClient as Prisma } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: Prisma };

export const db =
  globalForPrisma.prisma ||
  new Prisma({
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
