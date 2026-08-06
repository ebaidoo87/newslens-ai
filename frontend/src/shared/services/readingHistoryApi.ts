import { api } from "./api";

import type {
  Article,
} from "../../features/news/types/article";


export interface ReadingHistoryItem {
  id: number;
  viewed_at: string;
  article: Article;
}


export async function recordArticleView(
  articleId: number,
): Promise<void> {
  await api.post(
    `/history/${articleId}`,
  );
}


export async function getReadingHistory(
  limit = 50,
): Promise<ReadingHistoryItem[]> {
  const response = await api.get<
    ReadingHistoryItem[]
  >(
    "/history",
    {
      params: {
        limit,
      },
    },
  );

  return response.data;
}


export async function clearReadingHistory():
Promise<void> {
  await api.delete("/history");
}