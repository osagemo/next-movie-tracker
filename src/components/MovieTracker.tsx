import { trpc } from "../utils/trpc";
import { signOut } from "next-auth/react";
import { useState } from "react";
import MovieSearch from "./MovieSearch";
import { MovieListType } from "@/server/routers";
import MovieSearchResults from "./MovieSearchResults";

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
    const movieListId = movieListsResponse?.movieLists[0].id ?? 0;
    await addMovie.mutate({
      imdbId: "tt1392190",
      movieListId,
    });
  };

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
          addMovieToHaveSeen={(imdbId) => addMovieToList(imdbId, "SEEN")}
          addMovieToWannaSee={(imdbId) => addMovieToList(imdbId, "WANNA")}
          omdbMovies={searchResult?.result}
        />
      </div>
      <div className="p-5 flex justify-between items-center w-1/2 ">
        <div>
          <h3>{movieListsResponse.movieLists[0].name}</h3>
          <div className="bg-gray-100 h-96 w-80"></div>
        </div>
        <div>
          <h3>{movieListsResponse.movieLists[1].name}</h3>
          <div className="bg-gray-100 h-96 w-80"></div>
        </div>
      </div>
      <button onClick={() => addDummyMovie()}>Add dummy</button>
    </>
  );
};

export default MovieTracker;
