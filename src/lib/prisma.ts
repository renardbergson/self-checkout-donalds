import { PrismaClient } from "@prisma/client";
// We're importing the PrismaClient class, which is the
// client used to access the database through Prisma

declare global {
  var cachedPrisma: PrismaClient;
}
// This creates a global variable "cachedPrisma" only available
// during development, and "declare global" makes TypeScript
// recognize the variable as global

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
  }
  prisma = global.cachedPrisma;
}
/* 
  1 - In production:
    - It's safe to create a new Prisma instance since
      our code runs only once on the server
  
  2 - In development:
    - Next.js uses hot reload frequently
    - That could create multiple Prisma instances, which
      could result in database connection errors
    - To avoid that, we store an instance in "global.cachedPrisma"
      and reuse it instead of creating a new one on every reload
*/

export const database = prisma;
// We export the final Prisma instance as "database", which can
// be used throughout the entire project
// We will use it to call our database...
// Ex: const users = await database.user.findMany();
