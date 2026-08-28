import {
  apiClient,
} from "../api/client";

import {
  endpoints,
} from "../api/endpoints";

import type {
  Article,
} from "../../features/news/types/article";


export interface TrendingArticle {
  article: Article;
  trending_score: number;
  bookmark_count: number;
  view_count: number;
  reasons: string[];
}


export interface TrendingOptions {
  country?: string;
  limit?: number;
}


export async function getTrendingArticles({
  country,
  limit = 20,
}: TrendingOptions = {}):
Promise<TrendingArticle[]> {
  const response =
    await apiClient.get<
      TrendingArticle[]
    >(
      endpoints.trending,
      {
        params: {
          country,
          limit,
        },
      },
    );

  return response.data;
}