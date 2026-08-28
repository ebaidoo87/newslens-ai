import {
  apiClient,
} from "../api/client";

import {
  endpoints,
} from "../api/endpoints";

import type {
  Article,
} from "../../features/news/types/article";


export async function getArticles(
  search?: string,
  category?: string,
): Promise<Article[]> {
  const response =
    await apiClient.get<Article[]>(
      endpoints.articles.list,
      {
        params: {
          search,
          category,
        },
      },
    );

  return response.data;
}


export async function getArticleById(
  id: number,
): Promise<Article> {
  const response =
    await apiClient.get<Article>(
      endpoints.articles.detail(
        id,
      ),
    );

  return response.data;
}