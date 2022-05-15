import { OmdbSearchMovie } from "@/utils/omdb";

type MovieSearchResultsProps = {
  omdbMovies?: OmdbSearchMovie[];
};
const MovieSearchResults = ({ omdbMovies }: MovieSearchResultsProps) => {
  if (!omdbMovies) return <div>No results</div>;

  return (
    <div className="flex flex-row h-96 w-full overflow-x-auto p-3">
      {omdbMovies.map((movie) => (
        <div
          key={movie.imdbID}
          className="flex-none text-center mr-10 h-full relative movie-search-result"
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
          <div className="movie-buttons absolute top-0 w-full flex justify-between p-2">
            <button className="bg-emerald-700 p-2 rounded">Have seen</button>
            <button className="bg-amber-700 p-2 rounded">Wanna see</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieSearchResults;
