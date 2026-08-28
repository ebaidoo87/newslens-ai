import {
  useContext,
} from "react";

import {
  SearchContext,
  type SearchContextType,
} from "../context/SearchContext";


export function useSearch():
SearchContextType {
  const context =
    useContext(SearchContext);

  if (!context) {
    throw new Error(
      "useSearch must be used within SearchProvider",
    );
  }

  return context;
}