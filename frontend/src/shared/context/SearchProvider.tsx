import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import {
  SearchContext,
} from "./SearchContext";


export function SearchProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const [
    search,
    setSearchState,
  ] = useState(
    searchParams.get(
      "search",
    ) ?? "",
  );


  function setSearch(
    value: string,
  ): void {
    setSearchState(
      value,
    );
  }


  useEffect(() => {
    setSearchParams(
      (currentParams) => {
        const params =
          new URLSearchParams(
            currentParams,
          );

        if (search) {
          params.set(
            "search",
            search,
          );
        } else {
          params.delete(
            "search",
          );
        }

        return params;
      },
      {
        replace: true,
      },
    );
  }, [
    search,
    setSearchParams,
  ]);


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