
import ArticleCard from "../../news/components/ArticleCard";

import {
  useBookmarks,
} from "../../../shared/context/BookmarkContext";


export default function SavedArticlesPage() {
  const {
    bookmarks,
    isLoading,
  } = useBookmarks();


  if (isLoading) {
    return (
      <div className="py-20 text-center text-gray-400">
        Loading saved articles...
      </div>
    );
  }


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">
          Saved Articles
        </h1>

        <p className="mt-2 text-gray-400">
          Articles you have saved for later.
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="rounded-2xl border border-gray-800 bg-gray-900 px-6 py-16 text-center">
          <div className="text-5xl">
            ☆
          </div>

          <h2 className="mt-5 text-2xl font-semibold">
            No saved articles yet
          </h2>

          <p className="mx-auto mt-3 max-w-md text-gray-400">
            Browse the news feed and select
            Save on an article you want to
            read later.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {bookmarks.map(
            (bookmark) => (
              <ArticleCard
                key={bookmark.id}
                article={
                  bookmark.article
                }
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}