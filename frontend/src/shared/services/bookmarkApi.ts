import {
  apiClient,
} from "../api/client";

import {
  endpoints,
} from "../api/endpoints";

import type {
  Article,
} from "../../features/news/types/article";


export interface Bookmark {
  id: number;
  article_id: number;
  user_id: number;
  created_at: string;
}


export interface BookmarkedArticle {
  id: number;
  created_at: string;
  article: Article;
}


export interface BookmarkStatus {
  article_id: number;
  is_bookmarked: boolean;
}


export async function addBookmark(
  articleId: number,
): Promise<Bookmark> {
  const response =
    await apiClient.post<Bookmark>(
      endpoints.bookmarks.add(
        articleId,
      ),
    );

  return response.data;
}


export async function removeBookmark(
  articleId: number,
): Promise<void> {
  await apiClient.delete(
    endpoints.bookmarks.remove(
      articleId,
    ),
  );
}


export async function getBookmarks():
Promise<BookmarkedArticle[]> {
  const response =
    await apiClient.get<
      BookmarkedArticle[]
    >(
      endpoints.bookmarks.list,
    );

  return response.data;
}


export async function getBookmarkStatus(
  articleId: number,
): Promise<BookmarkStatus> {
  const response =
    await apiClient.get<
      BookmarkStatus
    >(
      endpoints.bookmarks.check(
        articleId,
      ),
    );

  return response.data;
}