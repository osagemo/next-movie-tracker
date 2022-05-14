// Main App Router
import * as trpc from "@trpc/server";
import { z } from "zod";
import { createRouter } from "../context";
import { prisma } from "@/server/utils/prisma";

const AddMovie = z.object({
  imdbId: z.string(),
  title: z.string(),
  releaseDate: z.string(),
  imageUrl: z.string(),
});

export type AddMovie = z.infer<typeof AddMovie>;
// prettier-ignore
export const appRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.user?.id)
      throw new trpc.TRPCError({
        code: "UNAUTHORIZED",
      });
    return next();
  })
  // TODO: move logic to a service
  .query("getDefaultMovieLists", {
    async resolve({input, ctx}) {
      const userId = ctx.user?.id;
      const count = await prisma.user_MovieList.count({
        where: { userId },
      });
      // create system defined lists if user has no lists
      if (count < 1) {
        const [seenList, wannaList] = await prisma.$transaction([
          prisma.movieList.create({
            data: {
              name: "system.seen",
              listType: "SEEN",
              users: {
                create: {
                  addedAt: new Date(),
                  userId: userId ?? "" // userId is defined as per middleware
                }
              }
            }
          }),
          prisma.movieList.create({
            data: {
              name: "system.wanna",
              listType: "WANNA",
              users: {
                create: {
                  addedAt: new Date(),
                  userId: userId ?? "" // userId is defined as per middleware
                }
              }
            }
          }),
        ]);
      }
      const movieLists = await prisma.movieList.findMany({where:{
        users: {
          some: {
            userId: userId
        }},
        name: {startsWith: "system"}
      }});

      return {movieLists};
    }
  })
  .mutation("addMovieToList", {
    input: z.object({
      movie: AddMovie,
      movieListId: z.number().positive()
    }),
    async resolve({ input, ctx }) {
      const movie = input.movie;
      const releaseDateUtc = new Date(movie.releaseDate);
      const movieList = await prisma.movieList.findUnique({where: {id: input.movieListId}});
      if (!movieList)
        throw new Error("No movie list for provided id");

      return await prisma.movie.create({
        data: {
          title: movie.title,
          imageUrl: movie.imageUrl,
          imdbId: movie.imdbId,
          releaseDateUtc,
          movieLists: {
            create: {
              movieListId: movieList.id
            }
          }
        },
      });
    },
  });
export type AppRouter = typeof appRouter;
