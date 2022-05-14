import type { NextPage } from "next";
import { trpc } from "../utils/trpc";
import { useSession, signIn, signOut } from "next-auth/react";

type MovieListProps = {
  userName: string;
};
const MovieList = ({ userName }: MovieListProps) => {
  const { data: movieListCount, isLoading } = trpc.useQuery(
    ["getUserMovieListCount"],
    {
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  if (movieListCount == undefined) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <button onClick={() => signOut()}>Sign Out</button>
      <div className="text-center text-3xl">
        <div>{userName}&apos;s Movie tracker</div>
        <div>You have {movieListCount.count} lists</div>
      </div>
      <div className="p-5 flex justify-between items-center w-1/2">
        <div>
          <h3>Watched</h3>
          <div className="bg-gray-100 h-96 w-80"></div>
        </div>
        <div>
          <h3>Wanna</h3>
          <div className="bg-gray-100 h-96 w-80"></div>
        </div>
      </div>
    </>
  );
};

export default MovieList;
