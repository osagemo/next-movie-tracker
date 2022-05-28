import { MovieListWithMovies } from "@/server/utils/prisma";

type MovieListProps = {
  movieList: MovieListWithMovies;
};
const MovieList = ({ movieList }: MovieListProps) => {
  return (
    <div>
      {movieList.movies.map((movie) => (
        <div key={movie.id}>{movie.title}</div>
      ))}
    </div>
  );
};

export default MovieList;
