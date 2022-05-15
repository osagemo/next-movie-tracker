import { trpc } from "../utils/trpc";
import { signOut } from "next-auth/react";
import { getAddMovieFromFullOmdbMovie } from "@/utils/omdb";
import { useCallback, useEffect, useState } from "react";
import MovieSearch from "./MovieSearch";
import { debounce } from "@/utils/misc";
import { AddMovie } from "@/server/routers";
import MovieSearchResults from "./MovieSearchResults";

type MovieListProps = {
  userName: string;
};
const MovieList = ({ userName }: MovieListProps) => {
  const utils = trpc.useContext();
  const [queryString, setQueryString] = useState("");
  const { data: movieLists } = trpc.useQuery(["getDefaultMovieLists"], {
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const { data: searchResult } = trpc.useQuery(
    ["searchMoviesByTitle", { queryString: queryString }],
    {
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      enabled: Boolean(queryString), // disable until we have a value
    }
  );
  const addMovie = trpc.useMutation("addMovieToList", {
    async onSuccess() {
      await utils.invalidateQueries(["getDefaultMovieLists"]);
    },
  });
  const addDummyMovie = async () => {
    const movieListId = movieLists?.movieLists[0].id ?? 0;
    await addMovie.mutate({
      imdbId: "tt1392190",
      movieListId,
    });
  };

  if (!movieLists) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <button onClick={() => signOut()}>Sign Out</button>
      <div className="text-center text-3xl">
        <div>{userName}&apos;s Movie tracker</div>
      </div>
      <div className="w-1/2 flex flex-col">
        <MovieSearch onSearchChange={setQueryString} />
        <MovieSearchResults omdbMovies={searchResult?.result} />
      </div>
      <div className="p-5 flex justify-between items-center w-1/2 ">
        <div>
          <h3>{movieLists.movieLists[0].name}</h3>
          <div className="bg-gray-100 h-96 w-80"></div>
        </div>
        <div>
          <h3>{movieLists.movieLists[1].name}</h3>
          <div className="bg-gray-100 h-96 w-80"></div>
        </div>
      </div>
      <button onClick={() => addDummyMovie()}>Add dummy</button>
    </>
  );
};

export default MovieList;
