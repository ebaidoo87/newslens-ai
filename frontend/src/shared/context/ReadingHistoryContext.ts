import {
  createContext,
} from "react";

import type {
  ReadingHistoryItem,
} from "../services/readingHistoryApi";



export interface ReadingHistoryContextType {
  history: ReadingHistoryItem[];
  historyCount: number;
  isLoading: boolean;

  refreshHistory:
    () => Promise<void>;

  clearHistory:
    () => Promise<void>;
}


export const ReadingHistoryContext =
  createContext<
    ReadingHistoryContextType
    | undefined
  >(undefined);