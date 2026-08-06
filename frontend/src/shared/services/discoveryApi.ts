import { api } from "./api";

import type {
  Article,
} from "../../features/news/types/article";


export interface DiscoveredArticle {
  article: Article;
  discovery_score: number;
  reasons: string[];
}


export async function getDiscoveryArticles(
  limit = 20,
): Promise<DiscoveredArticle[]> {
  const response = await api.get<
    DiscoveredArticle[]
  >(
    "/discover",
    {
      params: {
        limit,
      },
    },
  );

  return response.data;
}