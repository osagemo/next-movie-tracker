import { trpc } from "@/utils/trpc";
import { useState } from "react";

const useOmdbMovieSearch = () => {
  const [userQuery, setUserQuery] = useState("");

  const {
    error: searchError,
    isFetched: searchIsFetched,
    data: searchResult,
  } = trpc.useQuery(["searchMoviesByTitle", { userQuery: userQuery }], {
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: Boolean(userQuery), // disable until we have user input
  });

  return {
    userQuery,
    setUserQuery,
    searchError,
    searchIsFetched,
    searchResult: searchResult?.result,
  };
};

export default useOmdbMovieSearch;
