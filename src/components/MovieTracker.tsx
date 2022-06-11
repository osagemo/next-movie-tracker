import { trpc } from "../utils/trpc";
import { signOut } from "next-auth/react";
import { useState } from "react";
import MovieSearch from "./MovieSearch";
import MovieSearchResults from "./MovieSearchResults";
import { MovieListType } from "@/server/utils/prisma";
import MovieList from "./MovieList";

type MovieTrackerProps = {
  userName: string;
};
const MovieTracker = ({ userName }: MovieTrackerProps) => {
  const utils = trpc.useContext();
  const [queryString, setQueryString] = useState("");
  const { data: movieListsResponse } = trpc.useQuery(["getDefaultMovieLists"], {
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const {
    error: searchError,
    isFetched: searchIsFetched,
    data: searchResult,
  } = trpc.useQuery(["searchMoviesByTitle", { queryString: queryString }], {
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    enabled: Boolean(queryString), // disable until we have user input
  });
  const addMovie = trpc.useMutation("addMovieToList", {
    async onSuccess() {
      await utils.invalidateQueries(["getDefaultMovieLists"]);
    },
  });

  if (!movieListsResponse) {
    return <div>Loading...</div>;
  }

  const addMovieToList = async (
    imdbId: string,
    movieListType: MovieListType
  ) => {
    const movieListId = movieListsResponse?.movieLists.find(
      (l) => l.listType === movieListType
    )?.id;
    if (!movieListId)
      throw `No movie list found for specified list type: ${movieListType}`;

    await addMovie.mutate({
      imdbId,
      movieListId,
    });
  };

  return (
    <>
      <button onClick={() => signOut()}>Sign Out</button>
      <div className="text-center text-3xl">
        <div>{userName}&apos;s Movie tracker</div>
      </div>
      <div className="w-1/2 flex flex-col">
        <MovieSearch onSearchChange={setQueryString} />
        <MovieSearchResults
          hasSearched={searchError != null || searchIsFetched}
          addMovieToHaveSeen={(imdbId) => addMovieToList(imdbId, "SEEN")}
          addMovieToWannaSee={(imdbId) => addMovieToList(imdbId, "WANNA")}
          omdbMovies={searchResult?.result}
        />
      </div>
      <div className="p-5 mt-10 flex justify-between items-start w-1/2 ">
        <MovieList movieList={movieListsResponse.movieLists[0]} />
        <MovieList movieList={movieListsResponse.movieLists[1]} />
      </div>
    </>
  );
};

export default MovieTracker;
