// Main App Router
import * as trpc from "@trpc/server";
import { z } from "zod";
import { createRouter } from "../context";
import { prisma } from "@/server/utils/prisma";
import { OmdbSearchMovie } from "@/utils/omdb";

const AddMovie = z.object({
  imdbId: z.string(),
  title: z.string(),
  releaseDate: z.string(),
  imageUrl: z.string(),
});

const omdbApiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY;

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
      page: z.number().nullish()
    }),
    async resolve({input, ctx}) {
      let url = `http://www.omdbapi.com/?apikey=${omdbApiKey}&s=${input.queryString}&p=${input.page ?? 1}`;
      const response = await fetch(url);
      const responseJson = await response.json();
      const foundMovies = responseJson.Search as OmdbSearchMovie[];

      return {result: foundMovies};
    }
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
      imdbId: z.string(),
      movieListId: z.number().positive()
    }),
    async resolve({ input, ctx }) {
      const url = `http://www.omdbapi.com/?apikey=${omdbApiKey}&i=${input.imdbId}`;
      const response = await fetch(url);
      const responseJson: any = await response.json();
      if (responseJson.hasOwnProperty("Error"))
        throw new Error("Invalid imdb ID");
      
      const movieList = await prisma.movieList.findUnique({where: {id: input.movieListId}});
      if (!movieList)
        throw new Error("No movie list for provided id");

      return await prisma.movie.create({
        data: {
          title: responseJson.Title,
          imageUrl: responseJson.Poster,
          imdbId: responseJson.imdbID,
          releaseDateUtc: new Date(responseJson.Released),
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
