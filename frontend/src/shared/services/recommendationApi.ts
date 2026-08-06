import { api } from "./api";

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
  const response = await api.get<
    RecommendedArticle[]
  >(
    "/recommendations",
    {
      params: {
        limit,
      },
    },
  );

  return response.data;
}