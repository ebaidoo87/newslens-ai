import {
  createContext,
} from "react";

import type {
  Article,
} from "../../features/news/types/article";

import type {
  BookmarkedArticle,
} from "../services/bookmarkApi";



export interface BookmarkContextType {
  bookmarks: BookmarkedArticle[];

  bookmarkedArticleIds:
    Set<number>;

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

  refreshBookmarks:
    () => Promise<void>;
}


export const BookmarkContext =
  createContext<
    BookmarkContextType | undefined
  >(undefined);