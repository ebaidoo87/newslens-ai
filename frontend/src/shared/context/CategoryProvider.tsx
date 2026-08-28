import {
  useState,
  type ReactNode,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import {
  CategoryContext,
} from "./CategoryContext";


export function CategoryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const [
    category,
    setCategoryState,
  ] = useState(
    searchParams.get(
      "category",
    ) ?? "all",
  );


  function setCategory(
    value: string,
  ): void {
    setCategoryState(
      value,
    );

    const params =
      new URLSearchParams(
        searchParams,
      );

    if (value === "all") {
      params.delete(
        "category",
      );
    } else {
      params.set(
        "category",
        value,
      );
    }

    setSearchParams(
      params,
      {
        replace: true,
      },
    );
  }


  return (
    <CategoryContext.Provider
      value={{
        category,
        setCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}