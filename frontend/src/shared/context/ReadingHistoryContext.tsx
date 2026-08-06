import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "./AuthContext";

import {
  clearReadingHistory as clearHistoryRequest,
  getReadingHistory,
  type ReadingHistoryItem,
} from "../services/readingHistoryApi";


interface ReadingHistoryContextType {
  history: ReadingHistoryItem[];
  historyCount: number;
  isLoading: boolean;
  refreshHistory: () => Promise<void>;
  clearHistory: () => Promise<void>;
}


const ReadingHistoryContext = createContext<
  ReadingHistoryContextType | undefined
>(undefined);


export function ReadingHistoryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useAuth();

  const [
    history,
    setHistory,
  ] = useState<ReadingHistoryItem[]>([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);


  async function refreshHistory():
  Promise<void> {
    if (!isAuthenticated) {
      setHistory([]);
      return;
    }

    setIsLoading(true);

    try {
      const data =
        await getReadingHistory();

      setHistory(data);
    } catch {
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  }


  async function clearHistory():
  Promise<void> {
    const previousHistory = history;

    setHistory([]);

    try {
      await clearHistoryRequest();
    } catch (error) {
      setHistory(previousHistory);

      throw error;
    }
  }


  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!isAuthenticated) {
      setHistory([]);
      return;
    }

    refreshHistory();
  }, [
    isAuthenticated,
    isAuthLoading,
  ]);


  return (
    <ReadingHistoryContext.Provider
      value={{
        history,
        historyCount: history.length,
        isLoading,
        refreshHistory,
        clearHistory,
      }}
    >
      {children}
    </ReadingHistoryContext.Provider>
  );
}


export function useReadingHistory():
ReadingHistoryContextType {
  const context =
    useContext(ReadingHistoryContext);

  if (!context) {
    throw new Error(
      "useReadingHistory must be used within ReadingHistoryProvider",
    );
  }

  return context;
}