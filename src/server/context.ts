import * as trpc from "@trpc/server";
import { inferAsyncReturnType } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getSession } from "next-auth/react";

export async function createContext({ req, res }: CreateNextContextOptions) {
  async function getUserFromSession() {
    const session = await getSession({ req });
    if (session) {
      return session.user;
    }
    return null;
  }
  const user = await getUserFromSession();
  return {
    user,
  };
}
type Context = inferAsyncReturnType<typeof createContext>;
// Helper function to create a router with your app's context
export function createRouter() {
  return trpc.router<Context>();
}
