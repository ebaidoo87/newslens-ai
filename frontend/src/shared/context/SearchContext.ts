import {
  createContext,
} from "react";


export interface SearchContextType {
  search: string;

  setSearch: (
    value: string,
  ) => void;
}


export const SearchContext =
  createContext<
    SearchContextType | undefined
  >(undefined);