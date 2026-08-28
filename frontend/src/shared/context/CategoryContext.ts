import {
  createContext,
} from "react";


export interface CategoryContextType {
  category: string;

  setCategory: (
    value: string,
  ) => void;
}


export const CategoryContext =
  createContext<
    CategoryContextType | undefined
  >(undefined);