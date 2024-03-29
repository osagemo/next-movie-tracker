import { Movie, MovieList, PrismaClient } from "@prisma/client";

declare global {
  // allow global `var` declarations

  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

// Type helpers
export type MovieListType = MovieList["listType"];
export type MovieListWithMovies = MovieList & { movies: Movie[] };
export type PartialMovieListWithMovies = Partial<MovieList> & {
  movies: Partial<Movie>[];
};
