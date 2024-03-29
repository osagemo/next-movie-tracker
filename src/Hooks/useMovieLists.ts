import { MovieListType } from "@/server/utils/prisma";
import { OmdbSearchMovie } from "@/utils/omdb";
import { trpc } from "@/utils/trpc";
import { useState } from "react";

const useMovieLists = (searchResult?: OmdbSearchMovie[]) => {
  const utils = trpc.useContext();

  const [pendingOmdbMovies, setPendingOmdbMovies] = useState<
    Record<MovieListType, OmdbSearchMovie[]>
  >({ SEEN: [], WANNA: [] });

  const { data: movieListsResponse } = trpc.useQuery(["getDefaultMovieLists"], {
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const removePendingMovie = (imdbId: string) => {
    let key: keyof typeof pendingOmdbMovies;
    for (key in pendingOmdbMovies) {
      setPendingOmdbMovies((pendingOmdbMovies) => ({
        ...pendingOmdbMovies,
        [key]: [...pendingOmdbMovies[key].filter((m) => m.imdbID !== imdbId)],
      }));
    }
  };

  const addMovieToList = async (
    imdbId: string,
    movieListType: MovieListType
  ) => {
    const movieListId = movieListsResponse?.movieLists.find(
      (l) => l.listType === movieListType
    )?.id;

    if (!movieListId)
      throw `No movie list found for specified list type: ${movieListType}`;

    const omdbMovie = searchResult?.find((m) => m.imdbID === imdbId);
    if (!omdbMovie) return;

    setPendingOmdbMovies((pendingOmdbMovies) => ({
      ...pendingOmdbMovies,
      [movieListType]: [...pendingOmdbMovies[movieListType], omdbMovie],
    }));

    await addMovie.mutate({
      imdbId,
      movieListId,
    });
  };

  const addMovie = trpc.useMutation("addMovieToList", {
    async onSuccess(data, { imdbId }) {
      await utils.invalidateQueries(["getDefaultMovieLists"]);
      const omdbMovie = searchResult?.find((m) => m.imdbID == imdbId);
      omdbMovie && removePendingMovie(omdbMovie.imdbID);
    },
    async onError(error, { imdbId }) {
      console.error(error);
      const omdbMovie = searchResult?.find((m) => m.imdbID == imdbId);
      omdbMovie && removePendingMovie(omdbMovie.imdbID);
    },
  });

  const removeMovieFromList = async (imdbId: string, movieListId: number) => {
    await removeMovie.mutate({ imdbId, movieListId });
  };

  const removeMovie = trpc.useMutation("removeMovieFromList", {
    async onSuccess(data, { imdbId, movieListId }) {
      await utils.invalidateQueries(["getDefaultMovieLists"]);
      const omdbMovie = searchResult?.find((m) => m.imdbID == imdbId);
      omdbMovie && removePendingMovie(omdbMovie.imdbID);
    },
    async onError(error, { imdbId }) {
      console.error(error);
      const omdbMovie = searchResult?.find((m) => m.imdbID == imdbId);
      omdbMovie && removePendingMovie(omdbMovie.imdbID);
    },
  });

  const moveMovieToList = trpc.useMutation("moveMovieToList", {
    async onSuccess(data, { imdbId }) {
      await utils.invalidateQueries(["getDefaultMovieLists"]);
      const omdbMovie = searchResult?.find((m) => m.imdbID == imdbId);
      omdbMovie && removePendingMovie(omdbMovie.imdbID);
    },
    async onError(error, { imdbId }) {
      console.error(error);
      const omdbMovie = searchResult?.find((m) => m.imdbID == imdbId);
      omdbMovie && removePendingMovie(omdbMovie.imdbID);
    },
  });
  const moveMovieToSeenList = async (imdbId: string) => {
    const movieLists = movieListsResponse?.movieLists;

    const wannaSeeList = movieLists?.find((l) => l.listType === "WANNA");
    const haveSeenList = movieLists?.find((l) => l.listType === "SEEN");

    if (!wannaSeeList || !haveSeenList) return;

    return await moveMovieToList.mutate({
      imdbId,
      sourceListId: wannaSeeList.id,
      targetListId: haveSeenList.id,
    });
  };

  return {
    addMovieToList,
    pendingOmdbMovies,
    movieListsResponse,
    removeMovieFromList,
    moveMovieToSeenList,
  };
};

export default useMovieLists;
