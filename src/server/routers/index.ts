// Main App Router
import * as trpc from "@trpc/server";
import { z } from "zod";

// prettier-ignore
export const appRouter = trpc.router()
  .query("hello", {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `Hello ${input?.text ?? "world"}!`,
      };
    },
});

export type AppRouter = typeof appRouter;
