import {
  apiClient,
} from "../api/client";

import {
  endpoints,
} from "../api/endpoints";

import type {
  Article,
} from "../../features/news/types/article";


export interface RecommendedArticle {
  article: Article;
  score: number;
  reasons: string[];
}


export async function getRecommendations(
  limit = 20,
): Promise<RecommendedArticle[]> {
  const response =
    await apiClient.get<
      RecommendedArticle[]
    >(
      endpoints.recommendations,
      {
        params: {
          limit,
        },
      },
    );

  return response.data;
}