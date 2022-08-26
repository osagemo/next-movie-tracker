import { MovieListWithMovies, prisma } from "@/server/utils/prisma";
import { Prisma } from "@prisma/client";

const movieListRepository = {
  async getSystemMovieListsForUser(
    userId: string
  ): Promise<MovieListWithMovies[]> {
    const userMovieListCount = await prisma.user_MovieList.count({
      where: { userId },
    });
    // create system defined lists if user has no lists
    if (userMovieListCount < 1) {
      this.createSystemMovieListsForUser(userId);
    }
    const movieLists = await prisma.movieList
      .findMany({
        where: {
          users: {
            some: {
              userId: userId,
            },
          },
          name: { startsWith: "system" },
        },
        include: {
          movies: {
            select: {
              movie: true,
            },
            orderBy: {
              addedAt: "desc",
            },
          },
        },
      })
      .catch((e) => {
        throw e;
      });

    // We need to flatten the response as "movies" from the include statement will refer to the many2many table
    const flattened = movieLists.map((list) => {
      return { ...list, movies: list.movies.map((movie) => movie.movie) };
    });
    return flattened;
  },

  async createSystemMovieListsForUser(userId: string) {
    const [seenList, wannaList] = await prisma.$transaction([
      prisma.movieList.create({
        data: {
          name: "system.seen",
          listType: "SEEN",
          users: {
            create: {
              addedAt: new Date(),
              userId,
            },
          },
        },
      }),
      prisma.movieList.create({
        data: {
          name: "system.wanna",
          listType: "WANNA",
          users: {
            create: {
              addedAt: new Date(),
              userId,
            },
          },
        },
      }),
    ]);
  },

  async addMovieToList(movie: Prisma.MovieCreateInput, movieListId: number) {
    const movieList = await prisma.movieList.findUnique({
      where: { id: movieListId },
    });
    const existingMovie = await prisma.movie.findFirst({
      where: {
        imdbId: movie.imdbId
      }
    });
    if (existingMovie)
      return await this.addExistingMovieToList(existingMovie.id, movieListId);
      
    if (!movieList) throw new Error("No movie list for provided id");

    return await prisma.movie.create({
      data: {
        ...movie,
        movieLists: {
          create: {
            movieListId: movieList.id,
          },
        },
      },
    });
  },

  async addExistingMovieToList(movieId: number, movieListId: number) {
    return await prisma.movieList_Movie.upsert({
      where: {
        movieId_movieListId: {
          movieId,
          movieListId
        }
      },
      update: {},
      create: {
        movieId,
        movieListId
      }
    });
  },

  async removeMovieFromList(imdbId: string, movieListId: number) {
    const movieList = await prisma.movieList.findUnique({
      where: { id: movieListId },
    });
    if (!movieList) throw new Error("No movie list for provided id");
    const existingMovie = await prisma.movie.findFirst({
      where: {
        imdbId
      }
    });
    if (!existingMovie) throw new Error("No existing movie for provided imdbId");

    return await prisma.movieList_Movie.delete({
      where: {
        movieId_movieListId: {
          movieId: existingMovie.id,
          movieListId
        }
      }
    });
  },
};

export default movieListRepository;