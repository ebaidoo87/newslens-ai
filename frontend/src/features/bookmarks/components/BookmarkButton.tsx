import {
  useState,
  type MouseEvent,
} from "react";

import {
  Bookmark,
  BookmarkCheck,
} from "lucide-react";

import {
  useBookmarks,
} from "../../../shared/context/BookmarkContext";

import type {
  Article,
} from "../../news/types/article";


interface BookmarkButtonProps {
  article: Article;
}


export default function BookmarkButton({
  article,
}: BookmarkButtonProps) {
  const {
    isBookmarked,
    addBookmark,
    removeBookmark,
  } = useBookmarks();

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const bookmarked =
    isBookmarked(article.id);


  async function handleToggle(
    event: MouseEvent<HTMLButtonElement>,
  ) {
    event.preventDefault();
    event.stopPropagation();

    setError("");
    setIsSubmitting(true);

    try {
      if (bookmarked) {
        await removeBookmark(
          article.id,
        );
      } else {
        await addBookmark(article);
      }
    } catch {
      setError(
        "Unable to update bookmark.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }


  return (
    <div>
      <button
        type="button"
        onClick={handleToggle}
        disabled={isSubmitting}
        aria-pressed={bookmarked}
        aria-label={
          bookmarked
            ? "Remove saved article"
            : "Save article"
        }
        className={`
          inline-flex
          items-center
          gap-2
          rounded-lg
          border
          px-3
          py-2
          text-sm
          font-medium
          transition
          disabled:cursor-not-allowed
          disabled:opacity-60
          ${
            bookmarked
              ? "border-yellow-600 bg-yellow-950 text-yellow-300"
              : "border-gray-700 text-gray-300 hover:border-yellow-600 hover:text-yellow-300"
          }
        `}
      >
        {bookmarked ? (
          <BookmarkCheck size={17} />
        ) : (
          <Bookmark size={17} />
        )}

        {isSubmitting
          ? "Updating..."
          : bookmarked
            ? "Saved"
            : "Save"}
      </button>

      {error && (
        <p className="mt-2 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}