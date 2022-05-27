import type { AddMovie } from "@/server/routers/index";

export const getAddMovieFromFullOmdbMovie = (omdbMovie: any) => {
  const addMovie: AddMovie = {
    imdbId: omdbMovie.imdbID,
    imageUrl: omdbMovie.Poster,
    releaseDate: omdbMovie.Released,
    title: omdbMovie.Title,
  };
  return addMovie;
};

export type OmdbSearchMovie = {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
};
