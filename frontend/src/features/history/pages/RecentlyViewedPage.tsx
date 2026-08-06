import {
  useEffect,
  useState,
} from "react";

import {
  Clock3,
  Trash2,
} from "lucide-react";

import ArticleCard from "../../news/components/ArticleCard";

import {
  clearReadingHistory,
  getReadingHistory,
  type ReadingHistoryItem,
} from "../../../shared/services/readingHistoryApi";

import {
  useToast,
} from "../../../shared/context/ToastContext";


export default function RecentlyViewedPage() {
  const [
    history,
    setHistory,
  ] = useState<ReadingHistoryItem[]>([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isClearing,
    setIsClearing,
  ] = useState(false);

  const {
    showToast,
  } = useToast();


  useEffect(() => {
    async function loadHistory() {
      try {
        const data =
          await getReadingHistory();

        setHistory(data);
      } catch {
        showToast(
          "Unable to load reading history.",
          "error",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadHistory();
  }, [showToast]);


  async function handleClearHistory() {
    if (history.length === 0) {
      return;
    }

    const previousHistory =
      history;

    setHistory([]);
    setIsClearing(true);

    try {
      await clearReadingHistory();

      showToast(
        "Reading history cleared.",
        "success",
      );
    } catch {
      setHistory(previousHistory);

      showToast(
        "Unable to clear reading history.",
        "error",
      );
    } finally {
      setIsClearing(false);
    }
  }


  if (isLoading) {
    return (
      <div className="py-20 text-center text-gray-400">
        Loading recently viewed articles...
      </div>
    );
  }


  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">
            Recently Viewed
          </h1>

          <p className="mt-2 text-gray-400">
            Articles you recently opened.
          </p>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={handleClearHistory}
            disabled={isClearing}
            className="inline-flex items-center gap-2 rounded-lg border border-red-800 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-950 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={17} />

            {isClearing
              ? "Clearing..."
              : "Clear history"}
          </button>
        )}
      </div>


      {history.length === 0 ? (
        <div className="rounded-2xl border border-gray-800 bg-gray-900 px-6 py-16 text-center">
          <Clock3
            size={48}
            className="mx-auto text-gray-500"
          />

          <h2 className="mt-5 text-2xl font-semibold">
            No reading history yet
          </h2>

          <p className="mx-auto mt-3 max-w-md text-gray-400">
            Open an article from the news feed
            and it will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {history.map(
            (item) => (
              <div
                key={item.id}
                className="space-y-2"
              >
                <p className="text-sm text-gray-500">
                  Viewed{" "}
                  {new Date(
                    item.viewed_at,
                  ).toLocaleString()}
                </p>

                <ArticleCard
                  article={item.article}
                />
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}