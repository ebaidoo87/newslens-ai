import {
  useState,
  type MouseEvent,
} from "react";

import {
  Bookmark,
  BookmarkCheck,
  LoaderCircle,
} from "lucide-react";

import {
  useAuth,
} from "../../../shared/context/AuthContext";

import {
  useBookmarks,
} from "../../../shared/context/BookmarkContext";

import {
  useToast,
} from "../../../shared/context/ToastContext";

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
    isAuthenticated,
  } = useAuth();

  const {
    isBookmarked,
    addBookmark,
    removeBookmark,
  } = useBookmarks();

  const {
    showToast,
  } = useToast();

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const bookmarked =
    isBookmarked(article.id);

  async function handleToggle(
    event: MouseEvent<HTMLButtonElement>,
  ) {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      showToast(
        "Sign in to save articles.",
        "info",
      );

      return;
    }

    setIsSubmitting(true);

    try {
      if (bookmarked) {
        await removeBookmark(
          article.id,
        );

        showToast(
          "Article removed from saved items.",
          "success",
        );
      } else {
        await addBookmark(article);

        showToast(
          "Article saved successfully.",
          "success",
        );
      }
    } catch {
      showToast(
        "Unable to update this bookmark.",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
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
        min-w-24
        items-center
        justify-center
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
      {isSubmitting ? (
        <LoaderCircle
          size={17}
          className="animate-spin"
        />
      ) : bookmarked ? (
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
  );
}