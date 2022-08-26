/* eslint-disable @next/next/no-img-element */
import useMovieLists from "@/Hooks/useMovieLists";
import { MovieListWithMovies } from "@/server/utils/prisma";
import { OmdbSearchMovie } from "@/utils/omdb";
import ScrollContainer from "react-indiana-drag-scroll";
import Spinner from "./Spinner";

type MovieListProps = {
  movieList?: MovieListWithMovies;
  pendingMovies: OmdbSearchMovie[];
  removeMovieFromList: (imdbId: string, movieListId: number) => Promise<void>;
  moveMovieToSeenList?: (imdbId: string) => Promise<void>;
};
const MovieList = ({
  movieList,
  pendingMovies,
  removeMovieFromList,
  moveMovieToSeenList,
}: MovieListProps) => {
  const removeMovie = async (imdbId: string) => {
    const movieListId = movieList?.id;
    if (!movieListId) return;

    await removeMovieFromList(imdbId, movieListId);
  };
  const getListNameForType = (movieList: MovieListWithMovies) =>
    movieList.listType === "SEEN"
      ? "Have seen"
      : movieList.listType === "WANNA"
      ? "Wanna see"
      : movieList.name;

  const borderColorForType = (movieList: MovieListWithMovies) =>
    movieList.listType === "WANNA"
      ? "border-amber-700"
      : movieList.listType === "SEEN"
      ? "border-emerald-700"
      : "border-cyan-700";

  if (!movieList) return <div>Loading...</div>;
  console.log(moveMovieToSeenList);
  console.log(moveMovieToSeenList != undefined);
  const renderMovie = (
    id: string | number,
    imageUrl: string,
    title: string,
    loading: boolean,
    imdbId: string,
    releaseDateUtc?: Date
  ) => (
    <div
      key={id}
      className={`flex items-center border-l-4 shadow-lg p-2 hover-target relative ${borderColorForType(
        movieList
      )}`}
    >
      {imageUrl == "N/A" ? (
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-black mr-2">
          ?
        </div>
      ) : (
        <div className="w-12 h-12 mr-2">
          <img
            className="rounded-full object-cover object-bottom h-full w-full align-bottom"
            src={imageUrl}
            alt="poster"
          ></img>
        </div>
      )}
      <div className="flex flex-wrap max-w-[80%]">
        <span className="truncate">{title}</span>
        {releaseDateUtc && (
          <span className="text-xs w-full">
            {releaseDateUtc.toLocaleDateString()}
          </span>
        )}
        {loading && (
          <div className="w-full">
            <Spinner additionalClasses={"w-6 h-6 mr-2 "} />
          </div>
        )}
      </div>
      <div className="hover-buttons w-1/4 h-full absolute left-3/4 flex items-center justify-between">
        {moveMovieToSeenList != undefined && (
          <button
            type="button"
            onClick={(e) => moveMovieToSeenList(imdbId)}
            className="text-white bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800"
          >
            <svg
              aria-hidden="true"
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
                transform="scale(-1 1) translate(-20 0)"
              ></path>
            </svg>
            <span className="sr-only">Icon description</span>
          </button>
        )}
        <button
          type="button"
          onClick={(e) => removeMovie(imdbId)}
          className="ml-auto text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
        >
          <span className="w-4 h-4 leading-4 text-m">×</span>
          <span className="sr-only">Icon description</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-[45%] flex-col h-full">
      <h1 className="text-lg font-semibold mb-1 flex-none">
        {getListNameForType(movieList)}
      </h1>
      <ScrollContainer
        hideScrollbars={false}
        className="overflow-y-auto scrollbar flex-auto max-h-[95%]"
      >
        {pendingMovies.map((omdbMovie) =>
          renderMovie(
            omdbMovie.imdbID,
            omdbMovie.Poster,
            omdbMovie.Title,
            true,
            omdbMovie.imdbID
          )
        )}
        {movieList.movies.map((movie) =>
          renderMovie(
            movie.id,
            movie.imageUrl,
            movie.title,
            false,
            movie.imdbId,
            movie.releaseDateUtc
          )
        )}
      </ScrollContainer>
    </div>
  );
};

export default MovieList;
