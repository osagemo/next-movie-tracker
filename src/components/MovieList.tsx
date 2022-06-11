/* eslint-disable @next/next/no-img-element */
import { MovieListWithMovies } from "@/server/utils/prisma";

type MovieListProps = {
  movieList: MovieListWithMovies;
};
const MovieList = ({ movieList }: MovieListProps) => {
  const getListNameForType = (movieList: MovieListWithMovies) =>
    movieList.listType === "SEEN"
      ? "Have seen"
      : movieList.listType === "WANNA"
      ? "Wanna see"
      : movieList.name;

  const borderColorForType = (movieList: MovieListWithMovies) =>
    movieList.listType === "SEEN"
      ? "border-amber-700"
      : movieList.listType === "WANNA"
      ? "border-emerald-700"
      : "border-cyan-700";

  return (
    <div className="w-[45%] flex-col">
      <h1 className="text-lg font-semibold mb-1">
        {getListNameForType(movieList)}
      </h1>
      {movieList.movies.map((movie) => (
        <div
          key={movie.id}
          className={`flex items-center border-l-4 shadow-lg p-2 ${borderColorForType(
            movieList
          )}`}
        >
          {movie.imageUrl == "N/A" ? (
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-black mr-2">
              ?
            </div>
          ) : (
            <div className="w-12 h-12 mr-2">
              <img
                className="rounded-full object-cover object-bottom h-full w-full align-bottom"
                src={movie.imageUrl}
                alt="poster"
              ></img>
            </div>
          )}
          <div className="flex flex-wrap max-w-[80%]">
            <span className="truncate">{movie.title}</span>
            <span className="text-xs w-full">
              {movie.releaseDateUtc.toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieList;
