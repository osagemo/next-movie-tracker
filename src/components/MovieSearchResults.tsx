import { OmdbSearchMovie } from "@/utils/omdb";
import Spinner from "./Spinner";
import ScrollContainer from "react-indiana-drag-scroll";

type MovieSearchResultsProps = {
  omdbMovies?: OmdbSearchMovie[];
  hasSearched: boolean;
  hasFetched: boolean;
  addMovieToWannaSee: (imdbId: string) => void;
  addMovieToHaveSeen: (imdbId: string) => void;
};
const MovieSearchResults = ({
  omdbMovies,
  hasSearched,
  hasFetched,
  addMovieToHaveSeen,
  addMovieToWannaSee,
}: MovieSearchResultsProps) => {
  if (!hasSearched) return <></>;
  //if (!omdbMovies) return <div>No results found</div>;

  return (
    <ScrollContainer
      hideScrollbars={false}
      className="flex flex-row h-96 w-full overflow-x-auto p-3 scrollbar scroll-smooth"
    >
      {!hasFetched && (
        <Spinner additionalClasses={"w-16 h-16 mx-auto my-auto"} />
      )}

      {hasFetched &&
        (omdbMovies?.map((movie) => (
          <div
            key={movie.imdbID}
            className="flex-none text-center mr-10 h-full relative hover-target"
          >
            {movie.Poster == "N/A" ? (
              <div
                className="rounded border-solid border-2 border-indigo-600 text-2xl h-full p-8"
                style={{ width: "260px" }}
              >
                {`${movie.Title} (${movie.Year})`}
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="h-full" src={movie.Poster} alt="poster"></img>
            )}
            <div className="hover-buttons absolute top-0 w-full flex justify-between p-2">
              <button
                className="bg-emerald-700 p-2 rounded"
                onClick={() => addMovieToHaveSeen(movie.imdbID)}
              >
                Have seen
              </button>
              <button
                className="bg-amber-700 p-2 rounded"
                onClick={() => addMovieToWannaSee(movie.imdbID)}
              >
                Wanna see
              </button>
            </div>
          </div>
        )) ?? <div className="mx-auto my-auto">No results found</div>)}
    </ScrollContainer>
  );
};

export default MovieSearchResults;
