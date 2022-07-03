/* eslint-disable @next/next/no-img-element */
import { MovieListWithMovies } from "@/server/utils/prisma";
import { OmdbSearchMovie } from "@/utils/omdb";
import ScrollContainer from "react-indiana-drag-scroll";
import Spinner from "./Spinner";

type MovieListProps = {
  movieList?: MovieListWithMovies;
  pendingMovies: OmdbSearchMovie[];
};
const MovieList = ({ movieList, pendingMovies }: MovieListProps) => {
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

  const renderMovie = (
    id: string | number,
    imageUrl: string,
    title: string,
    loading: boolean,
    releaseDateUtc?: Date
  ) => (
    <div
      key={id}
      className={`flex items-center border-l-4 shadow-lg p-2 ${borderColorForType(
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
          renderMovie(omdbMovie.imdbID, omdbMovie.Poster, omdbMovie.Title, true)
        )}
        {movieList.movies.map((movie) =>
          renderMovie(
            movie.id,
            movie.imageUrl,
            movie.title,
            false,
            movie.releaseDateUtc
          )
        )}
      </ScrollContainer>
    </div>
  );
};

export default MovieList;
