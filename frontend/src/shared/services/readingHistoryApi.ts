import {
  apiClient,
} from "../api/client";

import {
  endpoints,
} from "../api/endpoints";

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
  await apiClient.post(
    endpoints.history.record(
      articleId,
    ),
  );
}


export async function getReadingHistory(
  limit = 50,
): Promise<ReadingHistoryItem[]> {
  const response =
    await apiClient.get<
      ReadingHistoryItem[]
    >(
      endpoints.history.list,
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
  await apiClient.delete(
    endpoints.history.clear,
  );
}