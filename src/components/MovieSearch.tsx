import { debounce } from "@/utils/misc";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

type MovieSearchProps = {
  onSearchChange: Dispatch<SetStateAction<string>>;
};
/**
 * Debounces input before calling onSearchChange
 * @param onSearchChange
 */
const MovieSearch = ({ onSearchChange }: MovieSearchProps) => {
  const [searchInput, setSearchInput] = useState("");

  const debouncedSearch = useCallback(
    debounce((text: string) => {
      onSearchChange(text);
    }, 1000),
    []
  );

  useEffect(() => {
    debouncedSearch(searchInput);
  }, [searchInput, debouncedSearch]);

  return (
    <input
      className="text-black mx-auto"
      onChange={(e) => setSearchInput(e.currentTarget.value)}
    ></input>
  );
};

export default MovieSearch;
