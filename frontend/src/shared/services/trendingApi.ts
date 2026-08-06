import { api } from "./api";

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
    await api.get<TrendingArticle[]>(
      "/trending",
      {
        params: {
          country,
          limit,
        },
      },
    );

  return response.data;
}