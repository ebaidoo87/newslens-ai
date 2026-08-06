import { api } from "./api";

import type { Article } from "../../features/news/types/article";

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
) {
  const { data } = await api.post(
    `/bookmarks/${articleId}`,
  );

  return data;
}

export async function removeBookmark(
  articleId: number,
) {
  await api.delete(
    `/bookmarks/${articleId}`,
  );
}

export async function getBookmarks() {
  const { data } = await api.get<
    BookmarkedArticle[]
  >("/bookmarks");

  return data;
}

export async function getBookmarkStatus(
  articleId: number,
) {
  const { data } =
    await api.get<BookmarkStatus>(
      `/bookmarks/check/${articleId}`,
    );

  return data;
}