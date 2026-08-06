import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "./AuthContext";

import {
  addBookmark as addBookmarkRequest,
  getBookmarks,
  removeBookmark as removeBookmarkRequest,
  type BookmarkedArticle,
} from "../services/bookmarkApi";

import type {
  Article,
} from "../../features/news/types/article";


interface BookmarkContextType {
  bookmarks: BookmarkedArticle[];
  bookmarkedArticleIds: Set<number>;
  bookmarkCount: number;
  isLoading: boolean;
  isBookmarked: (
    articleId: number,
  ) => boolean;
  addBookmark: (
  article: Article,
) => Promise<void>;
  removeBookmark: (
    articleId: number,
  ) => Promise<void>;
  refreshBookmarks: () => Promise<void>;
}


const BookmarkContext = createContext<
  BookmarkContextType | undefined
>(undefined);


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
  ] = useState<BookmarkedArticle[]>([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);


  const bookmarkedArticleIds = useMemo(
    () =>
      new Set(
        bookmarks.map(
          (bookmark) =>
            bookmark.article.id,
        ),
      ),
    [bookmarks],
  );


  async function refreshBookmarks():
  Promise<void> {
    if (!isAuthenticated) {
      setBookmarks([]);
      return;
    }

    setIsLoading(true);

    try {
      const data = await getBookmarks();

      setBookmarks(data);
    } catch {
      setBookmarks([]);
    } finally {
      setIsLoading(false);
    }
  }


  async function addBookmark(
  article: Article,
): Promise<void> {
  if (
    bookmarkedArticleIds.has(article.id)
  ) {
    return;
  }

  const temporaryBookmark: BookmarkedArticle = {
    id: -article.id,
    created_at: new Date().toISOString(),
    article,
  };

  setBookmarks((currentBookmarks) => [
    temporaryBookmark,
    ...currentBookmarks,
  ]);

  try {
    await addBookmarkRequest(article.id);

    await refreshBookmarks();
  } catch (error) {
    setBookmarks((currentBookmarks) =>
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
  const previousBookmarks = bookmarks;

  setBookmarks((currentBookmarks) =>
    currentBookmarks.filter(
      (bookmark) =>
        bookmark.article.id !== articleId,
    ),
  );

  try {
    await removeBookmarkRequest(articleId);
  } catch (error) {
    setBookmarks(previousBookmarks);

    throw error;
  }
}


  function isBookmarked(
    articleId: number,
  ): boolean {
    return bookmarkedArticleIds.has(
      articleId,
    );
  }


  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!isAuthenticated) {
      setBookmarks([]);
      return;
    }

    refreshBookmarks();
  }, [
    isAuthenticated,
    isAuthLoading,
  ]);


  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        bookmarkedArticleIds,
        bookmarkCount:
          bookmarks.length,
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


export function useBookmarks():
BookmarkContextType {
  const context =
    useContext(BookmarkContext);

  if (!context) {
    throw new Error(
      "useBookmarks must be used within BookmarkProvider",
    );
  }

  return context;
}