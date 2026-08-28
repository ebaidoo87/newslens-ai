import {
  useContext,
} from "react";

import {
  BookmarkContext,
  type BookmarkContextType,
} from "../context/BookmarkContext";


export function useBookmarks():
BookmarkContextType {
  const context =
    useContext(
      BookmarkContext,
    );

  if (!context) {
    throw new Error(
      "useBookmarks must be used within BookmarkProvider",
    );
  }

  return context;
}