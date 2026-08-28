import {
  useContext,
} from "react";

import {
  CategoryContext,
  type CategoryContextType,
} from "../context/CategoryContext";


export function useCategory():
CategoryContextType {
  const context =
    useContext(
      CategoryContext,
    );

  if (!context) {
    throw new Error(
      "useCategory must be used inside CategoryProvider",
    );
  }

  return context;
}