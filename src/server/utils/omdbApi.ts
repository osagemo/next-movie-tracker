import { OmdbSearchMovie } from "@/utils/omdb";

const omdbApiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY;
const baseUrl = `http://www.omdbapi.com?apikey=${omdbApiKey}`;

const omdbApi = {
  async findMovies(queryString: string, page: number = 1) {
    let url = `${baseUrl}&s=${queryString}&p=${page}`;
    const response = await fetch(url);
    const responseJson = await response.json();
    const foundMovies = responseJson.Search as OmdbSearchMovie[];
    return foundMovies;
  },
  async findMovie(imdbId: string) {
    const url = `http://www.omdbapi.com/?apikey=${omdbApiKey}&i=${imdbId}`;
    const response = await fetch(url);
    const responseJson: any = await response.json();
    if (responseJson.hasOwnProperty("Error"))
      throw new Error("Invalid imdb ID");

    return responseJson;
  },
};

export default omdbApi;
