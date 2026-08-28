import {
  apiClient,
} from "../api/client";

import {
  endpoints,
} from "../api/endpoints";

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
  const response =
    await apiClient.get<
      DiscoveredArticle[]
    >(
      endpoints.discovery,
      {
        params: {
          limit,
        },
      },
    );

  return response.data;
}