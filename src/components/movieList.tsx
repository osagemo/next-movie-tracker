import { trpc } from "../utils/trpc";
import { signOut } from "next-auth/react";
import { getAddMovieFromOmdbMovie } from "@/utils/omdb";

type MovieListProps = {
  userName: string;
};
const MovieList = ({ userName }: MovieListProps) => {
  const { data: movieLists } = trpc.useQuery(["getDefaultMovieLists"], {
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const addMovie = trpc.useMutation("addMovieToList");
  const addDummyMovie = async () => {
    const url = "http://www.omdbapi.com/?apikey=35dd7a54&i=tt1392190";
    const response = await fetch(url);
    const movie = await response.json();
    const movieListId = movieLists?.movieLists[0].id ?? 0;
    await addMovie.mutate({
      movie: getAddMovieFromOmdbMovie(movie),
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
        <div>You have {movieLists.movieLists.length} lists</div>
      </div>
      <div className="p-5 flex justify-between items-center w-1/2">
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
