// Main App Router
import * as trpc from "@trpc/server";
import { z } from "zod";
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
  .middleware(async ({ ctx, next }) => {
    if (!ctx.user?.id)
      throw new trpc.TRPCError({
        code: "UNAUTHORIZED",
      });
    return next();
  })
  .query("searchMoviesByTitle", {
    input: z.object({
      queryString: z.string().min(3),
      page: z.number().nullish(),
    }),
    async resolve({ input, ctx }) {
      const foundMovies = await omdbApi.findMovies(input.queryString, input.page ?? 1)
      return { result: foundMovies };
    },
  })
  .query("getDefaultMovieLists", {
    async resolve({ input, ctx }) {
      const userId = ctx.user?.id ?? ""; // userId will be defined, as verified by middleware
      const movieLists = await movieListRepository.getSystemMovieListsForUser(
        userId
      );
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
    },
  });

export type AppRouter = typeof appRouter;
