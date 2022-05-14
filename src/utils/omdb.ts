import type { AddMovie } from "@/server/routers/index";

export const getAddMovieFromOmdbMovie = (omdbMovie: any) => {
  const addMovie: AddMovie = {
    imdbId: omdbMovie.imdbID,
    imageUrl: omdbMovie.Poster,
    releaseDate: omdbMovie.Released,
    title: omdbMovie.Title,
  };
  return addMovie;
};
