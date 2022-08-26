// Main App Router
import * as trpc from "@trpc/server";
import { z } from "zod";
import superjson from "superjson";
import { createRouter } from "../context";
import movieListRepository from "../repositories/movieListRepository";
import omdbApi from "../utils/omdbApi";

const AddMovie = z.object({
  imdbId: z.string(),
  title: z.string(),
  releaseDate: z.string(),
  imageUrl: z.string(),
});

export type AddMovie = z.infer<typeof AddMovie>;
// prettier-ignore
export const appRouter = createRouter()
  .transformer(superjson)
  .middleware(async ({ ctx, next }) => {
    if (!ctx.user?.id)
      throw new trpc.TRPCError({
        code: "UNAUTHORIZED",
      });
    return next();
  })
  .query("searchMoviesByTitle", {
    input: z.object({
      userQuery: z.string().min(3),
      page: z.number().nullish(),
    }),
    async resolve({ input, ctx }) {
      const foundMovies = await omdbApi.findMovies(input.userQuery.trimEnd(), input.page ?? 1).catch(e => console.error(e))
      if (!foundMovies)
       throw "Unable to find movies";

      return { result: foundMovies };
    },
  })
  .query("getDefaultMovieLists", {
    async resolve({ ctx }) {
      const userId = ctx.user?.id ?? ""; // userId will be defined, as verified by middleware
      const movieLists = await movieListRepository.getSystemMovieListsForUser(
        userId
      ).catch(e => console.error(e));
      if (!movieLists)
        throw "Unable to get movie lists for user";

      return { movieLists };
    },
  })
  .mutation("addMovieToList", {
    input: z.object({
      imdbId: z.string(),
      movieListId: z.number().positive(),
    }),
    async resolve({ input, ctx }) {
      const omdbResponse = await omdbApi.findMovie(input.imdbId)
      return await movieListRepository.addMovieToList(
        {
          title: omdbResponse.Title,
          imageUrl: omdbResponse.Poster,
          imdbId: omdbResponse.imdbID,
          releaseDateUtc: new Date(omdbResponse.Released),
        },
        input.movieListId
      );
    }})
    .mutation("removeMovieFromList", {
      input: z.object({
        movieListId: z.number(),
        imdbId: z.string()
      }),
      async resolve({input, ctx}) {
        const movieId = await movieListRepository.removeMovieFromList(input.imdbId, input.movieListId);

        return movieId;
      }
    })
    .mutation("moveMovieToList", {
      input: z.object({
        imdbId: z.string(),
        sourceListId: z.number(),
        targetListId: z.number(),
      }),
      async resolve({input, ctx}) {
        const removedMovie = await movieListRepository.removeMovieFromList(input.imdbId, input.sourceListId);
        const addedMovie = await movieListRepository.addExistingMovieToList(removedMovie.movieId, input.targetListId);

        return addedMovie.movieId;
      }
    });

export type AppRouter = typeof appRouter;
