import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useSearchParams } from "react-router-dom";


interface SearchContextType {

  search: string;

  setSearch: (
    value: string
  ) => void;

}


const SearchContext =
  createContext<SearchContextType | undefined>(
    undefined
  );


export function SearchProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [
    searchParams,
    setSearchParams
  ] = useSearchParams();


  const [
    search,
    setSearchState
  ] = useState(
    searchParams.get("search") ?? ""
  );


  useEffect(() => {

    const params =
      new URLSearchParams(
        searchParams
      );


    if (search) {

      params.set(
        "search",
        search
      );

    } else {

      params.delete(
        "search"
      );

    }


    setSearchParams(
      params,
      {
        replace: true,
      }
    );


  }, [search]);


  function setSearch(
    value: string
  ) {

    setSearchState(value);

  }


  return (

    <SearchContext.Provider
      value={{
        search,
        setSearch,
      }}
    >

      {children}

    </SearchContext.Provider>

  );

}


export function useSearch() {

  const context =
    useContext(
      SearchContext
    );


  if (!context) {

    throw new Error(
      "useSearch must be used within SearchProvider"
    );

  }


  return context;

}