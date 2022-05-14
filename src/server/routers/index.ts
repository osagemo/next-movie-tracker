// Main App Router
import * as trpc from "@trpc/server";
import { getSession } from "next-auth/react";
import { z } from "zod";
import { createRouter } from "../context";
import { prisma } from "@/server/utils/prisma";

// prettier-ignore
export const appRouter = createRouter()
  .middleware(async ({ctx, next}) => {
    if (!ctx.user?.id)
       throw new trpc.TRPCError({
         code: "UNAUTHORIZED"
       });
       return next();
  })   
  .query("getUserMovieListCount", {
    async resolve({ input, ctx }) {
      const userId = ctx.user?.id
      const count = await prisma.user_MovieList.count({
        where: {userId},
      });
      return {
        count 
      };
    },
});

export type AppRouter = typeof appRouter;
