import { api } from "./api";

import type { Article } from "../../features/news/types/article";

export async function getArticles(
  search?: string,
  category?: string,
): Promise<Article[]> {

  const response = await api.get<Article[]>("/articles", {
    params: {
      search,
      category,
    },
  });

  return response.data;
}


export async function getArticleById(
  id: number,
): Promise<Article> {

  const response = await api.get<Article>(
    `/articles/${id}`,
  );

  return response.data;
}