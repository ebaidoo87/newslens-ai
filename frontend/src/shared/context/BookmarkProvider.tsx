import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  useAuth,
} from "../hooks/useAuth";

import {
  addBookmark as addBookmarkRequest,
  getBookmarks,
  removeBookmark as removeBookmarkRequest,
  type BookmarkedArticle,
} from "../services/bookmarkApi";


import type {
  Article,
} from "../../features/news/types/article";

import {
  BookmarkContext,
} from "./BookmarkContext";


export function BookmarkProvider({
  children,
}: {
  children: ReactNode;
}) {
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useAuth();

  const [
    bookmarks,
    setBookmarks,
  ] = useState<
    BookmarkedArticle[]
  >([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);


  const bookmarkedArticleIds =
    useMemo(
      () =>
        new Set(
          bookmarks.map(
            (bookmark) =>
              bookmark.article.id,
          ),
        ),
      [bookmarks],
    );


  const bookmarkCount =
    bookmarks.length;


  const isBookmarked =
    useCallback(
      (
        articleId: number,
      ): boolean =>
        bookmarkedArticleIds.has(
          articleId,
        ),
      [bookmarkedArticleIds],
    );


  const refreshBookmarks =
    useCallback(
      async (): Promise<void> => {
        if (!isAuthenticated) {
          setBookmarks([]);
          return;
        }

        setIsLoading(true);

        try {
          const data =
            await getBookmarks();

          setBookmarks(
            data,
          );
        } catch {
          setBookmarks([]);
        } finally {
          setIsLoading(false);
        }
      },
      [isAuthenticated],
    );


  async function addBookmark(
  article: Article,
): Promise<void> {
  if (
    bookmarkedArticleIds.has(
      article.id,
    )
  ) {
    return;
  }

  const temporaryBookmark:
    BookmarkedArticle = {
      id: -article.id,
      created_at:
        new Date().toISOString(),
      article,
  };

  setBookmarks(
    (currentBookmarks) => [
      temporaryBookmark,
      ...currentBookmarks,
    ],
  );

  try {
    await addBookmarkRequest(
      article.id,
    );

    await refreshBookmarks();
  } catch (error) {
    setBookmarks(
      (currentBookmarks) =>
        currentBookmarks.filter(
          (bookmark) =>
            bookmark.article.id
            !== article.id,
        ),
    );

    throw error;
  }
}


  async function removeBookmark(
    articleId: number,
  ): Promise<void> {
    const previousBookmarks =
      bookmarks;

    setBookmarks(
      (currentBookmarks) =>
        currentBookmarks.filter(
          (bookmark) =>
            bookmark.article.id
            !== articleId,
        ),
    );

    try {
      await removeBookmarkRequest(
        articleId,
      );
    } catch (error) {
      setBookmarks(
        previousBookmarks,
      );

      throw error;
    }
  }


  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!isAuthenticated) {
      setBookmarks([]);
      return;
    }

    void refreshBookmarks();
  }, [
    isAuthenticated,
    isAuthLoading,
    refreshBookmarks,
  ]);


  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        bookmarkedArticleIds,
        bookmarkCount,
        isLoading,
        isBookmarked,
        addBookmark,
        removeBookmark,
        refreshBookmarks,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}