import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  useAuth,
} from "../hooks/useAuth";

import {
  clearReadingHistory,
  getReadingHistory,
  type ReadingHistoryItem,
} from "../services/readingHistoryApi";

import {
  ReadingHistoryContext,
} from "./ReadingHistoryContext";

import {
  useQueryClient,
} from "@tanstack/react-query";

import {
  queryKeys,
} from "../lib/queryKeys";
  
export function ReadingHistoryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useAuth();

  const queryClient =
  useQueryClient();

  const invalidatePersonalizedFeeds =
  useCallback(
    async (): Promise<void> => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey:
            queryKeys.recommendations.all,
        }),

        queryClient.invalidateQueries({
          queryKey:
            queryKeys.discovery.all,
        }),
      ]);
    },
    [queryClient],
  );

  const [
    history,
    setHistory,
  ] = useState<
    ReadingHistoryItem[]
  >([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);


  const refreshHistory =
    useCallback(
      async (): Promise<void> => {
        if (!isAuthenticated) {
          setHistory([]);
          return;
        }

        setIsLoading(true);

        try {
          const data =
            await getReadingHistory();

          setHistory(
            data,
          );
        } catch {
          setHistory([]);
        } finally {
          setIsLoading(false);
        }
      },
      [isAuthenticated],
    );


  async function clearHistory():
  Promise<void> {
    const previousHistory =
      history;

    setHistory([]);

    try {
      await clearReadingHistory();

      await invalidatePersonalizedFeeds();
    } catch (error) {
      setHistory(
        previousHistory,
      );

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

    void refreshHistory();
  }, [
    isAuthenticated,
    isAuthLoading,
    refreshHistory,
  ]);


  return (
    <ReadingHistoryContext.Provider
      value={{
        history,
        historyCount:
          history.length,
        isLoading,
        refreshHistory,
        clearHistory,
      }}
    >
      {children}
    </ReadingHistoryContext.Provider>
  );
}