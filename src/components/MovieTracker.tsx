import { trpc } from "../utils/trpc";
import { signOut } from "next-auth/react";
import { useState } from "react";
import MovieSearch from "./MovieSearch";
import MovieSearchResults from "./MovieSearchResults";
import { MovieListType } from "@/server/utils/prisma";
import MovieList from "./MovieList";
import { OmdbSearchMovie } from "@/utils/omdb";
import useMovieLists from "@/Hooks/UseMovieLists";
import useOmdbMovieSearch from "@/Hooks/useOmdbMovieSearch";

type MovieTrackerProps = {
  userName: string;
};
const MovieTracker = ({ userName }: MovieTrackerProps) => {
  const {
    userQuery,
    setUserQuery,
    searchResult,
    searchError,
    searchIsFetched,
  } = useOmdbMovieSearch();
  const { addMovieToList, movieListsResponse, pendingOmdbMovies } =
    useMovieLists(searchResult);

  if (!movieListsResponse) return <div>Loading...</div>;

  return (
    <>
      <div className="w-full flex ml-5 mt-2 underline">
        <button onClick={() => signOut()}>Sign Out</button>
      </div>
      <div className="text-center text-3xl flex-1">
        <div>{userName}&apos;s Movie tracker</div>
      </div>
      <div className={`lg:w-2/3 w-full flex flex-col flex-1`}>
        <MovieSearch onSearchChange={setUserQuery} />
        <MovieSearchResults
          hasSearched={!!userQuery}
          hasFetched={searchError != null || searchIsFetched}
          addMovieToHaveSeen={(imdbId) => addMovieToList(imdbId, "SEEN")}
          addMovieToWannaSee={(imdbId) => addMovieToList(imdbId, "WANNA")}
          omdbMovies={searchResult}
        />
      </div>
      <div className="p-5 mt-10 flex justify-between items-start lg:w-2/3 w-full flex-2 min-h-0">
        <MovieList
          movieList={movieListsResponse.movieLists.find(
            (m) => m.listType == "SEEN"
          )}
          pendingMovies={pendingOmdbMovies["SEEN"]}
        />
        <MovieList
          movieList={movieListsResponse.movieLists.find(
            (m) => m.listType == "WANNA"
          )}
          pendingMovies={pendingOmdbMovies["WANNA"]}
        />
      </div>
    </>
  );
};

export default MovieTracker;
