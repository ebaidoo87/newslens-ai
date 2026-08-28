import {
  useContext,
} from "react";

import {
  ReadingHistoryContext,
  type ReadingHistoryContextType,
} from "../context/ReadingHistoryContext";


export function useReadingHistory():
ReadingHistoryContextType {
  const context =
    useContext(
      ReadingHistoryContext,
    );

  if (!context) {
    throw new Error(
      "useReadingHistory must be used within ReadingHistoryProvider",
    );
  }

  return context;
}