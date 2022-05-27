import { prisma } from "@/server/utils/prisma";
import { Prisma } from "@prisma/client";

const movieListRepository = {
  async getSystemMovieListsForUser(userId: string) {
    const userMovieListCount = await prisma.user_MovieList.count({
      where: { userId },
    });
    // create system defined lists if user has no lists
    if (userMovieListCount < 1) {
      this.createSystemMovieListsForUser(userId);
    }
    const movieLists = await prisma.movieList.findMany({
      where: {
        users: {
          some: {
            userId: userId,
          },
        },
        name: { startsWith: "system" },
      },
      include: {
        movies: true,
      },
    });
    return movieLists;
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
              userId: userId ?? "", // userId is defined as per middleware
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
              userId: userId ?? "", // userId is defined as per middleware
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
};

export default movieListRepository;
